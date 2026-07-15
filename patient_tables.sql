
-- ============================================================
-- جداول خاصة بالمريض (الخدمات الجديدة)
-- ============================================================

-- 1. جدول القياسات الحيوية
CREATE TABLE IF NOT EXISTS biometric_measurements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    weight DECIMAL(5,2) NULL,
    height DECIMAL(5,2) NULL,
    blood_pressure_systolic INT NULL,
    blood_pressure_diastolic INT NULL,
    sugar DECIMAL(5,2) NULL,
    heart_rate INT NULL,
    oxygen DECIMAL(3,1) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2. جدول أدوية المريض
CREATE TABLE IF NOT EXISTS medications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    dose VARCHAR(50) NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    notes TEXT NULL,
    reminder_time TIME NULL,
    last_taken_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. جدول الأطعمة (لحاسبة السعرات)
CREATE TABLE IF NOT EXISTS foods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    calories_per_unit DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL COMMENT 'جرام، قطعة، كوب، ملعقة',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. جدول سجل الطعام اليومي
CREATE TABLE IF NOT EXISTS daily_food_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    food_id INT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    meal_type ENUM('breakfast', 'lunch', 'dinner', 'snack') DEFAULT 'snack',
    log_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
);

-- 5. جدول تتبع الدورة الشهرية
CREATE TABLE IF NOT EXISTS period_tracker (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    start_date DATE NOT NULL,
    cycle_length INT DEFAULT 28,
    symptoms TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. جدول رعاية الطفل
CREATE TABLE IF NOT EXISTS baby_care (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    baby_name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    weight DECIMAL(5,2) NULL,
    height DECIMAL(5,2) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. جدول تطعيمات الطفل
CREATE TABLE IF NOT EXISTS baby_vaccinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    baby_id INT NOT NULL,
    vaccine_name VARCHAR(100) NOT NULL,
    date_given DATE NULL,
    next_due_date DATE NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (baby_id) REFERENCES baby_care(id) ON DELETE CASCADE
);

-- 8. إضافة فهارس لتسريع الاستعلامات
CREATE INDEX idx_biometric_user ON biometric_measurements(user_id);
CREATE INDEX idx_biometric_created ON biometric_measurements(created_at);
CREATE INDEX idx_medications_patient ON medications(patient_id);
CREATE INDEX idx_medications_reminder ON medications(reminder_time);
CREATE INDEX idx_daily_log_user ON daily_food_log(user_id);
CREATE INDEX idx_daily_log_date ON daily_food_log(log_date);
CREATE INDEX idx_period_user ON period_tracker(user_id);
CREATE INDEX idx_baby_user ON baby_care(user_id);

-- 9. إضافة بعض الأطعمة الأساسية
INSERT IGNORE INTO foods (name, calories_per_unit, unit) VALUES
('أرز أبيض (مطهي)', 130, 'كوب'),
('خبز أبيض', 265, 'رغيف'),
('دجاج مشوي', 165, '100 جرام'),
('لحم بقر مشوي', 250, '100 جرام'),
('سمك مشوي', 150, '100 جرام'),
('بيض مسلوق', 70, 'قرص'),
('حليب كامل الدسم', 61, '100 مل'),
('زبادي يوناني', 59, '100 جرام'),
('تفاح', 52, 'قطعة'),
('موز', 89, 'قطعة'),
('برتقال', 47, 'قطعة'),
('بطاطس مشوية', 93, '100 جرام'),
('طماطم', 18, '100 جرام'),
('خيار', 15, '100 جرام'),
('زيت زيتون', 884, '100 مل');
