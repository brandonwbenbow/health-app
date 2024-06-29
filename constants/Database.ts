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
        user_id INTEGER,
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