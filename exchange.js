// Функція для отримання поточного курсу гривні до долара
function getExchangeRate() {
  fetch(
    'https://open.er-api.com/v6/latest/UAH?app_id=b746dab3bb4348849f737a213420d61e',
  )
    .then((response) => response.json())
    .then((data) => {
      const rate = (1 / data.rates.USD).toFixed(2); // Округлення до двох знаків після коми
      document.getElementById('exchangeRate').innerText = `1 USD = ${rate} грн`;
    })
    .catch((error) => console.error('Помилка отримання курсу валют:', error));
}

// Функція для обміну гривень на долари
function exchangeCurrency() {
  const amount = parseFloat(document.getElementById('amount').value);
  if (!isNaN(amount)) {
    const currencyType = document.querySelector(
      'input[name="currencyType"]:checked',
    ).value;
    const url =
      currencyType === 'uahToUsd'
        ? 'https://open.er-api.com/v6/latest/UAH?app_id=b746dab3bb4348849f737a213420d61e'
        : 'https://open.er-api.com/v6/latest/USD?app_id=b746dab3bb4348849f737a213420d61e';
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const rate =
          currencyType === 'uahToUsd' ? 1 / data.rates.USD : data.rates.UAH;
        const result =
          currencyType === 'uahToUsd' ? amount / rate : amount * rate;
        document.getElementById('result').innerText = `${amount} ${
          currencyType === 'uahToUsd' ? 'грн' : 'USD'
        } = ${result.toFixed(2)} ${
          currencyType === 'uahToUsd' ? 'USD' : 'грн'
        }`;
      })
      .catch((error) => console.error('Помилка обміну валют:', error));
  } else {
    alert('Будь ласка, введіть коректну суму.');
  }
}

// Отримання поточного курсу гривні до долара під час завантаження сторінки
window.onload = getExchangeRate;
