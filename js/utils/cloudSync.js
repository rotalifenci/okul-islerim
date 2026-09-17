// Rotalı Fenci - Gerçek Supabase Bulut Veritabanı Senkronizasyon Yöneticisi

(function () {
    const STORAGE_KEY = 'rotali_supabase_config_v3';
    const DELETED_KEY_PREFIX = 'rotali_deleted_docs_';

    const DEFAULT_CONFIG = {
        supabaseUrl: '',
        supabaseKey: '',
        tableName: 'school_documents',
        autoSyncInterval: 15,
        lastSyncTimestamp: null
    };

    window.CloudSyncManager = {
        config: null,
        supabaseClient: null,
        syncIntervalId: null,
        isSyncing: false,
        lastError: null,
        onSyncListeners: [],

        loadConfig() {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                const fileConfig = window.SUPABASE_CONFIG || {};
                
                this.config = {
                    ...DEFAULT_CONFIG,
                    supabaseUrl: fileConfig.url || '',
                    supabaseKey: fileConfig.anonKey || '',
                    tableName: fileConfig.tableName || 'school_documents',
                    ...(stored ? JSON.parse(stored) : {})
                };
            } catch (e) {
                this.config = { ...DEFAULT_CONFIG };
            }

            this.initClient();
            return this.config;
        },

        saveConfig(newConfig) {
            this.config = { ...this.config, ...newConfig };
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
            } catch (e) {
                console.error("Supabase ayarları kaydedilemedi:", e);
            }
            this.initClient();
            this.setupAutoSync();
            return this.config;
        },

        isConfigured() {
            return Boolean(
                this.config &&
                this.config.supabaseUrl &&
                this.config.supabaseUrl.trim().startsWith('http') &&
                this.config.supabaseKey &&
                this.config.supabaseKey.trim().length > 20
            );
        },

        initClient() {
            if (this.isConfigured() && window.supabase && window.supabase.createClient) {
                try {
                    this.supabaseClient = window.supabase.createClient(
                        this.config.supabaseUrl.trim(),
                        this.config.supabaseKey.trim(),
                        { auth: { persistSession: false } }
                    );
                } catch (e) {
                    console.warn("Supabase client init hatası:", e);
                    this.supabaseClient = null;
                }
            } else {
                this.supabaseClient = null;
            }
        },

        init(onSyncCallback) {
            this.loadConfig();
            if (typeof onSyncCallback === 'function') {
                this.onSyncListeners.push(onSyncCallback);
            }

            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible' && this.isConfigured()) {
                    this.triggerBackgroundSync();
                }
            });

            window.addEventListener('online', () => {
                if (this.isConfigured()) {
                    this.triggerBackgroundSync();
                }
            });

            this.setupAutoSync();
        },

        setupAutoSync() {
            if (this.syncIntervalId) {
                clearInterval(this.syncIntervalId);
                this.syncIntervalId = null;
            }

            if (this.isConfigured() && this.config.autoSyncInterval > 0) {
                const intervalMs = Math.max(10, this.config.autoSyncInterval) * 1000;
                this.syncIntervalId = setInterval(() => {
                    this.triggerBackgroundSync();
                }, intervalMs);
            }
        },

        triggerBackgroundSync() {
            if (!this.isConfigured() || this.isSyncing || !navigator.onLine) return;
            
            const uid = localStorage.getItem('rotali_active_user_id') || 'admin';
            const localData = window.StorageManager ? window.StorageManager.loadData(uid) : null;
            const localDocs = (localData && localData.schoolDocuments) ? localData.schoolDocuments : [];

            this.notifyListeners('sync_start');
            this.syncAll(localDocs, uid)
                .then(result => {
                    if (result && result.updated) {
                        this.notifyListeners('sync_complete', result.documents);
                    } else {
                        this.notifyListeners('sync_idle');
                    }
                })
                .catch(err => {
                    this.lastError = err.message;
                    this.notifyListeners('sync_error', err.message);
                });
        },

        notifyListeners(event, data) {
            this.onSyncListeners.forEach(listener => {
                try { listener(event, data); } catch (e) {}
            });
        },

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

        // ================= ☁️ SUPABASE BAĞLANTI & CRUD İŞLEMLERİ =================

        async testConnection(customConfig = null) {
            const cfg = customConfig || this.config;
            const url = (cfg.supabaseUrl || '').trim();
            const key = (cfg.supabaseKey || '').trim();
            const tableName = cfg.tableName || 'school_documents';

            if (!url || !key) {
                return {
                    success: false,
                    isNotConfigured: true,
                    message: 'Supabase URL ve Anon Key henüz girilmemiş. Lütfen aşağıdaki alanları doldurun.'
                };
            }

            if (!window.supabase || !window.supabase.createClient) {
                return {
                    success: false,
                    message: 'Supabase JS kütüphanesi yüklenemedi. İnternet bağlantınızı kontrol edin.'
                };
            }

            try {
                const testClient = window.supabase.createClient(url, key, { auth: { persistSession: false } });
                const start = performance.now();
                const { data, error } = await testClient
                    .from(tableName)
                    .select('id')
                    .limit(1);

                const duration = Math.round(performance.now() - start);

                if (error) {
                    if (error.code === '42P01' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
                        return {
                            success: false,
                            needsTable: true,
                            message: `Supabase bağlantısı kuruldu fakat "${tableName}" tablosu veritabanınızda henüz oluşturulmamış. Lütfen aşağıdaki "📋 Supabase SQL Kodunu Kopyala" butonuna basarak Supabase SQL Editöründe çalıştırın.`
                        };
                    }
                    return {
                        success: false,
                        message: `Supabase Hatası (${error.code || 'Bilinmiyor'}): ${error.message}`
                    };
                }

                return {
                    success: true,
                    message: `Supabase bağlantısı başarılı! 🟢 PostgreSQL tablosu hazır. (Gecikme: ${duration}ms)`
                };
            } catch (e) {
                return {
                    success: false,
                    message: `Bağlantı hatası: ${e.message}`
                };
            }
        },

        async pullFromCloud(userId = 'admin') {
            if (!this.supabaseClient) return null;

            try {
                const tableName = this.config.tableName || 'school_documents';
                const { data, error } = await this.supabaseClient
                    .from(tableName)
                    .select('*')
                    .or(`user_id.eq.${userId},user_id.eq.shared,user_id.eq.admin`)
                    .order('updated_at', { ascending: false });

                if (!error && Array.isArray(data)) {
                    return data.map(item => this.mapFromSupabaseRow(item));
                }
                if (error) {
                    console.warn("Supabase pull error:", error);
                }
            } catch (e) {
                console.warn("Supabase pull exception:", e);
            }
            return null;
        },

        async uploadDocToCloud(doc, userId = 'admin') {
            if (!doc || !this.supabaseClient) return false;

            doc.updatedAt = new Date().toISOString();
            doc.userId = userId;

            try {
                const tableName = this.config.tableName || 'school_documents';
                const row = this.mapToSupabaseRow(doc, userId);
                const { error } = await this.supabaseClient
                    .from(tableName)
                    .upsert(row, { onConflict: 'id' });

                if (!error) {
                    doc._isCloudSynced = true;
                    return true;
                } else {
                    console.warn("Supabase upload error:", error);
                }
            } catch (e) {
                console.warn("Supabase upload exception:", e);
            }
            return false;
        },

        async deleteDocFromCloud(docId, userId = 'admin') {
            if (!docId) return false;
            this.markDocAsDeletedLocally(docId, userId);

            if (this.supabaseClient) {
                try {
                    const tableName = this.config.tableName || 'school_documents';
                    await this.supabaseClient
                        .from(tableName)
                        .delete()
                        .eq('id', docId);
                    return true;
                } catch (e) {}
            }
            return false;
        },

        async syncAll(localDocs = [], userId = 'admin') {
            if (this.isSyncing) return { updated: false, documents: localDocs };

            if (!this.isConfigured() || !this.supabaseClient) {
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
                            mergedDocs.push({ ...localItem, ...cloudItem, _isCloudSynced: true });
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
            return `-- ================================================================
-- ROTALI FENCI - SUPABASE OKUL BELGELERİ TABLO VE RLS KURULUM KODU
-- ================================================================
-- Supabase panelinizde (https://supabase.com) SQL Editor sekmesine yapıştırıp
-- yeşil "RUN" butonuna basınız.

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

-- Hızlı Sorgulama İndeksleri
CREATE INDEX IF NOT EXISTS idx_school_docs_user ON public.school_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_school_docs_updated ON public.school_documents(updated_at DESC);

-- Okuma / Yazma İzni (Row Level Security)
ALTER TABLE public.school_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public All Access" ON public.school_documents;
CREATE POLICY "Public All Access" ON public.school_documents FOR ALL USING (true) WITH CHECK (true);
`;
        }
    };
})();
