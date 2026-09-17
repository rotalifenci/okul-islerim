// Rotalı Fenci - Bulut Tabanlı Çoklu Cihaz Senkronizasyon Yöneticisi (Supabase & Cloud Sync)

(function () {
    const CONFIG_KEY = 'rotali_cloud_sync_config_v1';
    const DELETED_KEY_PREFIX = 'rotali_cloud_deleted_docs_';

    // Varsayılan Bulut Yapılandırması
    const DEFAULT_CONFIG = {
        enabled: true,
        provider: 'supabase', // 'supabase' veya 'cloud_relay'
        supabaseUrl: '',
        supabaseKey: '',
        tableName: 'school_documents',
        workspaceKey: 'rotali-fenci-okul-islerim',
        autoSyncInterval: 15, // saniye
        lastSyncTimestamp: null,
        relayEndpoint: 'https://kv.val.run/rotali_fenci_docs_' // Universal hızlı bulut köprüsü
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
            this.notifyListeners('sync_start');
            
            // Aktif kullanıcı ID'sini al
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
                    this.lastError = err.message || 'Senkronizasyon hatası';
                    this.notifyListeners('sync_error', this.lastError);
                });
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

        // Silinen belgeleri yerel listede takip et (Çapraz cihaz silme senkronizasyonu için)
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
                    // Son 100 silinen ID'yi sakla
                    if (deleted.length > 100) deleted.shift();
                    localStorage.setItem(DELETED_KEY_PREFIX + userId, JSON.stringify(deleted));
                }
            } catch (e) {}
        },

        // ================= ☁️ BULUT VERİTABANI İŞLEMLERİ =================

        // Bağlantıyı Test Et
        async testConnection(customConfig = null) {
            const cfg = customConfig || this.config;
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
                                message: `Supabase bağlantısı kuruldu fakat "${cfg.tableName || 'school_documents'}" tablosu bulunamadı. Lütfen aşağıdaki SQL komutunu Supabase SQL editöründe çalıştırarak tabloyu oluşturun.`
                            };
                        }
                        return { success: false, message: `Supabase Hatası: ${error.message} (${error.code || 'Bilinmiyor'})` };
                    }
                    return { success: true, message: `Supabase bağlantısı başarılı! 🟢 (Gecikme: ${duration}ms)` };
                } catch (e) {
                    return { success: false, message: `Bağlantı hatası: ${e.message}` };
                }
            } else {
                // Varsayılan Bulut Köprüsünü Test Et
                try {
                    const wsKey = cfg.workspaceKey || 'rotali-fenci-okul-islerim';
                    const testUrl = `${cfg.relayEndpoint || DEFAULT_CONFIG.relayEndpoint}${encodeURIComponent(wsKey)}`;
                    const res = await fetch(testUrl, { method: 'GET', cache: 'no-store' });
                    if (res.ok || res.status === 404) {
                        return { success: true, message: 'Hazır Bulut Senkronizasyon Köprüsü Aktif! 🟢 Çoklu cihaz erişimine hazır.' };
                    }
                    return { success: true, message: 'Bulut sunucusu yanıt verdi. 🟢' };
                } catch (e) {
                    return { success: false, message: `Bulut bağlantı uyarısı: ${e.message}` };
                }
            }
        },

        // Buluttan Belgeleri Çek (Pull)
        async pullFromCloud(userId = 'admin') {
            const wsKey = `${this.config.workspaceKey || 'rotali-fenci-okul-islerim'}_${userId}`;

            // 1. Supabase Yapılandırılmışsa Supabase'den Çek
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
                    console.warn("Supabase pull hatası:", e);
                }
            }

            // 2. Hazır Bulut Köprüsünden Çek
            try {
                const endpoint = `${this.config.relayEndpoint || DEFAULT_CONFIG.relayEndpoint}${encodeURIComponent(wsKey)}`;
                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' },
                    cache: 'no-store'
                });

                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data)) return data;
                    if (data && Array.isArray(data.documents)) return data.documents;
                }
            } catch (e) {
                console.warn("Bulut köprüsü pull hatası:", e);
            }

            return null;
        },

        // Buluta Tek Bir Belgeyi Gönder / Güncelle (Upsert)
        async uploadDocToCloud(doc, userId = 'admin') {
            if (!doc || !this.config.enabled) return false;

            const wsKey = `${this.config.workspaceKey || 'rotali-fenci-okul-islerim'}_${userId}`;
            doc.updatedAt = new Date().toISOString();
            doc.userId = userId;

            // 1. Supabase Varsa
            if (this.supabaseClient) {
                try {
                    const row = this.mapToSupabaseRow(doc, userId);
                    const { error } = await this.supabaseClient
                        .from(this.config.tableName || 'school_documents')
                        .upsert(row, { onConflict: 'id' });

                    if (!error) {
                        doc._isCloudSynced = true;
                    }
                } catch (e) {
                    console.warn("Supabase upsert hatası:", e);
                }
            }

            // 2. Hazır Bulut Köprüsü
            try {
                const currentCloudDocs = (await this.pullFromCloud(userId)) || [];
                const idx = currentCloudDocs.findIndex(d => d.id === doc.id);
                if (idx !== -1) {
                    currentCloudDocs[idx] = doc;
                } else {
                    currentCloudDocs.unshift(doc);
                }

                await this.pushAllToRelay(currentCloudDocs, userId);
                doc._isCloudSynced = true;
                return true;
            } catch (e) {
                console.warn("Bulut köprüsüne kaydetme hatası:", e);
            }

            return false;
        },

        // Buluttan Tek Bir Belgeyi Sil
        async deleteDocFromCloud(docId, userId = 'admin') {
            if (!docId) return false;
            this.markDocAsDeletedLocally(docId, userId);

            // 1. Supabase Varsa
            if (this.supabaseClient) {
                try {
                    await this.supabaseClient
                        .from(this.config.tableName || 'school_documents')
                        .delete()
                        .eq('id', docId);
                } catch (e) {
                    console.warn("Supabase delete hatası:", e);
                }
            }

            // 2. Hazır Bulut Köprüsü
            try {
                const currentCloudDocs = (await this.pullFromCloud(userId)) || [];
                const filtered = currentCloudDocs.filter(d => d.id !== docId);
                await this.pushAllToRelay(filtered, userId);
                return true;
            } catch (e) {
                console.warn("Bulut köprüsü silme hatası:", e);
            }

            return false;
        },

        // Tüm Doküman Listesini Bulut Köprüsüne Yaz
        async pushAllToRelay(docs, userId = 'admin') {
            const wsKey = `${this.config.workspaceKey || 'rotali-fenci-okul-islerim'}_${userId}`;
            const endpoint = `${this.config.relayEndpoint || DEFAULT_CONFIG.relayEndpoint}${encodeURIComponent(wsKey)}`;

            // Çok büyük dosyaları (base64 > 2MB) korumak için optimize et
            const sanitizedDocs = (docs || []).map(d => {
                if (d.dataUrl && d.dataUrl.length > 3 * 1024 * 1024) {
                    return {
                        ...d,
                        dataUrl: null,
                        notes: (d.notes ? d.notes + ' ' : '') + '(Büyük dosya: Cihaz yerel belleğinde saklanıyor)'
                    };
                }
                return d;
            });

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        updatedAt: new Date().toISOString(),
                        userId: userId,
                        documents: sanitizedDocs
                    })
                });
                return response.ok;
            } catch (e) {
                console.warn("Bulut köprüsüne toplu yazma hatası:", e);
                return false;
            }
        },

        // ================= 🔄 AKILLI ÇİFT YÖNLÜ SENKRONİZASYON =================
        async syncAll(localDocs = [], userId = 'admin') {
            if (this.isSyncing) return { updated: false, documents: localDocs };
            this.isSyncing = true;
            this.lastError = null;

            try {
                const deletedIds = new Set(this.getDeletedDocIds(userId));
                const cloudDocs = await this.pullFromCloud(userId);

                if (!cloudDocs) {
                    // Buluta erişilemedi, yerel belgeleri koru
                    this.isSyncing = false;
                    return { updated: false, documents: localDocs };
                }

                // Bulut dokümanlarını harita yap
                const cloudMap = new Map();
                cloudDocs.forEach(d => {
                    if (!deletedIds.has(d.id)) {
                        cloudMap.set(d.id, d);
                    }
                });

                // Yerel dokümanları harita yap
                const localMap = new Map();
                (localDocs || []).forEach(d => {
                    if (!deletedIds.has(d.id)) {
                        localMap.set(d.id, d);
                    }
                });

                let hasChanges = false;
                const mergedDocs = [];

                // 1. Buluttaki tüm geçerli dokümanları incele
                for (const [id, cloudItem] of cloudMap.entries()) {
                    cloudItem._isCloudSynced = true;
                    if (!localMap.has(id)) {
                        // Yeni belge buluttan geldi
                        mergedDocs.push(cloudItem);
                        hasChanges = true;
                    } else {
                        // İki tarafta da var; en güncelini al
                        const localItem = localMap.get(id);
                        const cloudTime = new Date(cloudItem.updatedAt || 0).getTime();
                        const localTime = new Date(localItem.updatedAt || 0).getTime();

                        if (cloudTime > localTime) {
                            mergedDocs.push({ ...localItem, ...cloudItem });
                            hasChanges = true;
                        } else {
                            // Yerel daha güncelse veya eşitse
                            mergedDocs.push({ ...cloudItem, ...localItem, _isCloudSynced: true });
                            if (localTime > cloudTime) {
                                // Buluta güncel halini gönder
                                this.uploadDocToCloud(localItem, userId);
                            }
                        }
                    }
                }

                // 2. Yerelde olup bulutta henüz olmayanları buluta gönder
                for (const [id, localItem] of localMap.entries()) {
                    if (!cloudMap.has(id)) {
                        mergedDocs.push(localItem);
                        hasChanges = true;
                        // Buluta yükle
                        this.uploadDocToCloud(localItem, userId);
                    }
                }

                // Tarihe göre sırala (En yeni en üstte)
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
                this.lastError = err.message || 'Senkronizasyon sırasında hata oluştu.';
                throw err;
            }
        },

        // ================= YARDIMCI VERİ DÖNÜŞTÜRÜCÜLER =================
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

        // Supabase Tablo SQL Kurulum Betiği
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

-- Hızlı Arama & Filtreleme İndeksleri
CREATE INDEX IF NOT EXISTS idx_school_docs_user ON public.school_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_school_docs_updated ON public.school_documents(updated_at DESC);

-- RLS (Row Level Security) Etkinleştirme
ALTER TABLE public.school_documents ENABLE ROW LEVEL SECURITY;

-- Genel Okuma ve Yazma Politikası
DROP POLICY IF EXISTS "Public Full Access" ON public.school_documents;
CREATE POLICY "Public Full Access" ON public.school_documents FOR ALL USING (true) WITH CHECK (true);
`;
        }
    };
})();
