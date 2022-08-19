import { Database } from 'better-sqlite3';

let stmt: any;

export default function idCodeIsPresent(idCode: string, db: Database) {
  if (!stmt) {
    stmt = db.prepare('SELECT 1 FROM molecules WHERE idCode = ?');
  }

  return stmt.get(idCode) !== undefined;
}
