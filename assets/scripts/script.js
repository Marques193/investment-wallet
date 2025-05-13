const bodyStyle = document.querySelector("body");

// Carrega o localStorage ao abrir a página

// Tabela de ações
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
  const stockFormAmount = parseFloat(
    document.getElementById("stock-form-amount").value
  );
  const stockFormPrice = parseFloat(
    document.getElementById("stock-form-balance").value
  );

  //  Testa se os campos estao preenchidos
  if (stockFormName && stockFormAmount && stockFormPrice) {
    // API da bolsa
    saveLocalStorage(stockFormName, stockFormPrice, stockFormAmount);

    // fecha o formulario
    cancelButton();
  } else {
    alert("Todos os campos devem ser preenchidos!");
  }
};

//  Salva no localStorage

let saveLocalStorage = (nome, preco, qtd) => {
  stockObj = {
    name: nome,
    price: preco,
    amount: qtd,
  };
  if (localStorage.getItem("stocks") === null) {
    stocks = [];
    stocks.push(stockObj);
    localStorage.setItem("stocks", JSON.stringify(stocks));
  } else {
    checkLocalStock(nome, qtd, preco, stockObj);
  }
  loadStockData();
};

//  Carrega do localStorage
let loadStockData = () => {
  if (localStorage.getItem("stocks")) {
    stocks = JSON.parse(localStorage.getItem("stocks"));
  } else {
    stocks = [];
  }
  let table = document.getElementById("stock-table");
  tbody = table.querySelector("tbody");

  tbody.innerHTML = "";

  stocks.forEach((stocks) => {
    let loadedRow = tbody.insertRow();
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

let checkLocalStock = (stockName, stockAmount, stockPrice, stockObj) => {
  // Carregar as acoes existentes ou inicializar vazio
  let stocks = [];
  let loadedStocks = [];
  loadedStocks.push(JSON.parse(localStorage.getItem("stocks")));
  stocks = stocks.concat(loadedStocks).flat();

  // Variável para verificar se encontrou a acao
  let found = false;

  // Procurar pela acao existente
  for (let i = 0; i < stocks.length; i++) {
    if (stocks[i].name === stockName) {
      // Atualizar quantidade e preço médio
      stocks[i].amount = parseFloat(stocks[i].amount) + stockAmount;
      stocks[i].price = (parseFloat(stocks[i].price) + stockPrice) / 2;
      found = true;
      break;
    }
  }

  // Se não encontrou, adicionar nova acao
  if (!found) {
    stocks.push(stockObj);
  }

  // Salvar  acoes atualizados no localStorage
  localStorage.setItem("stocks", JSON.stringify(stocks));
  stocks = JSON.parse(localStorage.getItem("stocks"));
};
