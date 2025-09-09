const bodyStyle = document.querySelector("body");

// Carrega o localStorage ao abrir a página
let a = "stocks";
let b = "fiis";

// Tabela de ações

// Botão para adicionar ações
let addStockButton = (type) => {
  const stockForm = document.querySelector(`.${type}-form`);
  // Escurece a tela
  bodyStyle.classList.add("backdrop");

  stockForm.style.display = "block";
};

// Fechar formulário
let cancelButton = (type) => {
  const stockForm = document.querySelector(`.${type}-form`);
  bodyStyle.classList.remove("backdrop");

  stockForm.style.display = "none";
};

// Pegar valores do formulário

let getStockValues = (type) => {
  const stockFormName = document.getElementById(`${type}-form-name`).value;
  const stockFormAmount = parseFloat(
    document.getElementById(`${type}-form-amount`).value
  );
  const stockFormPrice = parseFloat(
    document.getElementById(`${type}-form-balance`).value
  );

  //  Testa se os campos estao preenchidos
  if (stockFormName && stockFormAmount && stockFormPrice) {
    // API da bolsa
    saveLocalStorage(stockFormName, stockFormPrice, stockFormAmount, type);

    // fecha o formulario
    cancelButton(type);
  } else {
    alert("Todos os campos devem ser preenchidos!");
  }
};

//  Salva no localStorage

let saveLocalStorage = (nome, preco, qtd, type) => {
  stockObj = {
    name: nome,
    price: preco,
    amount: qtd,
  };
  if (localStorage.getItem(type) === null) {
    stocks = [];
    stocks.push(stockObj);
    localStorage.setItem(type, JSON.stringify(stocks));
  } else {
    checkLocalStock(nome, qtd, preco, stockObj, type);
  }
  loadStockData(type);
};

//  Carrega do localStorage
let loadStockData = (type) => {
  if (localStorage.getItem(type)) {
    stocks = JSON.parse(localStorage.getItem(type));
  } else {
    stocks = [];
  }
  let table = document.getElementById(`${type}-table`);
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

      // botao de remover linha
      deleteCell = loadedRow.insertCell(6);
      let btn = document.createElement("button");
      btn.innerHTML = "X";
      deleteCell.appendChild(btn);
      deleteCell.classList.add("remove-button");

      if (type === "stocks") {
        btn.setAttribute("onClick", `removeRow(a, this)`);
      } else if (type === "fiis") {
        btn.setAttribute("onClick", `removeRow(b, this)`);
      }

      // btn.setAttribute("onClick", `removeRow(${type}, this)`);
    }
    loadFromApi(stocks.name);
  });
  setTimeout(function () {
    updateTableHeader(type);
  }, 1500);
};

// botao de remover linhas
let removeRow = (type, index) => {
  tableType = document.getElementById(`${type}-table`);
  let row = index.closest("tr");
  let rowIndex = row.rowIndex;

  let loadedArray = JSON.parse(localStorage.getItem(type));
  loadedArray.splice(rowIndex - 1, 1);

  // atualiza a tabela pelo localStorage
  localStorage.setItem(type, JSON.stringify(loadedArray));
  loadStockData(type);
};

let checkLocalStock = (stockName, stockAmount, stockPrice, stockObj, type) => {
  // Carregar as acoes existentes ou inicializar vazio
  let stocks = [];
  let loadedStocks = [];
  loadedStocks.push(JSON.parse(localStorage.getItem(type)));
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
  localStorage.setItem(type, JSON.stringify(stocks));
  stocks = JSON.parse(localStorage.getItem(type));
};

// Atualizar cabecalho da tabela
let updateTableHeader = (type) => {
  const tableHeader = document.getElementById(`${type}-table`);
  const rows = tableHeader.getElementsByTagName("tr");
  let tableBalance = 0;

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].cells[2].textContent;
    console.log(cells);
  }
  // console.log(rows[0]);
};
