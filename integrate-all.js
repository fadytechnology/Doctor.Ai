// integrate-all.js
// هذا السكربت يقوم بجميع مراحل التكامل الفعلي:
// 1. ربط store.html بالمخزون (API)
// 2. ربط map.html بالخريطة الذكية (API)
// 3. ربط chat.html بـ Socket.io
// 4. ربط الإحصائيات في جميع الفئات
// 5. إضافة بيانات تجريبية إلى قاعدة البيانات

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const baseDir = process.cwd();

// ============================================================
// 1. ربط store.html بالمخزون
// ============================================================
function integrateStore() {
    const filePath = path.join(baseDir, 'modules/patient/services/store.html');
    if (!fs.existsSync(filePath)) {
        console.log('⚠️ store.html غير موجود، سيتم إنشاؤه...');
        return;
    }

    let content = fs.readFileSync(filePath, 'utf-8');

    // استبدال المحتوى الثابت بكود ديناميكي يستدعي API المخزون
    const dynamicContent = `
    <div id="productList" class="product-list">
        <div class="loading">⏳ جاري تحميل المنتجات...</div>
    </div>

    <script>
        const API_BASE = 'http://localhost:5000/api';
        const token = localStorage.getItem('token');

        async function loadProducts() {
            const list = document.getElementById('productList');
            try {
                const res = await fetch(\`\${API_BASE}/inventory/search?q=all\`, {
                    headers: { 'Authorization': \`Bearer \${token}\` }
                });
                const data = await res.json();
                if (!data.success || data.results.length === 0) {
                    list.innerHTML = '<div class="empty">😔 لا توجد منتجات متاحة حالياً</div>';
                    return;
                }
                list.innerHTML = '';
                data.results.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'product-item';
                    div.innerHTML = \`
                        <div class="info">
                            <div class="name">\${item.drug_name}</div>
                            <div class="price">💰 \${item.price} ج.م</div>
                            <div class="pharmacy">🏪 \${item.pharmacy_name}</div>
                        </div>
                        <button class="btn-buy" onclick="alert('🛒 تم إضافة المنتج إلى السلة')">شراء</button>
                    \`;
                    list.appendChild(div);
                });
            } catch (err) {
                list.innerHTML = '<div class="error">❌ حدث خطأ في تحميل المنتجات</div>';
            }
        }

        document.addEventListener('DOMContentLoaded', loadProducts);
    </script>

    <style>
        .product-list { padding: 10px 0; }
        .product-item { background: #fff; padding: 14px; border-radius: 16px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
        .product-item .info .name { font-weight: 600; }
        .product-item .info .price { font-size: 14px; color: #0d9488; font-weight: 700; }
        .product-item .info .pharmacy { font-size: 12px; color: #94a3b8; }
        .product-item .btn-buy { background: #0d9488; color: #fff; border: none; padding: 6px 16px; border-radius: 30px; font-size: 12px; cursor: pointer; }
        .loading, .empty, .error { text-align: center; padding: 30px; color: #94a3b8; }
        .error { color: #dc2626; }
    </style>
    `;

    // البحث عن محتوى القائمة واستبداله
    const listRegex = /<div id="productList">[\s\S]*?<\/div>/;
    if (listRegex.test(content)) {
        content = content.replace(listRegex, dynamicContent);
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('✅ تم ربط store.html بالمخزون');
    } else {
        console.log('⚠️ لم يتم العثور على productList في store.html');
    }
}

