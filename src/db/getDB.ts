import fs, { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

import type { Database, Statement } from 'better-sqlite3';
import sqLite from 'better-sqlite3';
import pino from 'pino';
import Postgrator from 'postgrator';

import type { DBMoleculeInfo } from '../MoleculeInfo.ts';

const logger = pino({ messageKey: 'getDB' });

let db: Database;

/**
 * Returns a promise that resolves as an instance of the database
 * @returns promise that resolves as an instance of the database
 */
export default async function getDB(): Promise<DB> {
  if (!db?.open) {
    const path = join(import.meta.dirname, '../../sqlite/');
    if (!existsSync(path)) {
      mkdirSync(path);
    }
    db = sqLite(join(path, 'db.sqlite'));
    // https://www.sqlite.org/wal.html
    // Activating WAL mode allows to get a speed improvement of 100x !!!
    db.pragma('journal_mode = WAL');
    await prepareDB(db);

    setInterval(() => {
      fs.stat(join(path, 'db.sqlite-wal'), (err, stat) => {
        if (err) {
          if (err.code !== 'ENOENT') throw err;
        } else if (stat.size > 100000000) {
          db.pragma('wal_checkpoint(RESTART)');
          logger.info('Restarted wal file');
        }
      });
    }, 300000).unref();
  }

  return new DB(db);
}

/**
 * Returns a Promise that resolves to a temporary instance of the database
 * @returns promise that resolves as an instance of the temporary database
 */
export async function getTempDB(): Promise<DB> {
  const tempDB = sqLite(':memory:');
  await prepareDB(tempDB);
  return new DB(tempDB);
}

/**
 * Internal function that ensures that the schema of the database is up to date
 * @param db - the instance of sqlite3 database
 */
export async function prepareDB(db: Database): Promise<void> {
  const postgrator = new Postgrator({
    migrationPattern: join(import.meta.dirname, 'migrations/*'),
    driver: 'sqlite3',
    execQuery: (query) => {
      return new Promise((resolve) => {
        const stmt = db.prepare(query);
        try {
          const rows = stmt.all();
          resolve({ rows });
        } catch (error: any) {
          if (error.message.includes('This statement does not return data')) {
            stmt.run();
            resolve({ rows: [] });
          }
          throw error;
        }
      });
    },
    execSqlScript: (sqlScript) => {
      return new Promise((resolve) => {
        db.exec(sqlScript);
        resolve();
      });
    },
  });
  await postgrator.migrate();
}

/**
 * Class that represents the database and all its statements
 */
export class DB {
  db: Database;
  stmt: Record<string, Statement>;
  insertInfo: Statement<DBMoleculeInfo>;
  selectAllIDCode: Statement<Array<{ idCode: string }>>;
  searchIDCode: Statement<string, DBMoleculeInfo>;
  isIDCode: Statement<string, undefined | 1>;
  constructor(db: Database) {
    this.db = db;
    this.stmt = {};
    this.insertInfo = this.db.prepare(
      'INSERT INTO molecules VALUES (@idCode, @mf, @em, @mw, @charge, @noStereoID, @noStereoTautomerID, @failedTautomerID, @logS, @logP, @acceptorCount, @donorCount, @rotatableBondCount, @stereoCenterCount, @polarSurfaceArea, @nbFragments , @unsaturation, @atoms, @ssIndex, @ssIndex0, @ssIndex1, @ssIndex2, @ssIndex3, @ssIndex4, @ssIndex5, @ssIndex6, @ssIndex7)',
    );
    this.selectAllIDCode = this.db.prepare('SELECT idCode FROM molecules ');
    this.searchIDCode = this.db.prepare(
      ' SELECT * FROM molecules WHERE idCode = ?',
    );
    this.isIDCode = this.db.prepare(
      ' SELECT 1 FROM molecules WHERE idCode = ?',
    );
  }
}
