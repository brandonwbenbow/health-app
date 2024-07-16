import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApplicationName } from 'react-native-device-info';

import * as SQLite from 'expo-sqlite';
import { KG } from '@/constants/Numbers';

export type DBParams = SQLite.SQLiteBindParams;

export class Database {
  static instance: Database | null;
  static getInstance() {
    if (Database.instance) { return Database.instance; }
    Database.instance = new Database();
    return Database.instance;
  }

  private init: boolean = false;
  private db: SQLite.SQLiteDatabase | null = null;

  constructor() {}

  async configure() {
    this.db = await SQLite.openDatabaseAsync('local.db');
    await this.db?.execAsync(`
      CREATE TABLE IF NOT EXISTS weights (
        id INTEGER PRIMARY KEY,
        user_id INTEGER DEFAULT 1,
        value REAL,
        ts DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS calories (
        id INTEGER PRIMARY KEY,
        user_id INTEGER DEFAULT 1,
        value REAL,
        ts DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      DROP VIEW IF EXISTS daily_calories;
      CREATE VIEW IF NOT EXISTS daily_calories AS SELECT
        date(ts, 'localtime') AS day,
        SUM(value) AS value,
        GROUP_CONCAT(value ORDER BY ts) AS records,
        GROUP_CONCAT(id ORDER BY ts) AS ids
      FROM calories
      GROUP BY day;

      CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY,
        user_id INTEGER DEFAULT 1,
        type INTEGER DEFAULT 0,
        value REAL,
        ts DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      DROP VIEW IF EXISTS daily_activities;
      CREATE VIEW IF NOT EXISTS daily_activities AS SELECT
        date(ts, 'localtime') AS day,
        SUM(value) AS hours,
        GROUP_CONCAT(value ORDER BY ts) AS records,
        GROUP_CONCAT(type ORDER BY ts) AS types,
        GROUP_CONCAT(id ORDER BY ts) AS ids
      FROM activities
      GROUP BY day;

      DROP VIEW IF EXISTS day_summary;
      CREATE VIEW IF NOT EXISTS day_summary AS SELECT
        date(w.ts, 'localtime') AS date,
        w.value AS kilo,
        dc.value AS calories,
        da.hours AS hours
      FROM weights w
        LEFT JOIN daily_calories dc ON date(w.ts, 'localtime') = dc.day
        LEFT JOIN daily_activities da ON date(w.ts, 'localtime') = da.day
      ORDER BY ts desc;

      DROP VIEW IF EXISTS week_summary;
      CREATE VIEW IF NOT EXISTS week_summary AS SELECT
        strftime('%W', day) week,
        strftime('%Y', day) year,
        MIN(kilo) AS min_kilo,
        MAX(kilo) AS max_kilo,
        GROUP_CONCAT(kilo) AS kilos,
        AVG(calories) AS avg_calories,
        SUM(calories) / 7 AS week_avg_calories,
        AVG(hours) AS avg_exercise_hours,
        SUM(hours) / 7 AS week_avg_exercise_hours
      FROM days
      GROUP BY week
      ORDER BY day desc;
    `);
  }

  async resetDatabase() {
    await this.db?.closeAsync();
    await SQLite.deleteDatabaseAsync('local.db');
    await this.configure();
  }

  async run(source: string, params: SQLite.SQLiteBindParams = [], defaultValue: any = null) {
    if (!this.init) { await this.configure(); }
    if (this.db == null) { return defaultValue; }
    return this.db?.runAsync(source, params);
  }

  async query(source: string, params: SQLite.SQLiteBindParams = [], defaultValue: any = null) {
    if (!this.init) { await this.configure(); }
    if (this.db == null) { return defaultValue; }
    return this.db?.getAllAsync(source, params);
  }

  //#region Table Calls for App
  async getDaily(date: Date): Promise<DataRecord> {
    let weights = await this.query(
      `SELECT * FROM weights WHERE date(ts, 'localtime') = date(?, 'localtime') LIMIT 1`,
      [date.toISOString()]
    );

    let calories = await this.query(
      `SELECT * FROM calories WHERE date(ts, 'localtime') = date(?, 'localtime')`,
      [date.toISOString()]
    );
    
    let activities = await this.query(
      `SELECT * FROM activities WHERE date(ts, 'localtime') = date(?, 'localtime')`,
      [date.toISOString()]
    );

    // console.log("Day", result);
    return {
      date,
      weight: weights[0] ?? null,
      calories,
      activities
    }
  }

