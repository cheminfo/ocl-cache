const { readFileSync } = require('fs');
const { join } = require('path');

const fetch = require('cross-fetch');
const pAll = require('p-all');

const server = 'http://127.0.0.1:20822';

async function doAll() {
  const smiles = readFileSync(join(__dirname, 'smiles.txt'), 'utf8').split(
    /\r?\n/,
  );

  console.log(`Number of smiles: ${smiles.length}`);
  console.time('smiles');

  const tasks = [];

  for (let smile of smiles) {
    tasks.push(() => {
      return fetch(
        `${server}/v1/fromSmiles?smiles=${encodeURIComponent(smile)}`,
      ).then(async (response) => {
        await response.json();
      });
    });
  }
  await pAll(tasks, { concurrency: 100 });
  console.timeEnd('smiles');
}

doAll();
