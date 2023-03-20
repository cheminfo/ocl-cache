import { readFileSync } from 'fs';

import pkg from 'openchemlib';

async function doAll() {
  const { Molecule } = pkg;

  const smiles = readFileSync('../../benchmark/smiles.txt', 'utf8').split(
    /\r?\n/,
  );
  let sum = 0;
  let i = 0;

  for (let smile of smiles) {
    let idcode = Molecule.fromSmiles(smile).getIDCode();
    let url = encodeURIComponent(idcode);

    console.time('en');
    let start = Date.now();
    await fetch(`http://ocl-cache.epfl.ch/v1/fromIDCode?idCode=${url}`);
    let end = Date.now();
    console.timeEnd('en');

    sum += end - start;
    i++;
    if (i > 100) break;
  }
  console.log('Average time: ', sum / i);
}

doAll();
//fbmp%60DBZLCIIrJJJIQQKHkDyIu%60u%40%40QAET%40%40%40