  async getWeekly(date: Date = new Date()): Promise<WeekRecord> {
    let week = sundayWeekYear(date)
    let dates = datesFromWeekNumber(week, date.getFullYear());
    let records = [];
    for(let i = 0; i < 7; i++) {
      let d = new Date(dates[0].getFullYear(), dates[0].getMonth(), dates[0].getDate() + i);
      if(d.getTime() > Date.now()) { break; }
      records.push(await this.getDaily(d));
    }

    return { records, week, year: date.getFullYear() };
  }

  async getDaySummaries(offset = 0, limit = 7) {
    return await this.query(
      `SELECT * FROM day_summary LIMIT ? OFFSET ?`,
      [limit, offset]
    )
  }

  async getWeekSummaries(offset = 0, limit = 20) {
    return await this.query(
      `SELECT * FROM week_summary LIMIT ? OFFSET ?`,
      [limit, offset]
    );
  }
  //#region Weights
  async getWeights(offset = 0, limit = 7) {
    let result = await this.query(
      `SELECT id, datetime(ts, 'localtime') as ts, value FROM weights ORDER BY ts desc LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return result.map((r: {id: any, ts: any, value: any}) => {
      return {
        id: r.id,
        ts: r.ts,
        kilos: r.value,
        pounds: r.value / KG
      }
    });
  }

  async addWeightFromCSV(rows: { value: number; ts: Date; }[]) {
    let str = `INSERT INTO weights (value, ts) VALUES ${rows.map((r) => {
      return `(${r.value}, '${r.ts.toISOString()}')`
    }).join(',')}`;

    await this.run(str);
  }

  async addWeight(kilo: number, date: Date = new Date()) {
    let str = `SELECT count() as count, id from weights WHERE date(ts, 'localtime') = date(?, 'localtime')`;
    let args: any[] = [date.toISOString()];
    const today = (await this.query(str, args))?.[0];
    if(today.count > 0) {
      str = `UPDATE weights SET value = ?, ts = ? WHERE id = ?`;
      args = [kilo, date.toISOString(), today.id]
    } else {
      str = `INSERT INTO weights (value, ts) VALUES (?, ?)`;
      args = [kilo, date.toISOString()];
    }

    await this.run(str, args);
  }

  async deleteWeight(id: number) {
    await this.run(`DELETE FROM weights WHERE id = ?`, [id]);
  }
  //#endregion
  //#endregion
}

export class LocalStorage {
  static async getJSON(key: string) {
    try {
      let value = await AsyncStorage.getItem(key);
      let json = {};
      if(value != null) {
        json = JSON.parse(value);
      }
      return json;
    } catch(err) {
      console.log("Loading Error:", err);
    }
  }

  static async setJSON(key: string, object: Object) {
    try {
      let value = JSON.stringify(object);
      await AsyncStorage.setItem(key, value);
    } catch(err) {
      console.log("Saving Error:", err);
      Alert.alert(getApplicationName(), "Failed saving to local storage.")
    }
  }
}

// #region Types
export type Record = {
  ts: number,
  id: number
}

export type WeightRecord = Record & {
  kilos: number,
  pounds: number
}

export type CalorieRecord = Record & {
  value: number
}

export type ActivityRecord = Record & {
  type: number,
  value: number
}

export type DataRecord = {
  weight: WeightRecord,
  calories: CalorieRecord[],
  activities: ActivityRecord[],
  date: Date
}

export type WeekRecord = {
  records: DataRecord[],
  week: number,
  year: number
}

export type DaySummary = {
  date: string,
  kilo: number,
  calories: number,
  hours: number
}

export type WeekSummary = {
  week: number,
  year: number,
  min_kilo: number,
  max_kilo: number,
  kilos: string,
  avg_calories: number,
  week_avg_calories: number,
  avg_exercise_hours: number,
  week_avg_exercise_hours: number
}
// #endregion Types

const firstSundayOfWeekYear = (date: Date = new Date()) => {
  let ps = new Date(date);
  ps.setDate(ps.getDate() - ps.getDay());

  let lfs = new Date(ps.getFullYear(), 0, 7);

  let fs = new Date(lfs);
  fs.setDate(lfs.getDate() - lfs.getDay());
  return fs;
}

const sundayWeekYear = (date: Date = new Date()) => {
  let firstSunday = firstSundayOfWeekYear();
  let week = Math.ceil((((date.getTime() - firstSunday.getTime()) / 86400000) + firstSunday.getDay() + 1) / 7);

  return week;
}

const datesFromWeekNumber = (week: number, year: number) => {
  let fs = firstSundayOfWeekYear(new Date(year, 0, 7));
  fs.setDate(fs.getDate() + ((week - 1) * 7));

  return [fs, new Date(fs.getFullYear(), fs.getMonth(), fs.getDate() + 6)];
}