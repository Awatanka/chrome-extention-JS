let myLeads = [];
const inputEl = document.getElementById("input-el");
const saveBtn = document.getElementById("input-btn");
const downloadBtn = document.getElementById("download-btn");
const ulEl = document.getElementById("ul-el");
const delBtn = document.getElementById("delete-btn");
const tabBtn = document.getElementById("save-btn");

const loadLeadsFromLocalStorage = () => {
  const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"));
  if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage;
    renderLeads();
  }
};

const renderLeads = () => {
  const listItems = myLeads
    .map(
      (lead, index) =>
        `<li onclick="removeLead(${index})"><a target="_blank" href="${lead}">${lead}</a></li>`
    )
    .join("");
  ulEl.innerHTML = listItems;
};

const clearLocalStorage = () => {
  localStorage.clear();
  myLeads = [];
  renderLeads();
};

const saveLead = () => {
  myLeads.push(inputEl.value);
  inputEl.value = "";
  localStorage.setItem("myLeads", JSON.stringify(myLeads));
  renderLeads();
  console.log(localStorage.getItem("myLeads"));
};

const saveTabLead = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    myLeads.push(tabs[0].url);
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    renderLeads();
  });
};

const downloadLeads = () => {
  const leadsText = myLeads.join("\n");
  const blob = new Blob([leadsText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "leads.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const removeLead = (index) => {
  myLeads.splice(index, 1);
  localStorage.setItem("myLeads", JSON.stringify(myLeads));
  renderLeads();
};

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

loadLeadsFromLocalStorage();
