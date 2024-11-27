const autocannon = require('autocannon');

// Конфігурації для кожного тесту навантаження
const testConfigs = [
  {
    name: 'GET All Products Test',
    url: 'https://localhost/api/products',
    method: 'GET',
    connections: 100,
    duration: 30,
  },
  {
    name: 'POST Create Product Test',
    url: 'https://localhost/api/products',
    method: 'POST',
    payload: { name: 'New Product', price: 99.99 },
    connections: 50,
    duration: 30,
  },
  {
    name: 'PUT Update Product Test',
    url: 'https://localhost/api/products/1', // Оновлення товару з id=1
    method: 'PUT',
    payload: { name: 'Updated Product', price: 79.99 },
    connections: 50,
    duration: 30,
  },
];

// Функція для форматування та виведення результатів
function logSummary(name, result) {
  const summary = `
  📊 Load Test Summary for ${name}:
  ======================================================
  📅 Duration: ${result.duration}s
  👥 Connections: ${result.connections}
  🔁 Total Requests Sent: ${result.requests.sent}
  ------------------------------------------------------
  💀 Errors: ${result.errors}
  ------------------------------------------------------
  🚦 Status Codes:
      - 1xx: ${result['1xx'] || 0}
      - 2xx: ${result['2xx'] || 0}
      - 3xx: ${result['3xx'] || 0}
      - 4xx: ${result['4xx'] || 0}
      - 5xx: ${result['5xx'] || 0}
  📈 Requests per Second: ${result.requests.average || 0}
  🕒 Average Latency (ms): ${result.latency.average || 0}
  🔄 Total Throughput (bytes): ${result.throughput.total || 0}
  `;

  console.log(summary);
}

// Функція для запуску тесту навантаження на основі конфігурації
function runTest(config) {
  const testConfig = {
    url: config.url,
    connections: config.connections,
    duration: config.duration,
    method: config.method,
    body: config.payload ? JSON.stringify(config.payload) : null,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  console.log(`Starting load test: ${config.name}`);

  autocannon(testConfig, (err, result) => {
    if (err) {
      console.error(`Error running load test for ${config.name}:`, err);
    } else {
      logSummary(config.name, result);
    }
  });
}

// Функція для запуску всіх тестів навантаження
function runLoadTests() {
  console.log('🚀 Initiating all load tests...');
  for (const config of testConfigs) {
    runTest(config);
  }
}

runLoadTests();
