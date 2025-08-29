# app.py
import sqlite3
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import math
import socket
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

DATABASE = 'DbLabeling.db'
TABLE_TUJUAN = 'TujuanKirim'
TABLE_LOG = 'LogLabelingAlamat'

def get_db_connection():
    conn = sqlite3.connect(DATABASE, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def send_zpl_to_printer(zpl_code, printer_ip, printer_port=9100):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(5)
            s.connect((printer_ip, printer_port))
            s.sendall(zpl_code.encode('utf-8'))
        return True, f"Successfully sent to printer {printer_ip}"
    except Exception as e:
        return False, f"Error sending to printer {printer_ip}: {e}"

@app.route('/api/destinations', methods=['GET'])
def get_all_destinations():
    page = request.args.get('page', 1, type=int)
    per_page = 10
    search_term = request.args.get('search', '', type=str)
    if request.args.get('all') == 'true': per_page = 500
    
    conn = get_db_connection()
    base_query = f"FROM {TABLE_TUJUAN}"
    where_clauses = []
    params = []
    if search_term:
        search_like = f'%{search_term}%'
        where_clauses.append("(pt LIKE ? OR pt_tujuan LIKE ? OR instansi LIKE ? OR alamat LIKE ? OR provinsi LIKE ?)")
        params.extend([search_like] * 5)
    
    where_sql = " WHERE " + " AND ".join(where_clauses) if where_clauses else ""
    count_query = f"SELECT COUNT(id) as total {base_query}{where_sql}"
    total_items = conn.execute(count_query, params).fetchone()['total']
    total_pages = math.ceil(total_items / per_page) if total_items > 0 else 1
    offset = (page - 1) * per_page
    data_query = f"SELECT * {base_query}{where_sql} ORDER BY id DESC LIMIT ? OFFSET ?"
    params.extend([per_page, offset])
    
    destinations_from_db = conn.execute(data_query, params).fetchall()
    conn.close()
    
    destinations_list = [{key.lower(): row[key] for key in row.keys()} for row in destinations_from_db]
    return jsonify({'items': destinations_list, 'total_pages': total_pages, 'current_page': page})

@app.route('/api/destinations', methods=['POST'])
def add_destination():
    data = request.get_json()
    required_fields = ['pt', 'instansi', 'tujuan', 'alamat', 'provinsi']
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({'error': 'Data tidak lengkap'}), 400
    pt_tujuan = f"{data.get('pt', '')} - {data.get('tujuan', '')}"
    kontak = data.get('kontak', '-')
    sql = f'''INSERT INTO {TABLE_TUJUAN}(pt, pt_tujuan, instansi, tujuan, alamat, provinsi, kontak) VALUES(?,?,?,?,?,?,?)'''
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(sql, (data['pt'], pt_tujuan, data['instansi'], data['tujuan'], data['alamat'], data['provinsi'], kontak))
    conn.commit()
    new_id = cursor.lastrowid
    new_record = conn.execute(f'SELECT * FROM {TABLE_TUJUAN} WHERE id = ?', (new_id,)).fetchone()
    conn.close()
    return jsonify({key.lower(): new_record[key] for key in new_record.keys()}), 201

@app.route('/api/destinations/<int:id>', methods=['PUT'])
def update_destination(id):
    data = request.get_json()
    required_fields = ['pt', 'instansi', 'tujuan', 'alamat', 'provinsi']
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({'error': 'Data tidak lengkap'}), 400
    pt_tujuan = f"{data.get('pt', '')} - {data.get('tujuan', '')}"
    kontak = data.get('kontak', '-')
    sql = f'''UPDATE {TABLE_TUJUAN} SET pt = ?, pt_tujuan = ?, instansi = ?, tujuan = ?, alamat = ?, provinsi = ?, kontak = ? WHERE id = ?'''
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(sql, (data['pt'], pt_tujuan, data['instansi'], data['tujuan'], data['alamat'], data['provinsi'], kontak, id))
    conn.commit()
    if cursor.rowcount == 0:
        conn.close()
        return jsonify({'error': 'Data tidak ditemukan'}), 404
    updated_record = conn.execute(f'SELECT * FROM {TABLE_TUJUAN} WHERE id = ?', (id,)).fetchone()
    conn.close()
    return jsonify({key.lower(): updated_record[key] for key in updated_record.keys()})

@app.route('/api/print-batch', methods=['POST'])
def print_batch():
    batch_data = request.get_json()
    if not batch_data or 'items' not in batch_data or 'printer_ip' not in batch_data:
        return jsonify({'error': 'Request tidak lengkap.'}), 400

    items_to_print = batch_data['items']
    printer_ip = batch_data['printer_ip']
    is_debug_mode = batch_data.get('debug', False)
    
    all_zpl_codes = []
    logs_to_insert = []
    
    conn = get_db_connection()
    cursor = conn.cursor()

    for item in items_to_print:
        record_to_print = conn.execute(f'SELECT * FROM {TABLE_TUJUAN} WHERE id = ?', (item['id'],)).fetchone()
        if not record_to_print:
            continue

        data_for_template = {key.lower(): record_to_print[key] for key in record_to_print.keys()}
        zpl_output = render_template('label_template.zpl', data=data_for_template, **item)
        all_zpl_codes.append(zpl_output)
        
        logs_to_insert.append((
            item['id'], item.get('box_number', '1/1'), item.get('produk', ''), item.get('qty_produk', ''),
            item.get('petugas', ''), item.get('berat', ''), printer_ip
        ))

    if not all_zpl_codes:
        conn.close()
        return jsonify({'error': 'Tidak ada item valid untuk dicetak.'}), 400

    final_zpl_string = "\n".join(all_zpl_codes)
    
    if is_debug_mode:
        try:
            timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
            filename = f"cetak_debug_{timestamp}.txt"
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(final_zpl_string)
            message = f"Mode Debug Aktif. Berhasil menyimpan {len(all_zpl_codes)} label ke file {filename}."
        except Exception as e:
            conn.close()
            return jsonify({"error": f"Gagal menyimpan file debug: {e}"}), 500
    else:
        success, message = send_zpl_to_printer(final_zpl_string, printer_ip)
        if not success:
            conn.close()
            return jsonify({"error": f"Gagal mengirim ke printer. Alasan: {message}"}), 500

    try:
        log_sql = f'''INSERT INTO {TABLE_LOG} (tujuan_kirim_id, box_number, produk, qty_produk, petugas, berat, printer_ip)
                      VALUES (?, ?, ?, ?, ?, ?, ?)'''
        cursor.executemany(log_sql, logs_to_insert)
        conn.commit()
    except Exception as e:
        conn.close()
        return jsonify({"error": f"Berhasil mencetak, tapi gagal mencatat log: {e}"}), 500
    
    conn.close()
    return jsonify({"message": message})

@app.route('/api/logs', methods=['GET'])
def get_logs():
    page = request.args.get('page', 1, type=int)
    per_page = 10
    
    conn = get_db_connection()
    base_query = f"FROM {TABLE_LOG} log JOIN {TABLE_TUJUAN} tujuan ON log.tujuan_kirim_id = tujuan.id"
    count_query = f"SELECT COUNT(log.id) as total {base_query}"
    total_items = conn.execute(count_query).fetchone()['total']
    total_pages = math.ceil(total_items / per_page) if total_items > 0 else 1
    
    offset = (page - 1) * per_page
    data_query = f"SELECT log.id, log.box_number, log.produk, log.status, log.tanggal_print, tujuan.pt_tujuan {base_query} ORDER BY log.id DESC LIMIT ? OFFSET ?"
    
    logs_from_db = conn.execute(data_query, (per_page, offset)).fetchall()
    conn.close()
    
    # [FIX] Pastikan semua key diubah jadi lowercase biar konsisten
    logs_list = [{key.lower(): row[key] for key in row.keys()} for row in logs_from_db]
    return jsonify({'items': logs_list, 'total_pages': total_pages, 'current_page': page})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
