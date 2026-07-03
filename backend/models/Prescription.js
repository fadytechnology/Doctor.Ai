// backend/models/Prescription.js
const db = require('../config/db');

class Prescription {
  static async create(data) {
    const { doctorId, patientId, medications, notes } = data;
    const [result] = await db.query(
      'INSERT INTO prescriptions (doctor_id, patient_id, medications, notes, created_at) VALUES (?, ?, ?, ?, NOW())',
      [doctorId, patientId, JSON.stringify(medications), notes]
    );
    return { id: result.insertId, ...data };
  }

  static async findByPatient(patientId) {
    const [rows] = await db.query('SELECT * FROM prescriptions WHERE patient_id = ? ORDER BY created_at DESC', [patientId]);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM prescriptions WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id, updates) {
    const { medications, notes } = updates;
    await db.query(
      'UPDATE prescriptions SET medications = ?, notes = ? WHERE id = ?',
      [JSON.stringify(medications), notes, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    await db.query('DELETE FROM prescriptions WHERE id = ?', [id]);
  }
}

module.exports = Prescription;