// ============================================================
// ===== JS/app-state.js =====
// ============================================================

const AppState = {
    get(key) {
        try {
            return JSON.parse(localStorage.getItem(key) || '[]');
        } catch {
            return [];
        }
    },
    set(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },
    add(key, item) {
        const data = this.get(key);
        data.push(item);
        this.set(key, data);
        return data;
    },
    update(key, id, updates) {
        const data = this.get(key);
        const idx = data.findIndex(i => i.id === id);
        if (idx !== -1) {
            data[idx] = { ...data[idx], ...updates };
            this.set(key, data);
        }
        return data;
    },
    remove(key, id) {
        let data = this.get(key);
        data = data.filter(i => i.id !== id);
        this.set(key, data);
        return data;
    }
};

window.AppState = AppState;
console.log('✅ AppState loaded');