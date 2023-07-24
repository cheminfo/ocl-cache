import { InternalMoleculeInfo } from '../InternalMoleculeInfo';
import { MoleculeInfo } from '../MoleculeInfo';

export function improve(data: InternalMoleculeInfo): MoleculeInfo {
  return {
    ...data,
    atoms: JSON.parse(data.atoms),
    ssIndex: Array.from(new Uint32Array(data.ssIndex)),
  };
}
