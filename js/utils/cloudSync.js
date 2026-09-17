// Rotalı Fenci - Gerçek Supabase Bulut Veritabanı Senkronizasyon Yöneticisi (Tam Otomatik & Canlı)

(function () {
    const STORAGE_KEY = 'rotali_supabase_config_v3';
    const DELETED_KEY_PREFIX = 'rotali_deleted_docs_';

    const DEFAULT_CONFIG = {
        supabaseUrl: 'https://wthklmdzkxccdxumlcvh.supabase.co',
        supabaseKey: 'sb_publishable_SjTKEYpK9qZ85N4hj_pyaA_bnpN-QeU',
        tableName: 'school_documents',
        autoSyncInterval: 10, // 10 saniyede bir tam otomatik arka plan eşitlemesi
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
                const storedRaw = localStorage.getItem(STORAGE_KEY);
                const stored = storedRaw ? JSON.parse(storedRaw) : {};
                const fileConfig = window.SUPABASE_CONFIG || {};

                const url = (fileConfig.url && fileConfig.url.trim()) 
                    ? fileConfig.url.trim() 
                    : ((stored.supabaseUrl && stored.supabaseUrl.trim()) ? stored.supabaseUrl.trim() : DEFAULT_CONFIG.supabaseUrl);

                const key = (fileConfig.anonKey && fileConfig.anonKey.trim()) 
                    ? fileConfig.anonKey.trim() 
                    : ((stored.supabaseKey && stored.supabaseKey.trim()) ? stored.supabaseKey.trim() : DEFAULT_CONFIG.supabaseKey);

                const tableName = (fileConfig.tableName && fileConfig.tableName.trim()) 
                    ? fileConfig.tableName.trim() 
                    : ((stored.tableName && stored.tableName.trim()) ? stored.tableName.trim() : DEFAULT_CONFIG.tableName);

                this.config = {
                    ...DEFAULT_CONFIG,
                    ...stored,
                    supabaseUrl: url,
                    supabaseKey: key,
                    tableName: tableName
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
                this.config.supabaseKey.trim().length > 10
            );
        },

        getHeaders() {
            const key = (this.config.supabaseKey || '').trim();
            return {
                'apikey': key,
                'Authorization': 'Bearer ' + key,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            };
        },

        getRestUrl() {
            let base = (this.config.supabaseUrl || '').trim();
            if (base.endsWith('/')) base = base.slice(0, -1);
            if (base.endsWith('/rest/v1')) base = base.slice(0, -8);
            return `${base}/rest/v1/${this.config.tableName || 'school_documents'}`;
        },

        initClient() {
            if (this.isConfigured() && window.supabase && window.supabase.createClient) {
                try {
                    let base = (this.config.supabaseUrl || '').trim();
                    if (base.endsWith('/rest/v1')) base = base.slice(0, -8);
                    this.supabaseClient = window.supabase.createClient(
                        base,
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

            // Sekmeye geri dönüldüğünde veya ekran açıldığında anında çek
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

            window.addEventListener('focus', () => {
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
                const intervalMs = Math.max(5, this.config.autoSyncInterval) * 1000;
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
                    this.notifyListeners('sync_idle');
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

        // ================= ☁️ SUPABASE CRUD İŞLEMLERİ =================

        async testConnection(customConfig = null) {
            const cfg = customConfig || this.config;
            const url = (cfg.supabaseUrl || '').trim();
            const key = (cfg.supabaseKey || '').trim();

            if (!url || !key) {
                return {
                    success: false,
                    isNotConfigured: true,
                    message: 'Supabase URL ve Anon Key henüz girilmemiş.'
                };
            }

            try {
                let restUrl = url;
                if (restUrl.endsWith('/')) restUrl = restUrl.slice(0, -1);
                if (restUrl.endsWith('/rest/v1')) restUrl = restUrl.slice(0, -8);
                restUrl = `${restUrl}/rest/v1/${cfg.tableName || 'school_documents'}?select=id&limit=1`;

                const start = performance.now();
                const res = await fetch(restUrl, {
                    method: 'GET',
                    headers: {
                        'apikey': key,
                        'Authorization': 'Bearer ' + key
                    }
                });

                const duration = Math.round(performance.now() - start);

                if (res.ok) {
                    return {
                        success: true,
                        message: `Supabase bulut bağlantısı aktif ve çalışıyor! 🟢 (Gecikme: ${duration}ms)`
                    };
                } else if (res.status === 404 || res.status === 400) {
                    const text = await res.text();
                    return {
                        success: false,
                        message: `Supabase tablosu bulunamadı veya yetki hatası: ${text}`
                    };
                } else {
                    return {
                        success: false,
                        message: `Supabase HTTP ${res.status}: ${res.statusText}`
                    };
                }
            } catch (e) {
                return {
                    success: false,
                    message: `Bağlantı hatası: ${e.message}`
                };
            }
        },

        async pullFromCloud(userId = 'admin') {
            if (!this.isConfigured()) return null;

            try {
                const restUrl = `${this.getRestUrl()}?select=*&order=updated_at.desc`;
                const res = await fetch(restUrl, {
                    method: 'GET',
                    headers: this.getHeaders(),
                    cache: 'no-store'
                });

                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        return data.map(item => this.mapFromSupabaseRow(item));
                    }
                } else {
                    console.warn("Supabase REST pull status:", res.status);
                }
            } catch (e) {
                console.warn("Supabase pull exception:", e);
            }
            return null;
        },

        async uploadDocToCloud(doc, userId = 'admin') {
            if (!doc || !this.isConfigured()) return false;

            doc.updatedAt = new Date().toISOString();
            doc.userId = userId;

            try {
                const row = this.mapToSupabaseRow(doc, userId);
                const restUrl = this.getRestUrl();
                const res = await fetch(restUrl, {
                    method: 'POST',
                    headers: {
                        ...this.getHeaders(),
                        'Prefer': 'resolution=merge-duplicates,return=representation'
                    },
                    body: JSON.stringify(row)
                });

                if (res.ok || res.status === 201) {
                    doc._isCloudSynced = true;
                    return true;
                } else {
                    console.warn("Supabase upload status:", res.status, await res.text());
                }
            } catch (e) {
                console.warn("Supabase upload exception:", e);
            }
            return false;
        },

        async deleteDocFromCloud(docId, userId = 'admin') {
            if (!docId) return false;
            this.markDocAsDeletedLocally(docId, userId);

            if (this.isConfigured()) {
                try {
                    const restUrl = `${this.getRestUrl()}?id=eq.${encodeURIComponent(docId)}`;
                    await fetch(restUrl, {
                        method: 'DELETE',
                        headers: this.getHeaders()
                    });
                    return true;
                } catch (e) {}
            }
            return false;
        },

        async syncAll(localDocs = [], userId = 'admin') {
            if (this.isSyncing) return { updated: false, documents: localDocs };

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
                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
                } catch (e) {}

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
DROP POLICY IF EXISTS "Public All Access" ON public.school_documents;
CREATE POLICY "Public All Access" ON public.school_documents FOR ALL USING (true) WITH CHECK (true);
`;
        }
    };
})();
