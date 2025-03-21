import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to SQLite database
const dbPath = path.resolve(__dirname, "db/database.sqlite");
const db = new sqlite3.Database(dbPath);

export default db;
