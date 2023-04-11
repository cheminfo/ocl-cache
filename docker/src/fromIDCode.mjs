import { readFileSync } from 'fs';

import pkg from 'openchemlib';

async function doAll() {
  const { Molecule } = pkg;

  const smiles = readFileSync('../../benchmark/smiles.txt', 'utf8')
    .split(/\r?\n/)
    .slice(0, 500);
  let sum = 0;

  for (let smile of smiles) {
    let idcode = Molecule.fromSmiles(smile).getIDCode();
    let url = encodeURIComponent(idcode);

    //   console.time('one smiles');
    let start = performance.now();
    const response = await fetch(
      `http://ocl-cache.epfl.ch/v1/fromIDCode?idCode=${url}`,
    );
    //    const response = await fetch(`http://127.0.0.1:20822/v1/fromIDCode?idCode=${url}`);
    const data = await response.json();
    let end = performance.now();
    //    console.timeEnd('one smiles');

    sum += end - start;
  }
  console.log('Average time: ', sum / smiles.length);
}

doAll();
//fbmp%60DBZLCIIrJJJIQQKHkDyIu%60u%40%40QAET%40%40%40
