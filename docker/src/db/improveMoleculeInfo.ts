//import Debug from 'debug';

import { InternalMoleculeInfo } from '../InternalMoleculeInfo';
import { MoleculeInfo } from '../MoleculeInfo';

//const debug = Debug('improveMoleculeInfo');

export function improveMoleculeInfo(data: InternalMoleculeInfo): MoleculeInfo {
  return {
    ...data,
    atoms: JSON.parse(data.atoms),
    ssIndex: Array.from(new Int32Array(new Uint8Array(data.ssIndex).buffer)),
  };
}
