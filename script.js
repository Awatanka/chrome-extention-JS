let myLeads = [];
const inputEl = document.getElementById("input-el");
const saveBtn = document.getElementById("input-btn");
const link = "www.awesomelead.com";
const ulEl = document.getElementById("ul-el");

localStorage.clear();
let leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"));
if (leadsFromLocalStorage) {
  myLeads = leadsFromLocalStorage;
  renderLeads();
}

console.log(myLeads);

saveBtn.addEventListener("click", function () {
  myLeads.push(inputEl.value);
  inputEl.value = "";
  localStorage.setItem("myLeads", JSON.stringify(myLeads));
  renderLeads();
  console.log(localStorage.getItem("myLeads"));
});

function renderLeads() {
  let listItems = "";

  for (let i = 0; i < myLeads.length; i++) {
    listItems += `<li><a target="_blank" href="${myLeads[i]}">${myLeads[i]}</a></li>`;
  }

  ulEl.innerHTML = listItems;
}
