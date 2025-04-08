const bodyStyle = document.querySelector("body");

// Tabela de ações
const stockTable = document.querySelector("#stock-table");

const stockName = document.querySelector(".stock-name");
const stockAmount = document.querySelector(".stock-amount");
const stockBalance = document.querySelector("#stock-balance");
const stockPrice = document.querySelector("#stock-price");
const stockAverage = document.querySelector("#stock-average");
const stockVar = document.querySelector("#stock-var");
const stockDy = document.querySelector("#stock-dy");

const stockForm = document.querySelector(".stock-form");

// Botão para adicionar ações
let addStockButton = () => {
  // Escurece a tela
  bodyStyle.classList.add("backdrop");

  stockForm.style.display = "block";
};

// Fechar formulário
let cancelButton = () => {
  bodyStyle.classList.remove("backdrop");

  stockForm.style.display = "none";
};

// Pegar valores do formulário

let getStockValues = () => {
  const stockFormName = document.getElementById("stock-form-name").value;
  const stockFormAmount = document.getElementById("stock-form-amount").value;
  const stockFormPrice = document.getElementById("stock-form-price").value;

  //  Testa se os campos estao preenchidos
  if (stockFormName && stockFormAmount && stockFormPrice) {
    // Cria nova linha
    let table = document.getElementById("stock-table");
    let row = table.insertRow();
    row.classList.add("table-row");
    let nameCell = row.insertCell(0);
    let amountCell = row.insertCell(1);
    let xxCell = row.insertCell(2);
    let xxxCell = row.insertCell(3);
    let priceCell = row.insertCell(4);
    let xxxxCell = row.insertCell(5);
    let xxxxxxCell = row.insertCell(6);

    nameCell.innerHTML = stockFormName;
    amountCell.innerHTML = stockFormAmount;
    priceCell.innerHTML = stockFormPrice;

    // fecha o formulario
    cancelButton();
  } else {
    alert("Todos os campos devem ser preenchidos!");
  }
};
