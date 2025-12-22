import sqlite3
from app.models.user import User
from passlib.context import CryptContext
import json
from typing import List, Dict, Any, Optional

DATABASE_URL = "db/user.db"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- Initialization Functions ---
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
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    conn.commit()
    conn.close()

def init_prediction_db():
    conn = sqlite3.connect(DATABASE_URL)
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS prediction_results (
            id INTEGER PRIMARY KEY,
            user_id INTEGER NOT NULL,
            result TEXT NOT NULL, -- Storing complex results as JSON string
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    conn.commit()
    conn.close()

def init_investment_strategy_db():
    conn = sqlite3.connect(DATABASE_URL)
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS investment_strategy_results (
            id INTEGER PRIMARY KEY,
            user_id INTEGER NOT NULL,
            result TEXT NOT NULL, -- Storing complex results as JSON string
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    conn.commit()
    conn.close()

# --- Utility for limiting rows ---
def _limit_rows(conn, table_name: str, user_id: int, limit: int):
    c = conn.cursor()
    # Delete oldest entries beyond the limit for the specific user
    # Try with timestamp first, fall back to id if timestamp column doesn't exist
    try:
        c.execute(f"""
            DELETE FROM {table_name}
            WHERE id IN (
                SELECT id FROM {table_name}
                WHERE user_id = ?
                ORDER BY timestamp DESC
                LIMIT -1 OFFSET ?
            )
        """, (user_id, limit))
    except sqlite3.OperationalError:
        # timestamp column doesn't exist, order by id instead
        c.execute(f"""
            DELETE FROM {table_name}
            WHERE id IN (
                SELECT id FROM {table_name}
                WHERE user_id = ?
                ORDER BY id DESC
                LIMIT -1 OFFSET ?
            )
        """, (user_id, limit))
    conn.commit()

# --- CRUD for Users ---
def get_user(email: str):
    conn = sqlite3.connect(DATABASE_URL)
    c = conn.cursor()
    c.execute("SELECT id, name, email, password, uploaded_file_paths FROM users WHERE email=?", (email,))
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

# --- CRUD for Metrics ---
def add_metric(name: str, value: float, user_id: int, max_rows: int = 120):
    conn = sqlite3.connect(DATABASE_URL)
    c = conn.cursor()
    c.execute("INSERT INTO metrics (name, value, user_id) VALUES (?, ?, ?)", (name, value, user_id))
    conn.commit()
    _limit_rows(conn, "metrics", user_id, max_rows)
    conn.close()

def get_metrics(user_id: int, limit: Optional[int] = None):
    conn = sqlite3.connect(DATABASE_URL)
    c = conn.cursor()
    if limit:
        c.execute("SELECT name, value, timestamp FROM metrics WHERE user_id = ? ORDER BY timestamp DESC LIMIT ?", (user_id, limit))
    else:
        c.execute("SELECT name, value, timestamp FROM metrics WHERE user_id = ? ORDER BY timestamp DESC", (user_id,))
    metrics = [{"name": row[0], "value": row[1], "timestamp": row[2]} for row in c.fetchall()]
    conn.close()
    return metrics

# --- CRUD for Portfolio Data ---
def add_portfolio_data(data: list, max_rows: int = 120):
    conn = sqlite3.connect(DATABASE_URL)
    c = conn.cursor()
    user_id = data[0]['user_id']
    for row in data:
        c.execute("INSERT INTO portfolio_data (user_id, symbol, date, close) VALUES (?, ?, ?, ?)",
                  (row['user_id'], row['symbol'], row['date'], row['close']))
    conn.commit()
    _limit_rows(conn, "portfolio_data", user_id, max_rows)
    conn.close()

def get_latest_portfolio_analysis(user_id: int, limit: Optional[int] = None):
    conn = sqlite3.connect(DATABASE_URL)
    c = conn.cursor()
    # Try to select date and timestamp if the column exists; if not, fall back to date-only.
    try:
        if limit:
            c.execute("""
                SELECT DISTINCT date, timestamp FROM portfolio_data
                WHERE user_id = ?
                ORDER BY timestamp DESC
                LIMIT ?
            """, (user_id, limit))
        else:
            c.execute("""
                SELECT DISTINCT date, timestamp FROM portfolio_data
                WHERE user_id = ?
                ORDER BY timestamp DESC
            """, (user_id,))
        results = [{"date": row[0], "timestamp": row[1]} for row in c.fetchall()]
    except sqlite3.OperationalError:
        # Likely the 'timestamp' column doesn't exist in older DBs; return date-only results.
        if limit:
            c.execute("""
                SELECT DISTINCT date FROM portfolio_data
                WHERE user_id = ?
                ORDER BY date DESC
                LIMIT ?
            """, (user_id, limit))
        else:
            c.execute("""
                SELECT DISTINCT date FROM portfolio_data
                WHERE user_id = ?
                ORDER BY date DESC
            """, (user_id,))
        results = [{"date": row[0], "timestamp": None} for row in c.fetchall()]

    conn.close()
    return results

# --- CRUD for Prediction Results ---
def add_prediction_data(user_id: int, result: Dict[str, Any], max_rows: int = 120):
    conn = sqlite3.connect(DATABASE_URL)
    c = conn.cursor()
    c.execute("INSERT INTO prediction_results (user_id, result) VALUES (?, ?)",
              (user_id, json.dumps(result)))
    conn.commit()
    _limit_rows(conn, "prediction_results", user_id, max_rows)
    conn.close()

def get_latest_prediction(user_id: int, limit: Optional[int] = None):
    conn = sqlite3.connect(DATABASE_URL)
    c = conn.cursor()
    if limit:
        c.execute("SELECT result, timestamp FROM prediction_results WHERE user_id = ? ORDER BY timestamp DESC LIMIT ?", (user_id, limit))
    else:
        c.execute("SELECT result, timestamp FROM prediction_results WHERE user_id = ? ORDER BY timestamp DESC", (user_id,))
    results = [{"result": json.loads(row[0]), "timestamp": row[1]} for row in c.fetchall()]
    conn.close()
    return results

# --- CRUD for Investment Strategy Results ---
def add_investment_strategy_data(user_id: int, result: Dict[str, Any], max_rows: int = 120):
    conn = sqlite3.connect(DATABASE_URL)
    c = conn.cursor()
    c.execute("INSERT INTO investment_strategy_results (user_id, result) VALUES (?, ?)",
              (user_id, json.dumps(result)))
    conn.commit()
    _limit_rows(conn, "investment_strategy_results", user_id, max_rows)
    conn.close()

def get_latest_investment_strategy(user_id: int, limit: Optional[int] = None):
    conn = sqlite3.connect(DATABASE_URL)
    c = conn.cursor()
    if limit:
        c.execute("SELECT result, timestamp FROM investment_strategy_results WHERE user_id = ? ORDER BY timestamp DESC LIMIT ?", (user_id, limit))
    else:
        c.execute("SELECT result, timestamp FROM investment_strategy_results WHERE user_id = ? ORDER BY timestamp DESC", (user_id,))
    results = [{"result": json.loads(row[0]), "timestamp": row[1]} for row in c.fetchall()]
    conn.close()
    return results

# --- Initialize all databases ---
init_user_db()
init_metrics_db()
init_portfolio_db()
init_prediction_db()
init_investment_strategy_db()
