// backend/models/LabOrder.js
const db = require('../config/db');

class LabOrder {
  static async create(data) {
    const { doctorId, patientId, tests, notes } = data;
    const [result] = await db.query(
      'INSERT INTO lab_orders (doctor_id, patient_id, tests, notes, status, created_at) VALUES (?, ?, ?, ?, "pending", NOW())',
      [doctorId, patientId, JSON.stringify(tests), notes]
    );
    return { id: result.insertId, ...data, status: 'pending' };
  }

  static async findByPatient(patientId) {
    const [rows] = await db.query('SELECT * FROM lab_orders WHERE patient_id = ? ORDER BY created_at DESC', [patientId]);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM lab_orders WHERE id = ?', [id]);
    return rows[0];
  }

  static async updateStatus(id, status) {
    await db.query('UPDATE lab_orders SET status = ? WHERE id = ?', [status, id]);
    return this.findById(id);
  }
}

module.exports = LabOrder;