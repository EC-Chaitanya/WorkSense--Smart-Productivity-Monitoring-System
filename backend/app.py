from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from classifier import classify_activity

app = Flask(__name__)
# Crucial: Allows your React app to fetch data from this API
CORS(app) 

def get_db_connection():
    conn = sqlite3.connect('worksense.db')
    conn.row_factory = sqlite3.Row # Returns dict-like objects instead of tuples
    return conn

@app.route('/log', methods=['POST'])
def log_activity():
    """Endpoint to receive active window data and save it."""
    data = request.json
    app_name = data.get('app_name')
    duration = data.get('duration_seconds', 0)

    if not app_name:
        return jsonify({"error": "app_name is missing"}), 400

    # Pass it through your AI/Rules logic
    category = classify_activity(app_name)

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO productivity_logs (app_name, category, duration_seconds) VALUES (?, ?, ?)',
        (app_name, category, duration)
    )
    conn.commit()
    conn.close()

    return jsonify({"status": "success", "category": category}), 201

@app.route('/stats', methods=['GET'])
def get_stats():
    """Endpoint for your React dashboard to fetch WPI and charts."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Aggregate total time spent per category
    cursor.execute('''
        SELECT category, SUM(duration_seconds) as total_seconds 
        FROM productivity_logs 
        GROUP BY category
    ''')
    rows = cursor.fetchall()
    conn.close()

    # Format the data for React
    stats = {row['category']: row['total_seconds'] for row in rows}
    
    productive = stats.get('Productive', 0)
    distraction = stats.get('Distraction', 0)
    neutral = stats.get('Neutral', 0)
    total_time = productive + distraction + neutral

    # Calculate the Work Productivity Index (WPI)
    wpi = 0
    if total_time > 0:
        wpi = round((productive / total_time) * 100, 2)

    return jsonify({
        "breakdown": stats,
        "wpi_score": wpi,
        "total_tracked_seconds": total_time
    }), 200

if __name__ == '__main__':
    # Run the server on port 5000
    app.run(debug=True, port=5000)