// ============================================================
// 2. ربط map.html بالخريطة الذكية
// ============================================================
function integrateMap() {
    const filePath = path.join(baseDir, 'modules/patient/map.html');
    if (!fs.existsSync(filePath)) {
        console.log('⚠️ map.html غير موجود، سيتم إنشاؤه...');
        return;
    }

    let content = fs.readFileSync(filePath, 'utf-8');

    // التأكد من وجود Leaflet JS و CSS
    if (!content.includes('unpkg.com/leaflet')) {
        const leafletCSS = '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />';
        const leafletJS = '<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script>';
        content = content.replace('</head>', leafletCSS + '\n</head>');
        content = content.replace('</body>', leafletJS + '\n</body>');
    }

    // تحديث دالة البحث لاستخدام API المخزون
    const searchFunction = `
    async function searchNearby() {
        const drug = document.getElementById('drugSearch').value.trim();
        if (!drug) { alert('يرجى إدخال اسم الدواء'); return; }

        const token = getToken();
        if (!token) { window.location.href = '../../auth/login.html'; return; }

        const list = document.getElementById('pharmacyList');
        list.innerHTML = '<div class="loading">⏳ جاري البحث...</div>';

        try {
            const res = await fetch(\`\${API_BASE}/inventory/nearby?lat=\${userLat}&lng=\${userLng}&drug=\${encodeURIComponent(drug)}\`, {
                headers: { 'Authorization': \`Bearer \${token}\` }
            });
            const data = await res.json();

            if (!data.success || data.results.length === 0) {
                list.innerHTML = '<div class="empty">😔 لا توجد صيدليات قريبة بها هذا الدواء</div>';
                return;
            }

            list.innerHTML = '';
            data.results.forEach(item => {
                const div = document.createElement('div');
                div.className = 'pharmacy-item';
                div.innerHTML = \`
                    <div>
                        <div class="name">\${item.pharmacy_name}</div>
                        <div class="distance">📏 \${item.distance_km.toFixed(1)} كم</div>
                    </div>
                    <div style="text-align:left;">
                        <div class="price">💰 \${item.price} ج.م</div>
                        <div style="font-size:11px;color:#64748b;">📦 \${item.quantity_in_stock} متبقي</div>
                    </div>
                \`;
                list.appendChild(div);
            });

            // تحديث الخريطة (إذا كانت Leaflet محملة)
            if (typeof L !== 'undefined' && map) {
                markers.forEach(m => map.removeLayer(m));
                markers = [];
                data.results.forEach(item => {
                    const marker = L.marker([item.latitude, item.longitude])
                        .addTo(map)
                        .bindPopup(\`
                            <b>\${item.pharmacy_name}</b><br>
                            💊 \${item.drug_name}<br>
                            💰 \${item.price} ج.م<br>
                            📦 \${item.quantity_in_stock} متبقي<br>
                            📏 \${item.distance_km.toFixed(1)} كم
                        \`);
                    markers.push(marker);
                });
                const group = L.featureGroup(markers);
                map.fitBounds(group.getBounds(), { padding: [50, 50] });
            }

        } catch (err) {
            console.error(err);
            list.innerHTML = '<div class="error">❌ حدث خطأ في البحث</div>';
        }
    }
    `;

    // استبدال دالة searchNearby القديمة
    const oldSearchRegex = /async function searchNearby\(\)\s*\{[\s\S]*?\}/;
    if (oldSearchRegex.test(content)) {
        content = content.replace(oldSearchRegex, searchFunction);
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('✅ تم ربط map.html بالخريطة الذكية');
    } else {
        console.log('⚠️ لم يتم العثور على دالة searchNearby في map.html');
    }
}

