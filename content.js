(async () => {
  // Gets the keys to remove from the config file
  let keysToRemove;

  try {
    const envSrc = chrome.runtime.getURL("env.js");
    const env = await import(envSrc);

    if (env) {
      const { KEYS_TO_REMOVE: keysToRemoveFromConfig } = env.default;
      keysToRemove = keysToRemoveFromConfig.split(",");
    }
  } catch (error) {
    // If the config file is not found, it uses the default keys to remove
    keysToRemove = [];
  }

  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    // Gets all the links from the page
    const fileTag = request.fileTag;
    const links = Array.from(document.querySelectorAll("a"));
    const data = links.map((link) => link.href.split("/")[3]);

    // Clean data from duplicates and keys to remove
    const dataWithoutDuplicates = [...new Set(data)];

    const dataWithoutKeysToRemove = dataWithoutDuplicates.filter(
      (element) => !keysToRemove.includes(element)
    );

    // Gets the current date and formats it to be used as a file name
    const today = new Date();

    let day = String(today.getDate()).padStart(2, "0");
    let month = String(today.getMonth() + 1).padStart(2, "0");
    let year = today.getFullYear();

    let formatedDate = `${year}-${month}-${day}`;

    // Creates the file name
    const fileName = `${fileTag}_${formatedDate}_${dataWithoutKeysToRemove.length}.csv`;

    // Creates the CSV file and downloads it
    const csvContent =
      "data:text/csv;charset=utf-8," + dataWithoutKeysToRemove.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);

    link.click();
  });
})();
