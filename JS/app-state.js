// ============================================================
// ===== JS/app-state.js =====
// ============================================================

const AppState = {
    // ----- جلب البيانات -----
    get(key) {
        try {
            return JSON.parse(localStorage.getItem(key) || '[]');
        } catch {
            return [];
        }
    },

    // ----- حفظ البيانات -----
    set(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    // ----- إضافة عنصر -----
    add(key, item) {
        const data = this.get(key);
        data.push(item);
        this.set(key, data);
        return data;
    },

    // ----- تحديث عنصر -----
    update(key, id, updates) {
        const data = this.get(key);
        const index = data.findIndex(item => item.id === id);
        if (index !== -1) {
            data[index] = { ...data[index], ...updates };
            this.set(key, data);
        }
        return data;
    },

    // ----- حذف عنصر -----
    remove(key, id) {
        let data = this.get(key);
        data = data.filter(item => item.id !== id);
        this.set(key, data);
        return data;
    }
};

// تصدير للاستخدام في المتصفح
window.AppState = AppState;

console.log('✅ AppState loaded successfully!');