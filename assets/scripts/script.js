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
  const stockFormPrice = document.getElementById("stock-form-balance").value;

  //  Testa se os campos estao preenchidos
  if (stockFormName && stockFormAmount && stockFormPrice) {
    // Cria nova linha
    let table = document.getElementById("stock-table");
    let row = table.insertRow();
    row.classList.add("table-row");
    let nameCell = row.insertCell(0);
    let amountCell = row.insertCell(1);
    let balanceCell = row.insertCell(2);
    let priceCell = row.insertCell(3);
    let averageCell = row.insertCell(4);
    let varCell = row.insertCell(5);
    let xxxxxxCell = row.insertCell(6);

    nameCell.innerHTML = stockFormName;
    amountCell.innerHTML = stockFormAmount;
    amountCell.classList.add(`${stockFormName}-stock-amount`);
    averageCell.innerHTML = stockFormPrice;

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
      const stockAmount = document.querySelector(
        `.${stockFormName}-stock-amount`
      ).innerHTML;

      let stockBalance = stockAmount * stockPrice;
      balanceCell.innerHTML = stockBalance;

      // Calculo de variaçao
      let stockVar = ((stockPrice / stockFormPrice - 1) * 100).toFixed(2);
      varCell.innerHTML = `${stockVar}%`;
    }

    getStockData(stockFormName);

    saveLocalStock(stockFormName, stockFormAmount, stockFormPrice);

    // fecha o formulario
    cancelButton();
  } else {
    alert("Todos os campos devem ser preenchidos!");
  }
};

//  Salva no localStorage
let saveLocalStock = (stockName, stockAmount, stockPrice) => {
  let stocks;
  if (localStorage.getItem("stocks") === null) {
    stocks = [];
  } else {
    stocks = JSON.parse(localStorage.getItem("stocks"));
  }

  const stockObj = {
    name: stockName,
    amount: stockAmount,
    price: stockPrice,
  };

  stocks.push(stockObj);
  localStorage.setItem("stocks", JSON.stringify(stocks));
};

//  Carrega do localStorage
let loadLocalStock = () => {
  if (localStorage.getItem("stocks") === null) {
    stocks = [];
  } else {
    stocks = JSON.parse(localStorage.getItem("stocks"));
  }

  stocks.forEach((stocks, i) => {
    const stock = stocks[i];
    let table = document.getElementById("stock-table");

    let loadedRow = table.insertRow();
    loadedRow.classList.add("table-row");
    console.log(stock);

    // let loadedStockName = loadedRow.insertCell(0);
    // loadedStockName.innerHTML = stock[index].name;
    // let loadedStockAmount = loadedRow.insertCell(1);
    // loadedStockAmount.innerHTML = stock.amount;
  });
};