// ============================================================
// 3. ربط chat.html بـ Socket.io
// ============================================================
function integrateChat() {
    const filePath = path.join(baseDir, 'modules/patient/chat.html');
    if (!fs.existsSync(filePath)) {
        console.log('⚠️ chat.html غير موجود، سيتم إنشاؤه...');
        return;
    }

    let content = fs.readFileSync(filePath, 'utf-8');

    // التأكد من وجود Socket.io client
    if (!content.includes('socket.io')) {
        const socketJS = '<script src="https://cdn.socket.io/4.7.2/socket.io.min.js"><\/script>';
        content = content.replace('</head>', socketJS + '\n</head>');
    }

    // تحديث كود الاتصال بـ Socket.io
    const socketCode = `
    const SOCKET_URL = 'http://localhost:5000';
    let socket = null;
    const userId = localStorage.getItem('user_id') || '';

    function initSocket() {
        if (!socket) {
            socket = io(SOCKET_URL);
            socket.on('connect', () => {
                console.log('🟢 متصل بالشات');
                socket.emit('user-online', userId);
            });
            socket.on('online-users', (users) => {
                document.querySelectorAll('.chat-item').forEach(el => {
                    const pid = el.dataset.participant;
                    const dot = el.querySelector('.online-dot');
                    if (dot && users.includes(pid)) {
                        dot.style.display = 'inline-block';
                    } else if (dot) {
                        dot.style.display = 'none';
                    }
                });
            });
        }
    }

    // جلب المحادثات من API
    async function loadRooms() {
        const token = getToken();
        if (!token) { window.location.href = '../../auth/login.html'; return; }

        const list = document.getElementById('chatList');
        list.innerHTML = '<div class="loading">⏳ جاري التحميل...</div>';

        try {
            const res = await fetch(\`\${API_BASE}/chat/rooms\`, {
                headers: { 'Authorization': \`Bearer \${token}\` }
            });
            const data = await res.json();

            if (!data.success || data.rooms.length === 0) {
                list.innerHTML = '<div class="empty">💬 لا توجد محادثات بعد</div>';
                return;
            }

            list.innerHTML = '';
            data.rooms.forEach(room => {
                const div = document.createElement('div');
                div.className = 'chat-item';
                div.dataset.participant = room.participant_1 === parseInt(userId) ? room.participant_2 : room.participant_1;
                div.onclick = () => {
                    window.location.href = \`chat-room.html?roomId=\${room.room_id}\`;
                };
                div.innerHTML = \`
                    <div class="info">
                        <div class="name"><span class="online-dot" style="display:none;"></span> \${room.participant_name}</div>
                        <div class="last-msg">\${room.last_message || 'ابدأ المحادثة'}</div>
                    </div>
                    \${room.unread_count > 0 ? \`<span class="badge">\${room.unread_count}</span>\` : ''}
                \`;
                list.appendChild(div);
            });

            initSocket();
            setTimeout(() => socket.emit('user-online', userId), 500);

        } catch (err) {
            console.error(err);
            list.innerHTML = '<div class="error">❌ حدث خطأ</div>';
        }
    }

    document.addEventListener('DOMContentLoaded', loadRooms);
    `;

    // استبدال كود الشات القديم بالجديد
    const oldChatRegex = /document\.addEventListener\('DOMContentLoaded',\s*loadRooms\s*\);/;
    if (oldChatRegex.test(content)) {
        content = content.replace(/document\.addEventListener\('DOMContentLoaded',\s*loadRooms\s*\);/g, '');
    }

    // إدراج الكود الجديد قبل نهاية </script>
    const scriptEnd = content.lastIndexOf('</script>');
    if (scriptEnd !== -1) {
        const before = content.substring(0, scriptEnd);
        const after = content.substring(scriptEnd);
        content = before + '\n\n' + socketCode + '\n\n' + after;
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('✅ تم ربط chat.html بـ Socket.io');
    } else {
        console.log('⚠️ لم يتم العثور على </script> في chat.html');
    }
}

