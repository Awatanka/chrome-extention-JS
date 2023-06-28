let myLeads = [];

const inputEl = document.getElementById("input-el");
const saveBtn = document.getElementById("input-btn");
const downloadBtn = document.getElementById("download-btn");
const ulEl = document.getElementById("ul-el");
const delBtn = document.getElementById("delete-btn");
const tabBtn = document.getElementById("save-btn");
const formatBtn = document.getElementById("format-select");

// Load leads from local storage
const loadLeadsFromLocalStorage = () => {
  const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"));
  if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage;
    renderLeads();
  }
};

// Render leads
const renderLeads = () => {
  const listItems = myLeads
    .map((lead) => {
      const shortenedLead = lead.startsWith("http")
        ? lead.replace(/(^\w+:|^)\/\//, "").split("/")[0]
        : lead;
      if (lead.startsWith("http")) {
        return `<li><a target="_blank" href="${lead}">${shortenedLead}</a></li>`;
      } else {
        return `<li>${shortenedLead}</li>`;
      }
    })
    .join("");
  ulEl.innerHTML = listItems;
};

// Clear local storage and leads
const clearLocalStorage = () => {
  localStorage.clear();
  myLeads = [];
  renderLeads();
};

// Save lead from input
const saveLead = () => {
  const lead = inputEl.value;
  myLeads.push(lead);
  inputEl.value = "";
  localStorage.setItem("myLeads", JSON.stringify(myLeads));
  renderLeads();
};

// Save lead from current tab
const saveTabLead = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    myLeads.push(tabs[0].url);
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    renderLeads();
  });
};

const downloadLeads = (fileFormat) => {
  if (fileFormat === "text") {
    let documentContent = "";

    for (let i = 0; i < myLeads.length; i++) {
      const lead = myLeads[i];
      const shortenedLead = lead.startsWith("http")
        ? lead.replace(/(^\w+:|^)\/\//, "").split("/")[0]
        : lead;

      if (lead.startsWith("http")) {
        // For links, include both the link and its shortened form
        documentContent += `Link: ${shortenedLead}\nURL: ${lead}\n\n`;
      } else {
        // For non-link content, include only the content
        documentContent += `Content: ${lead}\n\n`;
      }
    }

    const blob = new Blob([documentContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else if (fileFormat === "html") {
    let tableContent =
      "<table style='border-collapse: collapse; margin: 20px auto;'>\n"; // Added margin and centering style

    for (let i = 0; i < myLeads.length; i++) {
      const lead = myLeads[i];
      const shortenedLead = lead.startsWith("http")
        ? lead.replace(/(^\w+:|^)\/\//, "").split("/")[0]
        : lead;

      if (lead.startsWith("http")) {
        // For links, include both the link and its shortened form in a table row
        tableContent += `<tr>
        <td style='padding: 5px; border: 1px solid black; font-weight: bold; color: #333;'>Link:</td> <!-- Added font-weight and color -->
        <td style='padding: 5px; border: 1px solid black; color: #666;'>${shortenedLead}</td> <!-- Added color -->
      </tr>\n`;
        tableContent += `<tr>
        <td style='padding: 5px; border: 1px solid black; font-weight: bold; color: #333;'>URL:</td> <!-- Added font-weight and color -->
        <td style='padding: 5px; border: 1px solid black;'><a href='${lead}' style='color: #009688;'>${lead}</a></td> <!-- Added link color -->
      </tr>\n\n`;
      } else {
        // For non-link content, include only the content in a table row
        tableContent += `<tr>
        <td style='padding: 5px; border: 1px solid black; font-weight: bold; color: #333;'>Content:</td> <!-- Added font-weight and color -->
        <td style='padding: 5px; border: 1px solid black; color: #666;'>${lead}</td> <!-- Added color -->
      </tr>\n\n`;
      }
    }

    tableContent += "</table>";

    const blob = new Blob([tableContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};

// Event listeners
delBtn.addEventListener("dblclick", () => {
  console.log("double clicked!");
  clearLocalStorage();
});

saveBtn.addEventListener("click", () => {
  saveLead();
});

tabBtn.addEventListener("click", () => {
  saveTabLead();
});

downloadBtn.addEventListener("click", () => {
  const fileFormat = formatBtn.value;
  downloadLeads(fileFormat);
});

// Load leads from local storage on page load
loadLeadsFromLocalStorage();
