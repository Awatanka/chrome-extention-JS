let myLeads = [];

const inputEl = document.getElementById("input-el");
const saveBtn = document.getElementById("input-btn");
const downloadBtn = document.getElementById("download-btn");
const ulEl = document.getElementById("ul-el");
const delBtn = document.getElementById("delete-btn");
const tabBtn = document.getElementById("save-btn");

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

const downloadLeads = () => {
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
};

// Convert leads array to CSV format
const convertArrayToCSV = (leads) => {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Lead\n"; // Header row

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    csvContent += `"${lead}"\n`; // Lead row
  }

  return csvContent;
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
  downloadLeads();
});

// Load leads from local storage on page load
loadLeadsFromLocalStorage();

console.log(myLeads);
