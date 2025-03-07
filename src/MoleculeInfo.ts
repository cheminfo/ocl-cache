export interface MoleculeInfo {
  mf: string;
  mw: number;
  em: number;
  charge: number;
  idCode: string;
  noStereoID: string;
  noStereoTautomerID: string;
  failedTautomerID: 0 | 1; // if failed we use noStereoID
  ssIndex: number[];
  logS: number;
  logP: number;
  acceptorCount: number;
  donorCount: number;
  stereoCenterCount: number;
  rotatableBondCount: number;
  polarSurfaceArea: number;
  nbFragments: number;
  unsaturation: number | undefined;
  atoms: Record<string, number>;
}

export type DBMoleculeInfo = Omit<MoleculeInfo, 'ssIndex' | 'atoms'> & {
  atoms: Uint8Array;
  ssIndex: Uint8Array;
  ssIndex0: bigint;
  ssIndex1: bigint;
  ssIndex2: bigint;
  ssIndex3: bigint;
  ssIndex4: bigint;
  ssIndex5: bigint;
  ssIndex6: bigint;
  ssIndex7: bigint;
};
