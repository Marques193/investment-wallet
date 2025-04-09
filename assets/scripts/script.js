const bodyStyle = document.querySelector("body");

// Tabela de ações
const stockTable = document.querySelector("#stock-table");

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
  const stockFormBalance = document.getElementById("stock-form-balance").value;

  //  Testa se os campos estao preenchidos
  if (stockFormName && stockFormAmount && stockFormBalance) {
    // Cria nova linha
    let table = document.getElementById("stock-table");
    let row = table.insertRow();
    row.classList.add("table-row");
    let nameCell = row.insertCell(0);
    let amountCell = row.insertCell(1);
    let balanceCell = row.insertCell(2);
    let priceCell = row.insertCell(3);
    let xxxCell = row.insertCell(4);
    let xxxxCell = row.insertCell(5);
    let xxxxxxCell = row.insertCell(6);

    nameCell.innerHTML = stockFormName;
    amountCell.innerHTML = stockFormAmount;
    amountCell.classList.add("stock-amount");

    // API da bolsa
    async function getStockData(ticker) {
      const url = `https://brapi.dev/api/quote/${ticker}?token=b5chHpq5uJNtrc4hzAbNwd`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(response.status);
      }

      json = await response.json();

      // Pega o preco atual e adiciona na tabela
      stockPrice = json.results[0].regularMarketPrice;

      priceCell.innerHTML = `R$ ${stockPrice}`;

      // Calculo de saldo
      const stockBalance = document.getElementsByClassName("stock-amount");
      console.log(stockBalance);
    }

    getStockData(stockFormName);

    // fecha o formulario
    cancelButton();
  } else {
    alert("Todos os campos devem ser preenchidos!");
  }
};
