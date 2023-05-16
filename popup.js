console.log(document.getElementById("startScraping"));

document.getElementById("startScraping").addEventListener("click", function () {
  const fileTag = document.getElementById("fileTag").value;
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { fileTag: fileTag });
  });
});
