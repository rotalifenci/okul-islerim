// Rotalı Fenci - Yerel Depolama ve Veri Yedekleme Yöneticisi (Çoklu Öğretmen Desteği)
window.StorageManager = {
    DEFAULT_STORAGE_KEY: 'rotali_fenci_os_v1',
    TEACHER2_STORAGE_KEY: 'rotali_fenci_os_teacher2_v1',
    SETTINGS_KEY_PREFIX: 'rotali_fenci_settings_',
    ACCOUNTS_KEY: 'rotali_teacher_accounts_v1',
    ACTIVE_TEACHER_KEY: 'rotali_active_teacher_id',

    // Öğretmen Hesaplarını Yükle (Varsayılan veya Kayıtlı)
    getAccounts() {
        try {
            const raw = localStorage.getItem(this.ACCOUNTS_KEY);
            if (raw) {
                return JSON.parse(raw);
            }
        } catch (e) {}
        const defs = window.DefaultTeacherAccounts || {};
        this.saveAccounts(defs);
        return JSON.parse(JSON.stringify(defs));
    },

    // Öğretmen Hesaplarını Kaydet
    saveAccounts(accounts) {
        try {
            localStorage.setItem(this.ACCOUNTS_KEY, JSON.stringify(accounts));
            return true;
        } catch (e) {
            return false;
        }
    },

    // Aktif Öğretmen ID'sini Al
    getActiveTeacherId() {
        return localStorage.getItem(this.ACTIVE_TEACHER_KEY) || 'teacher1';
    },

    // Aktif Öğretmeni Belirle
    setActiveTeacherId(teacherId) {
        localStorage.setItem(this.ACTIVE_TEACHER_KEY, teacherId || 'teacher1');
    },

    // Öğretmene Özel Depolama Anahtarı
    getStorageKey(teacherId) {
        const tId = teacherId || this.getActiveTeacherId();
        return tId === 'teacher2' ? this.TEACHER2_STORAGE_KEY : this.DEFAULT_STORAGE_KEY;
    },

    // Verileri yükle veya ilgili öğretmenin başlangıç veri setiyle başlat
    loadData(teacherId) {
        const tId = teacherId || this.getActiveTeacherId();
        const key = this.getStorageKey(tId);
        try {
            const raw = localStorage.getItem(key);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (tId === 'teacher1' && window.InitialData) {
                    if (!parsed._murat_kundakci_21ders_v4) {
                        parsed.teacher = JSON.parse(JSON.stringify(window.InitialData.teacher));
                        parsed.classes = JSON.parse(JSON.stringify(window.InitialData.classes));
                        parsed.students = JSON.parse(JSON.stringify(window.InitialData.students));
                        parsed.homeworkDays = JSON.parse(JSON.stringify(window.InitialData.homeworkDays));
                        parsed.weeklySchedule = JSON.parse(JSON.stringify(window.InitialData.weeklySchedule));
                        parsed.tasks = JSON.parse(JSON.stringify(window.InitialData.tasks));
                        parsed._murat_kundakci_21ders_v4 = true;
                        this.saveData(parsed, tId);
                    }
                    if (!parsed.lessonPeriods) parsed.lessonPeriods = JSON.parse(JSON.stringify(window.InitialData.lessonPeriods || []));
                } else if (tId === 'teacher2' && window.InitialDataTeacher2) {
                    if (!parsed._teacher2_init_v1) {
                        parsed.teacher = JSON.parse(JSON.stringify(window.InitialDataTeacher2.teacher));
                        parsed._teacher2_init_v1 = true;
                        this.saveData(parsed, tId);
                    }
                    if (!parsed.lessonPeriods) parsed.lessonPeriods = JSON.parse(JSON.stringify(window.InitialDataTeacher2.lessonPeriods || []));
                }
                return parsed;
            }
        } catch (e) {
            console.error("Veri yükleme hatası:", e);
        }

        // İlgili öğretmenin ilk verisini yükle ve kaydet
        let initial = {};
        if (tId === 'teacher2') {
            initial = window.InitialDataTeacher2 ? JSON.parse(JSON.stringify(window.InitialDataTeacher2)) : {};
            initial._teacher2_init_v1 = true;
        } else {
            initial = window.InitialData ? JSON.parse(JSON.stringify(window.InitialData)) : {};
            initial._murat_kundakci_21ders_v4 = true;
        }
        this.saveData(initial, tId);
        return initial;
    },

    // Verileri kaydet
    saveData(data, teacherId) {
        const tId = teacherId || this.getActiveTeacherId();
        const key = this.getStorageKey(tId);
        try {
            localStorage.setItem(key, JSON.stringify(data));
            localStorage.setItem(`rotali_fenci_last_backup_${tId}`, new Date().toISOString());
            return true;
        } catch (e) {
            console.error("Veri kaydetme hatası:", e);
            alert("Veri kaydedilirken depolama alanı hatası oluştu!");
            return false;
        }
    },

    // Ayarları yükle
    loadSettings(teacherId) {
        const tId = teacherId || this.getActiveTeacherId();
        try {
            const raw = localStorage.getItem(`${this.SETTINGS_KEY_PREFIX}${tId}`);
            if (raw) return JSON.parse(raw);
        } catch (e) {}
        return {
            theme: 'dark',
            geminiApiKey: '',
            autoBackup: true,
            soundEffects: true,
            compactMode: false,
            schoolName: 'Şehit Öğretmen Ortaokulu',
            teacherName: tId === 'teacher2' ? '2. Fen Bilimleri Öğretmeni' : 'Murat Kundakcı (Rotalı Fenci)',
            pinLock: ''
        };
    },

    // Ayarları kaydet
    saveSettings(settings, teacherId) {
        const tId = teacherId || this.getActiveTeacherId();
        try {
            localStorage.setItem(`${this.SETTINGS_KEY_PREFIX}${tId}`, JSON.stringify(settings));
            return true;
        } catch (e) {
            return false;
        }
    },

    // JSON Olarak Dışa Aktar (Dosya İndir)
    exportJSON(data, teacherId) {
        const tId = teacherId || this.getActiveTeacherId();
        const payload = {
            brand: "Rotalı Fenci Kişisel Öğretmen İşletim Sistemi",
            version: "2.0.0",
            teacherId: tId,
            exportDate: new Date().toISOString(),
            data: data || this.loadData(tId),
            settings: this.loadSettings(tId)
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const dateStr = new Date().toISOString().slice(0, 10);
        a.download = `rotali-fenci-${tId}-yedek-${dateStr}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    // JSON Dosyasından İçe Aktar
    importJSON(file, callback, teacherId) {
        const tId = teacherId || this.getActiveTeacherId();
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsed = JSON.parse(e.target.result);
                if (parsed.data) {
                    this.saveData(parsed.data, tId);
                    if (parsed.settings) this.saveSettings(parsed.settings, tId);
                    if (callback) callback(true, "Yedek başarıyla geri yüklendi!");
                } else {
                    if (callback) callback(false, "Geçersiz yedek dosyası formatı!");
                }
            } catch (err) {
                if (callback) callback(false, "Dosya okuma hatası: " + err.message);
            }
        };
        reader.readAsText(file);
    },

    // Varsayılan Fabrika Verilerine Dön
    resetToDefaults(teacherId) {
        const tId = teacherId || this.getActiveTeacherId();
        const key = this.getStorageKey(tId);
        if (confirm("DİKKAT: Bu öğretmenin tüm verileri sıfırlanacak ve başlangıç durumuna dönülecektir. Devam etmek istiyor musunuz?")) {
            localStorage.removeItem(key);
            const fresh = tId === 'teacher2' 
                ? JSON.parse(JSON.stringify(window.InitialDataTeacher2 || {}))
                : JSON.parse(JSON.stringify(window.InitialData || {}));
            this.saveData(fresh, tId);
            window.location.reload();
        }
    },

    // Depolama Kullanım Boyutu (KB)
    getStorageUsage() {
        let total = 0;
        for (let x in localStorage) {
            if (localStorage.hasOwnProperty(x)) {
                total += ((localStorage[x].length + x.length) * 2);
            }
        }
        return (total / 1024).toFixed(2);
    }
};
