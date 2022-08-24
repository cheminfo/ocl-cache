import { readFileSync } from "fs";
import { join } from "path";
import OpenChemLib from "openchemlib";

const { Molecule } = OpenChemLib;

import { calculateMoleculeInfoFromIDCodePromise } from "./calculate/calculateMoleculeInfoFromIDCodePromise.mjs";

async function doAll() {
  const smiles = readFileSync(
    new URL("smiles.txt", import.meta.url),
    "utf8"
  ).split(/\r?\n/);

  console.log(`Number of smiles: ${smiles.length}`);
  console.time("smiles");

  const todo = [];

  for (let smile of smiles) {
    todo.push(async () => {
      const molecule = Molecule.fromSmiles(smile);
      return calculateMoleculeInfoFromIDCodePromise(molecule.getIDCode);
    });
    console.log(todo);
    //const code = calculateMoleculeInfo(molecule);
    //const code = getNoStereoIDCode(molecule);
    //const code = getNoStereoTautomerIDCode(molecule);
    //const code = getTautomerIDCode(molecule);
  }
  console.log("todo");
  const results = await Promise.all(todo);
  console.log(results.join("").length);
  console.timeEnd("smiles");
}

doAll();

function getNoStereoIDCode(molecule) {
  const OCL = molecule.getOCL();
  return OCL.CanonizerUtil.getIDCode(molecule, OCL.CanonizerUtil.NOSTEREO);
}

function getNoStereoTautomerIDCode(molecule) {
  const OCL = molecule.getOCL();
  return OCL.CanonizerUtil.getIDCode(
    molecule,
    OCL.CanonizerUtil.NOSTEREO_TAUTOMER
  );
}

function getTautomerIDCode(molecule) {
  const OCL = molecule.getOCL();
  return OCL.CanonizerUtil.getIDCode(molecule, OCL.CanonizerUtil.TAUTOMER);
}
