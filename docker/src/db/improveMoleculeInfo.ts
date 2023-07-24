import { InternalMoleculeInfo } from '../InternalMoleculeInfo';
import { MoleculeInfo } from '../MoleculeInfo';
import Debug from 'debug';

const debug = Debug('improveMoleculeInfo');

export function improveMoleculeInfo(data: InternalMoleculeInfo): MoleculeInfo {
  return {
    ...data,
    atoms: JSON.parse(data.atoms),
    ssIndex: Array.from(new Uint32Array(data.ssIndex)),
  };
}
