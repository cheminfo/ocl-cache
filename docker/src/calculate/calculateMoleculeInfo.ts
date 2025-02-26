import debugLibrary from 'debug';
import { MF } from 'mass-tools';
import { Molecule, MoleculeProperties } from 'openchemlib';
import { getMF } from 'openchemlib-utils';

import type { MoleculeInfo } from '../MoleculeInfo.ts';

const debug = debugLibrary('calculateMoleculeInfo');

export default function calculateMoleculeInfo(
  molecule: Molecule,
  options: { ignoreTautomer?: boolean } = {},
): MoleculeInfo {
  const { ignoreTautomer = false } = options;

  // @ts-expect-error - parts is not defined in the type and it should be fixed in mf
  const mf = getMF(molecule).parts.sort().join('.');
  const mfInfo = new MF(mf).getInfo();

  const idCode = molecule.getIDCode();
  const noStereoID = getNoStereoIDCode(molecule);

  const info: MoleculeInfo = {
    mf: mfInfo.mf,
    mw: mfInfo.mass,
    em: mfInfo.monoisotopicMass,
    charge: mfInfo.charge,
    atoms: mfInfo.atoms,
    unsaturation: mfInfo.unsaturation,
    idCode,
    noStereoID,
    noStereoTautomerID: getNoStereoTautomerIfSmall(
      mfInfo,
      molecule,
      noStereoID,
      ignoreTautomer,
    ),
    ...getProperties(molecule),
    ssIndex: getSSIndex(molecule),
  };

  return info;
}

function getNoStereoIDCode(molecule: Molecule) {
  molecule.stripStereoInformation();
  return molecule.getIDCode();
}

function getNoStereoTautomerIDCode(molecule: Molecule) {
  const OCL = molecule.getOCL();
  return OCL.CanonizerUtil.getIDCode(
    molecule,
    OCL.CanonizerUtil.NOSTEREO_TAUTOMER,
  );
}

function getSSIndex(molecule: Molecule): Int32Array {
  return Int32Array.from(molecule.getIndex());
}

function getProperties(molecule: Molecule) {
  const moleculeProperties = new MoleculeProperties(molecule);
  const fragmentMap: any[] = [];
  const nbFragments = molecule.getFragmentNumbers(fragmentMap, false, false);

  return {
    logS: moleculeProperties.logS,
    logP: moleculeProperties.logP,
    acceptorCount: moleculeProperties.acceptorCount,
    donorCount: moleculeProperties.donorCount,
    rotatableBondCount: moleculeProperties.rotatableBondCount,
    stereoCenterCount: moleculeProperties.stereoCenterCount,
    polarSurfaceArea: moleculeProperties.polarSurfaceArea,
    nbFragments,
  };
}

function getNoStereoTautomerIfSmall(
  mfInfo: any,
  molecule: Molecule,
  noStereoID: string,
  ignoreTautomer: boolean,
) {
  if (ignoreTautomer) {
    debug(`Ignore tautomer: ${mfInfo.mf}`);
    return noStereoID;
  }

  let small = true;
  if (mfInfo.atoms) {
    if (mfInfo.atoms.C > 50) small = false;
  } else if (mfInfo.parts) {
    for (const part of mfInfo.parts) {
      if (part.atoms.C > 50) small = false;
    }
  }

  if (small) {
    return getNoStereoTautomerIDCode(molecule);
  } else {
    debug(`Too big: ${mfInfo.mf}`);
    return noStereoID;
  }
}
