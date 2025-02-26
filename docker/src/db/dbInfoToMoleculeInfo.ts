import type { MoleculeInfo, DBMoleculeInfo } from '../MoleculeInfo.ts';

export function dbInfoToMoleculeInfo(data: DBMoleculeInfo): MoleculeInfo {
  return {
    ...data,
    atoms: JSON.parse(data.atoms),
    ssIndex: new Int32Array(new Uint8Array(data.ssIndex).buffer),
  };
}
