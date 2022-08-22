export type MoleculeInfo = {
  mf: string;
  mw: number;
  em: number;
  idCode: string;
  noStereoID: string;
  noStereoTautomerID: string;
  ssIndex: number[];
  logS: number;
  logP: number;
  acceptorCount: number;
  donorCount: number;
  stereoCenterCount: number;
  rotatableBondCount: number;
  polarSurfaceArea: number;
};
