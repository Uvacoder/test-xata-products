import { getXataClient } from '@lib/xata';

const xata = getXataClient();

export default async function handler(req, res) {
  const { query, category } = JSON.parse(req.body);

  const table = {
    table: 'products'
  };

  if ( category ) {
    table.filter = {
      category
    }
  }

  const records = await xata.search.all(query, {
    tables: [table],
    fuzziness: 0,
    prefix: 'phrase',
  });
  const products = records.map(({ record }) => record);

  res.status(200).json({ products })
}
