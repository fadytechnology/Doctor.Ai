// ============================================================
//  SERVICE WORKER - Doctor.ai PWA
//  الإصدار: v1.0 (نهائي)
//  الوظيفة: تخزين الملفات مؤقتاً للعمل في وضع Offline
// ============================================================

const CACHE_NAME = 'doctor-ai-v1';
const urlsToCache = [

  // ===== الصفحات الرئيسية (الجذر) =====
  '/',
  '/index.html',
  '/login.html',
  '/signup.html',
  '/forgot-password.html',
  '/terms.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/sw.js',

  // ===== صفحات المريض (الفرد) =====
  '/individual/index.html',
  '/individual/style.css',
  '/individual/ai-interpreter.js',
  '/individual/chat.html',
  '/individual/profile.html',
  '/individual/settings.html',
  '/individual/user-profile.html',
  '/individual/network.html',
  '/individual/store.html',
  '/individual/services-link.html',
  '/individual/services-app.html',
  '/individual/services-vault.html',
  '/individual/biometric-profile.html',
  '/individual/biometric-results.html',

  // ===== صفحات الصيدلية =====
  '/pharmacy/index.html',
  '/pharmacy/style.css',
  '/pharmacy/orders.html',
  '/pharmacy/inventory.html',
  '/pharmacy/store.html',
  '/pharmacy/customers.html',
  '/pharmacy/b2b.html',
  '/pharmacy/loyalty.html',
  '/pharmacy/analytics.html',
  '/pharmacy/settings.html',

  // ===== صفحات العيادة =====
  '/clinic/index.html',
  '/clinic/style.css',
  '/clinic/appointments.html',
  '/clinic/patients.html',
  '/clinic/examinations.html',
  '/clinic/reports.html',

  // ===== صفحات المورد =====
  '/supplier/index.html',
  '/supplier/style.css',
  '/supplier/medicines.html',
  '/supplier/pharmacy-orders.html',
  '/supplier/warehouses.html',
  '/supplier/sales.html',

  // ===== صفحات المعمل =====
  '/lab/index.html',
  '/lab/style.css',
  '/lab/samples.html',
  '/lab/tests.html',
  '/lab/results.html',
  '/lab/appointments.html',

  // ===== صفحات مركز الأشعة =====
  '/radiology/index.html',
  '/radiology/style.css',
  '/radiology/bookings.html',
  '/radiology/reports.html',
  '/radiology/images.html',
  '/radiology/send.html',

  // ===== صفحات الإدارة المركزية =====
  '/admin/index.html',
  '/admin/style.css',
  '/admin/users.html',
  '/admin/pharmacies.html',
  '/admin/clinics.html',
  '/admin/reports.html',
  '/admin/settings.html',
  '/admin/manage-content.html',
  '/admin/logs.html',

  // ===== المكونات المشتركة =====
  '/shared/header.html',
  '/shared/navbar-bottom.html',
  '/shared/footer.html',

  // ===== الأصول العامة (لو موجودة) =====
  '/assets/images/icon-192.png',
  '/assets/images/icon-512.png'
];

// ============================================================
//  1. التثبيت (تحميل الملفات في الكاش)
// ============================================================
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ Service Worker: تم فتح الكاش وتحميل الملفات');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.warn('⚠️ Service Worker: بعض الملفات لم يتم تحميلها', err);
      })
  );
  self.skipWaiting(); // تفعيل فوراً
});

// ============================================================
//  2. التفعيل (تنظيف الكاش القديم)
// ============================================================
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('🗑️ Service Worker: حذف الكاش القديم:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim(); // السيطرة على الصفحات المفتوحة فوراً
});

// ============================================================
//  3. اعتراض الطلبات (تقديم الكاش أولاً)
// ============================================================
self.addEventListener('fetch', event => {
  // تجاهل طلبات الإضافات والتحليلات
  if (event.request.url.startsWith('chrome-extension')) return;
  if (event.request.url.includes('google-analytics')) return;
  if (event.request.url.includes('googletagmanager')) return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // لو الملف موجود في الكاش → نرجعه فوراً
        if (response) {
          return response;
        }

        // لو مش موجود → نجلبه من الشبكة
        return fetch(event.request)
          .then(networkResponse => {
            // نتأكد إن الاستجابة سليمة قبل التخزين
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // نخزن نسخة من الاستجابة للاستخدام القادم
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                try {
                  cache.put(event.request, responseToCache);
                } catch (e) {
                  // نتجاهل الملفات الضخمة (زي الصور الكبيرة)
                }
              });

            return networkResponse;
          })
          .catch(() => {
            // لو فشل الجلب والكاش → رسالة Offline
            return new Response('⚠️ غير متصل بالإنترنت، برجاء التحقق من الشبكة.', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});