import { MoleculeInfo } from './MoleculeInfo';

export type InternalMoleculeInfo = Omit<MoleculeInfo, 'ssIndex'> & {
  ssIndex: ArrayBufferLike;
};
