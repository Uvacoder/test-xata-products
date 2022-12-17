const fs = require('fs').promises;
const fetch = require('node-fetch');
const { AsyncParser } = require('@json2csv/node');

(async function run() {
  console.log(`Creating ${NUMBER_OF_PRODUCTS} products...`);
  console.log('This may take a minute!')

  const response = await fetch('https://fakestoreapi.com/products');
  const json = await response.json();

  const products = json.map(item => {
    const product = {
      ...item,
      rating_rate: item.rating.rate,
      rating_count: item.rating.count,
      price: item.price * 100,
    }

    delete product.rating;
    delete product.description;

    return product;
  });

  try {
    const parser = new AsyncParser({
      delimiter: '|'
    });
    const csv = await parser.parse(products).promise();

    await fs.writeFile(`${process.cwd()}/products.csv`, csv);
  } catch(e) {
    console.log(`Failed to write CSV: ${e.message}`);
  }

  console.log('Done.');
})();