chrome.runtime.onMessage.addListener((message) => {
    if (!message.format) return;
  
    const rows = Array.from(document.querySelectorAll("table.waffle tr")).map(row => {
      return Array.from(row.querySelectorAll("td, th")).map(cell => cell.innerText);
    });
  
    const headers = rows[0];
    const data = rows.slice(1).map(row => {
      return row.reduce((acc, cell, i) => {
        acc[headers[i]] = cell;
        return acc;
      }, {});
    });
  
    let output = "";
    if (message.format === "json") {
      output = JSON.stringify(data, null, 2);
    } else if (message.format === "jsonl") {
      output = data.map(row => JSON.stringify(row)).join("\n");
    }
  
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
    link.download = `sheet.${message.format}`;
    link.click();
  
    URL.revokeObjectURL(url);
  });
  