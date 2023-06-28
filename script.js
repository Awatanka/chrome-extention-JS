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
  console.log(localStorage.getItem("myLeads"));
};

// Save lead from current tab
const saveTabLead = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    myLeads.push(tabs[0].url);
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    renderLeads();
  });
};

// Download leads as CSV
const downloadLeads = () => {
  let csvContent = "data:text/csv;charset=utf-8,";

  // Add data rows
  for (let i = 0; i < myLeads.length; i++) {
    csvContent += `"${myLeads[i]}"\n`;
  }

  // Create a download link
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "leads.csv");
  document.body.appendChild(link);

  // Trigger the download
  link.click();

  // Clean up
  document.body.removeChild(link);
};

// Convert leads and inputs array to CSV format
const convertArrayToCSV = (leads, inputs) => {
  const csvRows = [];

  for (let i = 0; i < leads.length; i++) {
    const csvRow = `"${leads[i]}"\n"${inputs[i]}"\n\n`; // Separate rows for leads and content
    csvRows.push(csvRow);
  }

  return csvRows.join("");
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
