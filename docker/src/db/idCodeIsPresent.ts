import { DB } from './getDB.ts';

export default function idCodeIsPresent(idCode: string, db: DB) {
  return db.isIDCode.get(idCode) !== undefined;
}
