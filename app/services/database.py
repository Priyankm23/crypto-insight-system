import sqlite3
from app.models.user import User
from passlib.context import CryptContext
import json
from typing import List

DATABASE_URL = "db/user.db"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def init_user_db():
    conn = sqlite3.connect(DATABASE_URL)
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            uploaded_file_paths TEXT DEFAULT '[]'
        )
    """)
    conn.commit()
    conn.close()

def init_metrics_db():
    conn = sqlite3.connect(DATABASE_URL)
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS metrics (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            value REAL NOT NULL,
            user_id INTEGER NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    conn.commit()
    conn.close()

def add_metric(name: str, value: float, user_id: int):
    conn = sqlite3.connect(DATABASE_URL)
    c = conn.cursor()
    c.execute("INSERT INTO metrics (name, value, user_id) VALUES (?, ?, ?)", (name, value, user_id))
    conn.commit()
    # Keep only the last 5 entries for each metric for the user
    c.execute("""
        DELETE FROM metrics
        WHERE id IN (
            SELECT id FROM metrics
            WHERE user_id = ? AND name = ?
            ORDER BY timestamp DESC
            LIMIT -1 OFFSET 5
        )
    """, (user_id, name))
    conn.commit()
    conn.close()

def get_metrics(user_id: int):
    conn = sqlite3.connect(DATABASE_URL)
    c = conn.cursor()
    c.execute("SELECT name, value, timestamp FROM metrics WHERE user_id = ? ORDER BY timestamp DESC", (user_id,))
    metrics = c.fetchall()
    conn.close()
    return metrics

def get_user(email: str):
    conn = sqlite3.connect(DATABASE_URL)
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE email=?", (email,))
    user_data = c.fetchone()
    conn.close()
    if user_data:
        return {
            "id": user_data[0],
            "name": user_data[1],
            "email": user_data[2],
            "hashed_password": user_data[3],
            "uploaded_file_paths": json.loads(user_data[4]) if user_data[4] else []
        }
    return None

def add_user(user: User):
    conn = sqlite3.connect(DATABASE_URL)
    c = conn.cursor()
    try:
        hashed_password = pwd_context.hash(user.password)
        c.execute("INSERT INTO users (name, email, password, uploaded_file_paths) VALUES (?, ?, ?, ?)",
                  (user.name, user.email, hashed_password, json.dumps([])))
        conn.commit()
        return True
    except sqlite3.IntegrityError:
        return False
    finally:
        conn.close()

def update_user_uploaded_file_paths(user_id: int, file_paths: List[str]):
    conn = sqlite3.connect(DATABASE_URL)
    c = conn.cursor()
    c.execute("UPDATE users SET uploaded_file_paths = ? WHERE id = ?", (json.dumps(file_paths), user_id))
    conn.commit()
    conn.close()

def init_portfolio_db():
    conn = sqlite3.connect(DATABASE_URL)
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS portfolio_data (
            id INTEGER PRIMARY KEY,
            user_id INTEGER NOT NULL,
            symbol TEXT NOT NULL,
            date TEXT NOT NULL,
            close REAL NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    conn.commit()
    conn.close()

def add_portfolio_data(data: list):
    conn = sqlite3.connect(DATABASE_URL)
    c = conn.cursor()
    user_id = data[0]['user_id']
    for row in data:
        c.execute("INSERT INTO portfolio_data (user_id, symbol, date, close) VALUES (?, ?, ?, ?)",
                  (row['user_id'], row['symbol'], row['date'], row['close']))
    conn.commit()
    # Keep only the last 3 months of data
    c.execute("""
        DELETE FROM portfolio_data
        WHERE user_id = ? AND date < date('now', '-3 months')
    """, (user_id,))
    conn.commit()
    conn.close()

init_user_db()
init_metrics_db()
init_portfolio_db()
