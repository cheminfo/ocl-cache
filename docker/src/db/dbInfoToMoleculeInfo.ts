import { deserialize } from 'bson';

import type { MoleculeInfo, DBMoleculeInfo } from '../MoleculeInfo.ts';

export function dbInfoToMoleculeInfo(data: DBMoleculeInfo): MoleculeInfo {
  const {
    ssIndex0,
    ssIndex1,
    ssIndex2,
    ssIndex3,
    ssIndex4,
    ssIndex5,
    ssIndex6,
    ssIndex7,
    ...rest
  } = data;
  return {
    ...rest,
    atoms: deserialize(data.atoms),
    ssIndex: Array.from(new Int32Array(new Uint8Array(data.ssIndex).buffer)),
  };
}
