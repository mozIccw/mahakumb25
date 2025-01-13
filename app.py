from flask import Flask, jsonify, send_from_directory, render_template, request
import sqlite3
from datetime import datetime, date
import os
import logging

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.DEBUG)

def get_db_connection():
    try:
        conn = sqlite3.connect('database.db')
        conn.row_factory = sqlite3.Row
        return conn
    except sqlite3.Error as e:
        logging.error(f"Database connection error: {e}")
        raise

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/images/<path:filename>')
def serve_images(filename):
    return send_from_directory('images', filename)

@app.route('/analysis.css')
def serve_css():
    return send_from_directory('.', 'analysis.css', mimetype='text/css')

@app.route('/script.js')
def serve_js():
    return send_from_directory('.', 'script.js', mimetype='application/javascript')

@app.route('/api/stats', methods=['GET'])
def get_stats():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Count QR codes by status
        active_count = cur.execute('SELECT COUNT(*) FROM qr_codes WHERE status = ?', ('active',)).fetchone()[0]
        samples_collected = cur.execute('SELECT COUNT(*) FROM qr_codes WHERE status = ?', ('sampleCollected',)).fetchone()[0]
        testing_progress = cur.execute('SELECT COUNT(*) FROM qr_codes WHERE status = ?', ('testinProgress',)).fetchone()[0]
        result_pending = cur.execute('SELECT COUNT(*) FROM qr_codes WHERE status = ?', ('resultPending',)).fetchone()[0]
        test_complete = cur.execute('SELECT COUNT(*) FROM qr_codes WHERE status = ?', ('testComplete',)).fetchone()[0]
        
        # Get total QR codes
        total_qr_codes = cur.execute('SELECT COUNT(*) FROM qr_codes').fetchone()[0]
        
        conn.close()
        
        data = {
            'active': active_count,
            'samples_collected': samples_collected,
            'testing_progress': testing_progress,
            'result_pending': result_pending,
            'test_complete': test_complete,
            'total': total_qr_codes
        }
        
        logging.debug(f"Stats data: {data}")
        return jsonify(data)
    
    except sqlite3.Error as e:
        logging.error(f"Database error: {e}")
        return jsonify({'error': 'Database error'}), 500
    
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        return jsonify({'error': 'Unexpected error'}), 500

@app.route('/api/save_report', methods=['POST'])
def save_report():
    try:
        data = request.json
        conn = get_db_connection()
        cur = conn.cursor()

        # Insert data without validation
        cur.execute('''
            INSERT INTO water_report (
                sample_ID, pH, TDS, turbidity, free_Residual_chlorine,
                dissolved_oxygen, TSS, color, odor, total_Hardness,
                total_Alkalinity, chloride, nitrate, iron, nitrite,
                fluoride, Ammonia, sulphate, TKN, total_phosporous,
                BOD, COD, bacteria
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['sampleId'],
            data['pH'],
            data['tds'],
            data['turbidity'],
            data['chlorine'],
            data['do'],
            data['tss'],
            data['color'],
            data['odor'],
            data['hardness'],
            data['alkalinity'],
            data['chloride'],
            data['nitrate'],
            data['iron'],
            data['nitrite'],
            data['fluoride'],
            data['ammonia'],
            data['sulphate'],
            data['tkn'],
            data['phosphorus'],
            data['bod'],
            data['cod'],
            data['bacteria']
        ))
        
        conn.commit()
        conn.close()

        return jsonify({'message': 'Report saved successfully'}), 200

    except Exception as e:
        logging.error(f"Error saving report: {e}")
        return jsonify({'error': str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)