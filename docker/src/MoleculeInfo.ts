export interface MoleculeInfo {
  mf: string;
  mw: number;
  em: number;
  charge: number;
  idCode: string;
  noStereoID: string;
  noStereoTautomerID: string;
  ssIndex: Int32Array;
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
  atoms: ArrayBufferLike;
  ssIndex: Uint8Array<ArrayBufferLike>;
  ssIndex0: BigInt;
  ssIndex1: BigInt;
  ssIndex2: BigInt;
  ssIndex3: BigInt;
  ssIndex4: BigInt;
  ssIndex5: BigInt;
  ssIndex6: BigInt;
  ssIndex7: BigInt;
};
