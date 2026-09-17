// Rotalı Fenci - Gelişmiş Çoklu Cihaz Senkronizasyon Yöneticisi (Supabase & Cloud Sync Engine)

(function () {
    const CONFIG_KEY = 'rotali_cloud_sync_config_v2';
    const DELETED_KEY_PREFIX = 'rotali_cloud_deleted_docs_';
    const API_STORAGE_ENDPOINT = 'https://api.restful-api.dev/objects';

    // Varsayılan Bulut Yapılandırması
    const DEFAULT_CONFIG = {
        enabled: true,
        mode: 'cloud_code', // 'supabase' veya 'cloud_code'
        supabaseUrl: '',
        supabaseKey: '',
        tableName: 'school_documents',
        cloudSyncId: '', // Cihazlar arası eşitleme kimliği (örn: ff808181a09d98f701...)
        cloudRoomName: 'rotali_fenci_okul_islerim',
        autoSyncInterval: 20, // saniye
        lastSyncTimestamp: null
    };

    window.CloudSyncManager = {
        config: null,
        supabaseClient: null,
        syncIntervalId: null,
        isSyncing: false,
        lastError: null,
        onSyncListeners: [],

        // Yapılandırmayı yükle
        loadConfig() {
            try {
                const stored = localStorage.getItem(CONFIG_KEY);
                this.config = stored ? { ...DEFAULT_CONFIG, ...JSON.parse(stored) } : { ...DEFAULT_CONFIG };
            } catch (e) {
                this.config = { ...DEFAULT_CONFIG };
            }
            this.initClient();
            return this.config;
        },

        // Yapılandırmayı kaydet
        saveConfig(newConfig) {
            this.config = { ...this.config, ...newConfig };
            try {
                localStorage.setItem(CONFIG_KEY, JSON.stringify(this.config));
            } catch (e) {
                console.error("Bulut ayarı kaydedilemedi:", e);
            }
            this.initClient();
            this.setupAutoSync();
            return this.config;
        },

        // Supabase İstemcisini Başlat
        initClient() {
            if (this.config.supabaseUrl && this.config.supabaseKey && window.supabase && window.supabase.createClient) {
                try {
                    this.supabaseClient = window.supabase.createClient(this.config.supabaseUrl, this.config.supabaseKey, {
                        auth: { persistSession: false }
                    });
                } catch (e) {
                    console.warn("Supabase istemcisi başlatılamadı:", e);
                    this.supabaseClient = null;
                }
            } else {
                this.supabaseClient = null;
            }
        },

        // Başlangıç Kurulumu & Olay Dinleyicileri
        init(onSyncCallback) {
            this.loadConfig();
            if (typeof onSyncCallback === 'function') {
                this.onSyncListeners.push(onSyncCallback);
            }

            // Sekmeye / Ekrana geri dönüldüğünde otomatik eşitle
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible') {
                    this.triggerBackgroundSync();
                }
            });

            window.addEventListener('online', () => {
                this.triggerBackgroundSync();
            });

            this.setupAutoSync();
        },

        // Periyodik Arka Plan Senkronizasyonu Kur
        setupAutoSync() {
            if (this.syncIntervalId) {
                clearInterval(this.syncIntervalId);
                this.syncIntervalId = null;
            }

            if (this.config.enabled && this.config.autoSyncInterval > 0) {
                const intervalMs = Math.max(10, this.config.autoSyncInterval) * 1000;
                this.syncIntervalId = setInterval(() => {
                    this.triggerBackgroundSync();
                }, intervalMs);
            }
        },

        // Arka Plan Eşitlemesini Tetikle
        triggerBackgroundSync() {
            if (!this.config.enabled || this.isSyncing || !navigator.onLine) return;
            if (!this.isConfigured()) {
                this.notifyListeners('sync_idle');
                return;
            }

            this.notifyListeners('sync_start');
            const uid = localStorage.getItem('rotali_active_user_id') || 'admin';
            const localData = window.StorageManager ? window.StorageManager.loadData(uid) : null;
            const localDocs = (localData && localData.schoolDocuments) ? localData.schoolDocuments : [];

            this.syncAll(localDocs, uid)
                .then(result => {
                    if (result && result.updated) {
                        this.notifyListeners('sync_complete', result.documents);
                    } else {
                        this.notifyListeners('sync_idle');
                    }
                })
                .catch(err => {
                    this.lastError = err.message || 'Senkronizasyon uyarısı';
                    this.notifyListeners('sync_idle'); // Hata popup'ı patlatmak yerine sessizce yerel modda kal
                });
        },

        // Bulut yapılandırılmış mı?
        isConfigured() {
            if (this.supabaseClient) return true;
            if (this.config.cloudSyncId && this.config.cloudSyncId.trim()) return true;
            return false;
        },

        // Olay Dinleyicilerini Bilgilendir
        notifyListeners(event, data) {
            this.onSyncListeners.forEach(listener => {
                try {
                    listener(event, data);
                } catch (e) {
                    console.error("Sync listener error:", e);
                }
            });
        },

        // Silinen belgeleri yerel listede takip et
        getDeletedDocIds(userId) {
            try {
                const raw = localStorage.getItem(DELETED_KEY_PREFIX + userId);
                return raw ? JSON.parse(raw) : [];
            } catch (e) {
                return [];
            }
        },

        markDocAsDeletedLocally(docId, userId) {
            try {
                const deleted = this.getDeletedDocIds(userId);
                if (!deleted.includes(docId)) {
                    deleted.push(docId);
                    if (deleted.length > 100) deleted.shift();
                    localStorage.setItem(DELETED_KEY_PREFIX + userId, JSON.stringify(deleted));
                }
            } catch (e) {}
        },

        // ================= ☁️ BULUT VERİTABANI İŞLEMLERİ =================

        // Otomatik Bulut Senkronizasyon Odası Oluştur (Zero Config)
        async createCloudSyncRoom(initialDocs = [], userId = 'admin') {
            try {
                const sanitizedDocs = this.sanitizeDocsForCloud(initialDocs);
                const res = await fetch(API_STORAGE_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'rotali_school_docs_' + (this.config.cloudRoomName || 'genel'),
                        data: {
                            userId: userId,
                            updatedAt: new Date().toISOString(),
                            documents: sanitizedDocs
                        }
                    })
                });

                if (res.ok) {
                    const result = await res.json();
                    if (result && result.id) {
                        this.config.cloudSyncId = result.id;
                        this.config.lastSyncTimestamp = new Date().toISOString();
                        this.saveConfig(this.config);
                        return { success: true, cloudSyncId: result.id };
                    }
                }
                return { success: false, message: 'Bulut odası oluşturulamadı.' };
            } catch (e) {
                return { success: false, message: e.message };
            }
        },

        // Bağlantıyı Test Et
        async testConnection(customConfig = null) {
            const cfg = customConfig || this.config;

            // 1. Supabase Yapılandırılmışsa
            if (cfg.supabaseUrl && cfg.supabaseKey) {
                try {
                    if (!window.supabase || !window.supabase.createClient) {
                        return { success: false, message: 'Supabase kütüphanesi yüklenemedi.' };
                    }
                    const testClient = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseKey, {
                        auth: { persistSession: false }
                    });
                    const start = performance.now();
                    const { data, error } = await testClient
                        .from(cfg.tableName || 'school_documents')
                        .select('id')
                        .limit(1);
                    
                    const duration = Math.round(performance.now() - start);

                    if (error) {
                        if (error.code === '42P01' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
                            return {
                                success: false,
                                message: `Supabase bağlantısı kuruldu fakat "${cfg.tableName || 'school_documents'}" tablosu bulunamadı. Lütfen SQL kodunu çalıştırarak tabloyu oluşturun.`
                            };
                        }
                        return { success: false, message: `Supabase Hatası: ${error.message}` };
                    }
                    return { success: true, message: `Supabase bağlantısı başarılı! 🟢 (Gecikme: ${duration}ms)` };
                } catch (e) {
                    return { success: false, message: `Bağlantı hatası: ${e.message}` };
                }
            }

            // 2. Bulut Kodu / ID Varsa
            if (cfg.cloudSyncId && cfg.cloudSyncId.trim()) {
                try {
                    const res = await fetch(`${API_STORAGE_ENDPOINT}/${cfg.cloudSyncId.trim()}`, { cache: 'no-store' });
                    if (res.ok) {
                        const json = await res.json();
                        const docCount = (json.data && Array.isArray(json.data.documents)) ? json.data.documents.length : 0;
                        return { success: true, message: `Bulut Eşitleme Odası Aktif! 🟢 (${docCount} adet belge senkronize)` };
                    } else if (res.status === 404) {
                        return { success: false, message: 'Girilen Bulut Eşitleme Kodu bulunamadı. Lütfen yeni bir kod oluşturun.' };
                    }
                    return { success: false, message: 'Bulut sunucusundan yanıt alınamadı.' };
                } catch (e) {
                    return { success: false, message: 'Bağlantı hatası: ' + e.message };
                }
            }

            return {
                success: true,
                message: '📱 Yerel Mod Aktif. Telefon ve bilgisayarı eşitlemek için yukarıdan "✨ Yeni Bulut Kodu Oluştur" butonuna basabilir veya Supabase bağlayabilirsiniz.'
            };
        },

        // Buluttan Belgeleri Çek (Pull)
        async pullFromCloud(userId = 'admin') {
            // 1. Supabase
            if (this.supabaseClient) {
                try {
                    const { data, error } = await this.supabaseClient
                        .from(this.config.tableName || 'school_documents')
                        .select('*')
                        .or(`user_id.eq.${userId},user_id.eq.shared`)
                        .order('updated_at', { ascending: false });

                    if (!error && Array.isArray(data)) {
                        return data.map(item => this.mapFromSupabaseRow(item));
                    }
                } catch (e) {
                    console.warn("Supabase pull uyarısı:", e);
                }
            }

            // 2. Cloud ID Relay
            if (this.config.cloudSyncId && this.config.cloudSyncId.trim()) {
                try {
                    const res = await fetch(`${API_STORAGE_ENDPOINT}/${this.config.cloudSyncId.trim()}`, { cache: 'no-store' });
                    if (res.ok) {
                        const json = await res.json();
                        if (json && json.data && Array.isArray(json.data.documents)) {
                            return json.data.documents;
                        }
                    }
                } catch (e) {
                    console.warn("Cloud pull uyarısı:", e);
                }
            }

            return null;
        },

        // Buluta Tek Bir Belgeyi Gönder / Güncelle
        async uploadDocToCloud(doc, userId = 'admin') {
            if (!doc || !this.config.enabled) return false;

            doc.updatedAt = new Date().toISOString();
            doc.userId = userId;

            // 1. Supabase
            if (this.supabaseClient) {
                try {
                    const row = this.mapToSupabaseRow(doc, userId);
                    await this.supabaseClient
                        .from(this.config.tableName || 'school_documents')
                        .upsert(row, { onConflict: 'id' });
                    doc._isCloudSynced = true;
                } catch (e) {
                    console.warn("Supabase upsert uyarısı:", e);
                }
            }

            // 2. Cloud Relay
            if (this.config.cloudSyncId && this.config.cloudSyncId.trim()) {
                try {
                    const currentDocs = (await this.pullFromCloud(userId)) || [];
                    const idx = currentDocs.findIndex(d => d.id === doc.id);
                    if (idx !== -1) {
                        currentDocs[idx] = doc;
                    } else {
                        currentDocs.unshift(doc);
                    }
                    await this.pushAllToCloudRelay(currentDocs, userId);
                    doc._isCloudSynced = true;
                    return true;
                } catch (e) {
                    console.warn("Cloud upload uyarısı:", e);
                }
            } else {
                // Eğer henüz bir bulut odası yoksa otomatik oluştur
                const res = await this.createCloudSyncRoom([doc], userId);
                if (res.success) {
                    doc._isCloudSynced = true;
                    return true;
                }
            }

            return false;
        },

        // Buluttan Tek Bir Belgeyi Sil
        async deleteDocFromCloud(docId, userId = 'admin') {
            if (!docId) return false;
            this.markDocAsDeletedLocally(docId, userId);

            // 1. Supabase
            if (this.supabaseClient) {
                try {
                    await this.supabaseClient
                        .from(this.config.tableName || 'school_documents')
                        .delete()
                        .eq('id', docId);
                } catch (e) {}
            }

            // 2. Cloud Relay
            if (this.config.cloudSyncId && this.config.cloudSyncId.trim()) {
                try {
                    const currentDocs = (await this.pullFromCloud(userId)) || [];
                    const filtered = currentDocs.filter(d => d.id !== docId);
                    await this.pushAllToCloudRelay(filtered, userId);
                    return true;
                } catch (e) {}
            }

            return false;
        },

        // Tüm Belgeleri Buluta Yaz
        async pushAllToCloudRelay(docs, userId = 'admin') {
            if (!this.config.cloudSyncId || !this.config.cloudSyncId.trim()) {
                const res = await this.createCloudSyncRoom(docs, userId);
                return res.success;
            }

            const sanitizedDocs = this.sanitizeDocsForCloud(docs);
            try {
                const res = await fetch(`${API_STORAGE_ENDPOINT}/${this.config.cloudSyncId.trim()}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'rotali_school_docs_' + (this.config.cloudRoomName || 'genel'),
                        data: {
                            userId: userId,
                            updatedAt: new Date().toISOString(),
                            documents: sanitizedDocs
                        }
                    })
                });
                return res.ok;
            } catch (e) {
                console.warn("Bulut yazma uyarısı:", e);
                return false;
            }
        },

        sanitizeDocsForCloud(docs) {
            return (docs || []).map(d => {
                if (d.dataUrl && d.dataUrl.length > 2 * 1024 * 1024) {
                    return {
                        ...d,
                        dataUrl: null,
                        notes: (d.notes ? d.notes + ' ' : '') + '(Büyük dosya: Cihaz hafızasında saklanıyor)'
                    };
                }
                return d;
            });
        },

        // ================= 🔄 AKILLI ÇİFT YÖNLÜ SENKRONİZASYON =================
        async syncAll(localDocs = [], userId = 'admin') {
            if (this.isSyncing) return { updated: false, documents: localDocs };
            
            // Eğer hiçbir bulut ayarı girilmemişse sessizce yerel belgeleri döndür
            if (!this.isConfigured()) {
                return { updated: false, documents: localDocs, isLocalOnly: true };
            }

            this.isSyncing = true;
            this.lastError = null;

            try {
                const deletedIds = new Set(this.getDeletedDocIds(userId));
                const cloudDocs = await this.pullFromCloud(userId);

                if (!cloudDocs) {
                    this.isSyncing = false;
                    return { updated: false, documents: localDocs };
                }

                const cloudMap = new Map();
                cloudDocs.forEach(d => {
                    if (!deletedIds.has(d.id)) {
                        cloudMap.set(d.id, d);
                    }
                });

                const localMap = new Map();
                (localDocs || []).forEach(d => {
                    if (!deletedIds.has(d.id)) {
                        localMap.set(d.id, d);
                    }
                });

                let hasChanges = false;
                const mergedDocs = [];

                for (const [id, cloudItem] of cloudMap.entries()) {
                    cloudItem._isCloudSynced = true;
                    if (!localMap.has(id)) {
                        mergedDocs.push(cloudItem);
                        hasChanges = true;
                    } else {
                        const localItem = localMap.get(id);
                        const cloudTime = new Date(cloudItem.updatedAt || 0).getTime();
                        const localTime = new Date(localItem.updatedAt || 0).getTime();

                        if (cloudTime > localTime) {
                            mergedDocs.push({ ...localItem, ...cloudItem });
                            hasChanges = true;
                        } else {
                            mergedDocs.push({ ...cloudItem, ...localItem, _isCloudSynced: true });
                            if (localTime > cloudTime) {
                                this.uploadDocToCloud(localItem, userId);
                            }
                        }
                    }
                }

                for (const [id, localItem] of localMap.entries()) {
                    if (!cloudMap.has(id)) {
                        mergedDocs.push(localItem);
                        hasChanges = true;
                        this.uploadDocToCloud(localItem, userId);
                    }
                }

                mergedDocs.sort((a, b) => {
                    const timeA = new Date(a.updatedAt || a.uploadDate || 0).getTime();
                    const timeB = new Date(b.updatedAt || b.uploadDate || 0).getTime();
                    return timeB - timeA;
                });

                this.config.lastSyncTimestamp = new Date().toISOString();
                this.saveConfig(this.config);

                this.isSyncing = false;
                return {
                    updated: hasChanges || mergedDocs.length !== (localDocs || []).length,
                    documents: mergedDocs
                };
            } catch (err) {
                this.isSyncing = false;
                this.lastError = err.message || 'Senkronizasyon hatası';
                return { updated: false, documents: localDocs };
            }
        },

        mapToSupabaseRow(doc, userId) {
            return {
                id: doc.id,
                user_id: userId || 'admin',
                name: doc.name || 'İsimsiz Belge',
                category: doc.category || 'Genel Evrak',
                extension: (doc.extension || 'DRIVE').toUpperCase(),
                size: doc.size || '',
                size_bytes: doc.sizeBytes || 0,
                type: doc.type || 'application/octet-stream',
                is_cloud_link: Boolean(doc.isCloudLink),
                url: doc.url || null,
                data_url: doc.dataUrl && doc.dataUrl.length < 2 * 1024 * 1024 ? doc.dataUrl : null,
                notes: doc.notes || '',
                upload_date: doc.uploadDate || new Date().toLocaleDateString('tr-TR'),
                updated_at: doc.updatedAt || new Date().toISOString()
            };
        },

        mapFromSupabaseRow(row) {
            return {
                id: row.id,
                name: row.name,
                category: row.category || 'Genel Evrak',
                extension: row.extension || 'DRIVE',
                size: row.size || 'Bulut Bağlantısı ☁️',
                sizeBytes: row.size_bytes || 0,
                type: row.type || '',
                isCloudLink: Boolean(row.is_cloud_link),
                url: row.url || '',
                dataUrl: row.data_url || '',
                notes: row.notes || '',
                uploadDate: row.upload_date || '',
                updatedAt: row.updated_at || new Date().toISOString(),
                _isCloudSynced: true
            };
        },

        getSQLSchema() {
            return `-- Rotalı Fenci - Okul Belgeleri Supabase Tablo & RLS Kurulumu
CREATE TABLE IF NOT EXISTS public.school_documents (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL DEFAULT 'admin',
    name TEXT NOT NULL,
    category TEXT DEFAULT 'Genel Evrak',
    extension TEXT DEFAULT 'DRIVE',
    size TEXT DEFAULT 'Bulut',
    size_bytes BIGINT DEFAULT 0,
    type TEXT DEFAULT 'application/octet-stream',
    is_cloud_link BOOLEAN DEFAULT false,
    url TEXT,
    data_url TEXT,
    notes TEXT,
    upload_date TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_school_docs_user ON public.school_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_school_docs_updated ON public.school_documents(updated_at DESC);

ALTER TABLE public.school_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Full Access" ON public.school_documents;
CREATE POLICY "Public Full Access" ON public.school_documents FOR ALL USING (true) WITH CHECK (true);
`;
        }
    };
})();
