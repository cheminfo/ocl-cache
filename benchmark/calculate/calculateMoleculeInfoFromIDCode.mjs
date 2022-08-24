import OpenChemLib from "openchemlib";

import { calculateMoleculeInfo } from "./calculateMoleculeInfo.mjs";

const { Molecule } = OpenChemLib;

export default function calculateMoleculeInfoFromIDCode(idCode) {
  return calculateMoleculeInfo(Molecule.fromIDCode(idCode));
}
