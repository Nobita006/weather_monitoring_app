CREATE TABLE IF NOT EXISTS cities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    temperature REAL,
    humidity REAL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
