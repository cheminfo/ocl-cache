import OCL from 'openchemlib';
import workerpool from 'workerpool';

async function improveFixStereo(idCode) {
  let mol = OCL.Molecule.fromIDCode(idCode);
  mol.stripStereoInformation();
  let noStereoID = mol.getIDCode();
  let result = {
    noStereoIDFixed: noStereoID,
  };
  return result;
}

workerpool.worker({
  improveFixStereo,
});
