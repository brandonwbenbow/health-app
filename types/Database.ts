import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApplicationName } from 'react-native-device-info';

import * as SQLite from 'expo-sqlite';

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

      CREATE TABLE IF NOT EXISTS bloodpressures (
        id INTEGER PRIMARY KEY,
        user_id INTEGER DEFAULT 1,
        lower_value REAL,
        upper_value, REAL,
        ts DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS drinks (
        id INTEGER PRIMARY KEY,
        user_id INTEGER DEFAULT 1,
        value REAL,
        ts DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS sleep_hours (
        id INTEGER PRIMARY KEY,
        user_id INTEGER DEFAULT 1,
        value REAL,
        ts DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
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

  async getLatestTimestampFromAllTables() {
    let q = (table: string) => {
      return `SELECT datetime(ts, 'localtime') as ts FROM ${table} WHERE DATE(ts, 'localtime') = DATE('now', 'localtime')`;
    }

    let queries = [
      this.query(q('weights')),
      this.query(q('bloodpressures')),
      this.query(q('drinks')),
      this.query(q('sleep_hours'))
    ];

    return await Promise.all(queries)
  }

  async getLastWeekForAllTables() {
    let q = (table: string) => {
      return `
        SELECT datetime(ts, 'localtime') as ts FROM ${table} 
        WHERE ts BETWEEN datetime('now', 'localtime', '-6 days') AND datetime('now', 'localtime', '+1 days')
      `;
    }

    let queries = [
      this.query(q('weights')),
      this.query(q('bloodpressures')),
      this.query(q('drinks')),
      this.query(q('sleep_hours'))
    ];

    let results = await Promise.all(queries);
    const dates = [
      new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      new Date(Date.now())
    ]

    const getMap = (arr: {ts: any}[]) => {
      let map = arr.map(({ ts }) => {
        let d = new Date(ts);
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}` 
      });

      let days = dates.map((d) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`);
      
      return days.map((d: string) => map.includes(d));
    }

    let obj = {
      weight: getMap(results[0]),
      heart: getMap(results[1]),
      water: getMap(results[2]),
      sleep: getMap(results[3])
    }

    return obj;
  }
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