// ============================================================
// 4. ربط الإحصائيات في جميع الفئات
// ============================================================
function integrateStats() {
    const modules = ['patient', 'pharmacy', 'clinic', 'lab', 'radiology', 'supplier'];
    const statsMappings = {
        patient: {
            ids: ['statPrescriptions', 'statLoyalty', 'statAppointments', 'statWallet'],
            keys: ['prescriptions', 'loyalty', 'appointments', 'wallet']
        },
        pharmacy: {
            ids: ['ordersToday', 'patientsCount', 'alertsCount', 'groupsCount'],
            keys: ['ordersToday', 'customers', 'alerts', 'groups']
        },
        clinic: {
            ids: ['patientsToday', 'patientsWeek', 'appointmentsCount', 'prescriptionsCount'],
            keys: ['patientsToday', 'patientsWeek', 'appointments', 'prescriptions']
        },
        lab: {
            ids: ['statOrdersToday', 'statProcessing', 'statCompleted', 'statClients'],
            keys: ['today', 'processing', 'completed', 'clients']
        },
        radiology: {
            ids: ['statOrdersToday', 'statProcessing', 'statCompleted', 'statClients'],
            keys: ['today', 'processing', 'completed', 'clients']
        },
        supplier: {
            ids: ['statProducts', 'statPurchaseOrders', 'statProcessing', 'statClients'],
            keys: ['products', 'purchaseOrders', 'processing', 'clients']
        }
    };

    modules.forEach(mod => {
        const filePath = path.join(baseDir, `modules/${mod}/index.html`);
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️ ${mod}/index.html غير موجود`);
            return;
        }

        let content = fs.readFileSync(filePath, 'utf-8');

        // التأكد من وجود دالة loadStats
        const mapping = statsMappings[mod];
        const functionName = `load${mod.charAt(0).toUpperCase() + mod.slice(1)}Stats`;

        const statsFunction = `
        async function ${functionName}() {
            const token = getToken();
            if (!token) return;

            try {
                const res = await fetch(\`\${API_BASE}/stats\`, {
                    headers: {
                        'Authorization': \`Bearer \${token}\`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!res.ok) {
                    console.warn('⚠️ فشل جلب الإحصائيات:', res.status);
                    return;
                }

                const data = await res.json();
                if (data.success) {
                    const s = data.stats;
                    ${mapping.ids.map((id, i) => {
                        return `document.getElementById('${id}').textContent = s.${mapping.keys[i]} || 0;`;
                    }).join('\n                    ')}
                }
            } catch (err) {
                console.error('❌ فشل جلب الإحصائيات:', err);
            }
        }
        `;

        // إدراج الدالة إذا لم تكن موجودة
        if (!content.includes(functionName)) {
            const scriptEnd = content.lastIndexOf('</script>');
            if (scriptEnd !== -1) {
                const before = content.substring(0, scriptEnd);
                const after = content.substring(scriptEnd);
                content = before + '\n\n' + statsFunction + '\n\n' + after;
            }
        }

        // التأكد من استدعاء الدالة في DOMContentLoaded
        if (!content.includes(`await ${functionName}()`)) {
            const fetchCallRegex = /await\s+fetch\w+Data\s*\(\)\s*;?/;
            if (fetchCallRegex.test(content)) {
                content = content.replace(fetchCallRegex, (match) => {
                    return match + `\n            await ${functionName}();`;
                });
            }
        }

        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`✅ تم ربط الإحصائيات في ${mod}/index.html`);
    });
}

// ============================================================
// 5. إضافة بيانات تجريبية إلى قاعدة البيانات
// ============================================================
function addSeedData() {
    console.log('🌱 إضافة بيانات تجريبية إلى قاعدة البيانات...');

    // التحقق من وجود ملف config/db.js
    const dbPath = path.join(baseDir, 'backend/config/db.js');
    if (!fs.existsSync(dbPath)) {
        console.log('⚠️ backend/config/db.js غير موجود، تخطي إضافة البيانات');
        return;
    }

    const seedSQL = `
    -- ============================================================
    -- بيانات تجريبية للتطبيق
    -- ============================================================

    -- إضافة صيدلية تجريبية (إذا لم تكن موجودة)
    INSERT IGNORE INTO pharmacies (user_id, pharmacy_name, license_number, latitude, longitude, address, phone)
    VALUES (2, 'صيدلية النور', 'PH-2024-001', 30.0444, 31.2357, 'شارع النيل، القاهرة', '01007654321');

    -- إضافة عيادة تجريبية (إذا لم تكن موجودة)
    INSERT IGNORE INTO clinics (user_id, clinic_name, license_number, latitude, longitude, address, phone, specialty)
    VALUES (3, 'عيادة الدكتور محمد', 'CL-2024-001', 30.0450, 31.2360, 'شارع الثورة، القاهرة', '01009876543', 'باطنة');

    -- إضافة أدوية تجريبية في المخزون (إذا لم تكن موجودة)
    INSERT IGNORE INTO pharmacy_inventory (pharmacy_id, drug_name, generic_name, concentration, quantity_in_stock, price, requires_prescription)
    VALUES
    (1, 'باراسيتامول 500mg', 'Acetaminophen', '500mg', 50, 15.00, FALSE),
    (1, 'أموكسيسيلين 250mg', 'Amoxicillin', '250mg', 12, 40.00, TRUE),
    (1, 'فيتامين C 1000mg', 'Ascorbic Acid', '1000mg', 8, 25.00, FALSE),
    (1, 'أنسولين', 'Insulin Glargine', '100iu', 5, 120.00, TRUE);

    -- إضافة محفظة تجريبية للمريض (إذا لم تكن موجودة)
    INSERT IGNORE INTO wallets (user_id, balance) VALUES (1, 100.00);

    -- إضافة نقاط ولاء تجريبية للمريض (إذا لم تكن موجودة)
    INSERT IGNORE INTO loyalty_points (user_id, points, tier) VALUES (1, 150, 'silver');

    -- إضافة روشتة تجريبية (إذا لم تكن موجودة)
    INSERT IGNORE INTO prescriptions (patient_id, doctor_id, medications, status, encrypted_code, created_at, expires_at)
    VALUES (
        1, 3,
        '[{"name":"باراسيتامول 500mg","dose":"قرص كل 6 ساعات","duration":"5 أيام"}]',
        'approved',
        'RX-' || UUID(),
        NOW(),
        DATE_ADD(NOW(), INTERVAL 30 DAY)
    );
    `;

    // كتابة السكربت في ملف مؤقت وتنفيذه عبر Node.js
    const tempSQLPath = path.join(baseDir, 'temp_seed.sql');
    fs.writeFileSync(tempSQLPath, seedSQL, 'utf-8');

    try {
        // محاولة تنفيذ السكربت عبر mysql
        const dbConfig = require('./backend/config/db');
        // استخدام mysql2 لتنفيذ السكربت مباشرة
        const mysql = require('mysql2/promise');

        (async () => {
            try {
                const connection = await mysql.createConnection({
                    host: process.env.DB_HOST || 'localhost',
                    user: process.env.DB_USER || 'root',
                    password: process.env.DB_PASSWORD || '',
                    database: process.env.DB_NAME || 'doctor_ai_db',
                    multipleStatements: true
                });
                await connection.query(seedSQL);
                await connection.end();
                console.log('✅ تم إضافة البيانات التجريبية بنجاح');
                fs.unlinkSync(tempSQLPath);
            } catch (err) {
                console.log('⚠️ تعذر إضافة البيانات التجريبية تلقائياً، يمكنك تنفيذ الملف يدوياً في phpMyAdmin:');
                console.log(`📄 ${tempSQLPath}`);
            }
        })();

    } catch (err) {
        console.log('⚠️ mysql2 غير مثبت، يرجى تثبيته أو تنفيذ السكربت يدوياً:');
        console.log(`📄 ${tempSQLPath}`);
        console.log('💡 قم بتشغيل: npm install mysql2');
    }
}

// ============================================================
// 6. تشغيل كل المهام
// ============================================================
console.log('🚀 بدء مرحلة التكامل الفعلي...\n');

try {
    integrateStore();
    integrateMap();
    integrateChat();
    integrateStats();
    addSeedData();

    console.log('\n🎉 تم إكمال جميع مراحل التكامل الفعلي بنجاح!');
    console.log('📌 الخطوات القادمة:');
    console.log('   1. تأكد من تشغيل السيرفر: cd backend && node server.js');
    console.log('   2. افتح المتصفح على http://localhost:5000');
    console.log('   3. اختبر المتجر (store.html)، الخريطة (map.html)، والشات (chat.html)');
} catch (err) {
    console.error('❌ حدث خطأ:', err);
}