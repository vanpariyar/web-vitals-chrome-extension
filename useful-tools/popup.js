// document.getElementById("json").addEventListener("click", () => convertSheet("json"));
document.getElementById("jsonl").addEventListener("click", () => convertSheet("jsonl"));

function convertSheet(format) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ["content.js"]
    }, () => {
      chrome.runtime.sendMessage({ format });
    });
  });
}

document.getElementById("upload-csv").addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".csv";
  input.addEventListener("change", handleFileUpload);
  input.click();
});

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const csvData = reader.result;
    const json = csvToJson(csvData);
    downloadFile(JSON.stringify(json, null, 2), "sheet.json", "application/json");
  };
  reader.readAsText(file);
}

function csvToJson(csv) {
  const lines = csv.split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map(line => {
    const values = line.split(",");
    return headers.reduce((acc, header, i) => {
      acc[header] = values[i];
      return acc;
    }, {});
  });
}

function downloadFile(data, filename, type) {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
