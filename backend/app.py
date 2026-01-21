from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import uuid
import json

app = Flask(__name__)
CORS(app)

DB_NAME = "database.db"

# ----------------------------
# Database helper
# ----------------------------
def get_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn


# ----------------------------
# Initialize database (called on startup)
# ----------------------------
def init_db():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS forms (
            id TEXT PRIMARY KEY,
            schema TEXT
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS responses (
            id TEXT PRIMARY KEY,
            form_id TEXT,
            response TEXT
        )
    """)

    conn.commit()
    conn.close()


# ----------------------------
# Initialize database endpoint
# ----------------------------
@app.route("/init", methods=["GET"])
def init_db_endpoint():
    init_db()
    return jsonify({"message": "Database initialized"})


# ----------------------------
# Create a new form
# ----------------------------
@app.route("/forms", methods=["POST"])
def create_form():
    data = request.get_json()
    form_id = str(uuid.uuid4())
    schema = json.dumps(data["schema"])

    conn = get_db()
    conn.execute(
        "INSERT INTO forms (id, schema) VALUES (?, ?)",
        (form_id, schema)
    )
    conn.commit()
    conn.close()

    return jsonify({"formId": form_id})


# ----------------------------
# Get all forms
# ----------------------------
@app.route("/forms", methods=["GET"])
def get_forms():
    conn = get_db()
    rows = conn.execute("SELECT id, schema FROM forms").fetchall()
    conn.close()

    forms = []
    for row in rows:
        forms.append({
            "id": row["id"],
            "schema": json.loads(row["schema"])
        })

    return jsonify(forms)


# ----------------------------
# Get single form by ID
# ----------------------------
@app.route("/forms/<form_id>", methods=["GET"])
def get_form(form_id):
    conn = get_db()
    row = conn.execute(
        "SELECT schema FROM forms WHERE id = ?",
        (form_id,)
    ).fetchone()
    conn.close()

    if row is None:
        return jsonify({"error": "Form not found"}), 404

    return jsonify(json.loads(row["schema"]))


# ----------------------------
# Submit form response
# ----------------------------
@app.route("/forms/<form_id>/responses", methods=["POST"])
def submit_response(form_id):
    response_data = request.get_json()

    conn = get_db()
    conn.execute(
        "INSERT INTO responses (id, form_id, response) VALUES (?, ?, ?)",
        (str(uuid.uuid4()), form_id, json.dumps(response_data))
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "Response saved"})


# ----------------------------
# Get responses for a form
# ----------------------------
@app.route("/forms/<form_id>/responses", methods=["GET"])
def get_responses(form_id):
    conn = get_db()
    rows = conn.execute(
        "SELECT response FROM responses WHERE form_id = ?",
        (form_id,)
    ).fetchall()
    conn.close()

    responses = [json.loads(row["response"]) for row in rows]
    return jsonify(responses)


# ----------------------------
# Run server
# ----------------------------
if __name__ == "__main__":
    # Initialize database on startup
    init_db()
    print("✅ Database initialized successfully")
    
    app.run(debug=True)