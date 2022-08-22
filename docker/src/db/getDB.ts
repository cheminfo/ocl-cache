import { join } from 'path';

import sqLite, { Database } from 'better-sqlite3';

let db: Database;

export default function getDB(): Database {
  if (!db) db = sqLite(join(__dirname, '../../db.sqlite'));

  const sql = `
CREATE TABLE IF NOT EXISTS molecules (
  idCode data_type PRIMARY KEY,
  mf data_type TEXT,
  em data_type REAL,
  mw data_type REAL,
  noStereoID data_type TEXT,
  noStereoTautomerID data_type TEXT,
  logS data_type REAL,
  logP data_type REAL,
  acceptorCount data_type INT,
  donorCount data_type INT,
  rotatableBondCount data_type INT,
  stereoCenterCount data_type INT,
  polarSurfaceArea data_type REAL,
  ssIndex data_type BLOB
);
`;

  db.exec(sql);
  return db;
}
