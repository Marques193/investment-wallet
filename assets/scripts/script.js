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
  const stockFormPrice = parseFloat(
    document.getElementById("stock-form-balance").value
  );

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

    nameCell.innerHTML = stockFormName;
    amountCell.innerHTML = parseFloat(stockFormAmount);
    amountCell.classList.add(`${stockFormName}-stock-amount`);
    averageCell.innerHTML = "R$ " + parseFloat(stockFormPrice).toFixed(2);

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

      priceCell.innerHTML = `R$ ${parseFloat(stockPrice).toFixed(2)}`;

      // Calculo de saldo
      const stockAmount = document.querySelector(
        `.${stockFormName}-stock-amount`
      ).innerHTML;

      let stockBalance = stockAmount * stockPrice;
      balanceCell.innerHTML = "R$ " + parseFloat(stockBalance).toFixed(2);

      // Calculo de variaçao
      let stockVar = parseFloat(
        (stockPrice / stockFormPrice - 1) * 100
      ).toFixed(2);
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

    // checa se ja tem um item igual
    stocks.forEach((stock, i) => {
      if (stock.name === stockName) {
        stocks[i].amount = parseFloat(stocks[i].amount) + 10;
      }
    });
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

  stocks.forEach((stocks) => {
    let table = document.getElementById("stock-table");

    let loadedRow = table.insertRow();
    loadedRow.classList.add("table-row");

    // carrega o nome e quantidade
    let loadedNameCell = loadedRow.insertCell(0);
    loadedNameCell.innerHTML = stocks.name;

    let loadedAmountCell = loadedRow.insertCell(1);
    loadedAmountCell.innerHTML = stocks.amount;

    // uso da API para pegar o preço atual
    async function loadFromApi(stock) {
      const url = `https://brapi.dev/api/quote/${stock}?token=b5chHpq5uJNtrc4hzAbNwd`;

      const response = await fetch(url);

      let json = await response.json();

      let balanceCell = loadedRow.insertCell(2);
      balanceCell.innerHTML =
        "R$ " + (stocks.amount * json.results[0].regularMarketPrice).toFixed(2);

      let apiPriceCell = loadedRow.insertCell(3);
      apiPriceCell.innerHTML =
        "R$ " + parseFloat(json.results[0].regularMarketPrice).toFixed(2);

      let loadedAverageCell = loadedRow.insertCell(4);
      loadedAverageCell.innerHTML = "R$ " + parseFloat(stocks.price).toFixed(2);

      let apiVarCell = loadedRow.insertCell(5);
      let apiStockVar = (
        (json.results[0].regularMarketPrice / stocks.price - 1) *
        100
      ).toFixed(2);
      apiVarCell.innerHTML = `${apiStockVar}%`;
    }
    loadFromApi(stocks.name);
  });
};
