// Rotalı Fenci - Yerel Depolama ve Veri Yedekleme Yöneticisi
window.StorageManager = {
    STORAGE_KEY: 'rotali_fenci_os_v1',
    SETTINGS_KEY: 'rotali_fenci_settings_v1',

    // Verileri yükle veya başlangıç veri setiyle başlat
    loadData() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (window.InitialData) {
                    if (!parsed._murat_kundakci_duty_v5) {
                        if (parsed.teacher) {
                            parsed.teacher.school = "";
                            parsed.teacher.dutyArea = window.InitialData.teacher.dutyArea;
                            parsed.teacher.dutyLocations = window.InitialData.teacher.dutyLocations;
                            parsed.teacher.dutyRotation = window.InitialData.teacher.dutyRotation;
                        } else {
                            parsed.teacher = JSON.parse(JSON.stringify(window.InitialData.teacher));
                        }
                        parsed._murat_kundakci_duty_v5 = true;
                        this.saveData(parsed);
                    }
                    if (!parsed._mai_sinif_students_v1) {
                        parsed.classes = JSON.parse(JSON.stringify(window.InitialData.classes || []));
                        parsed.students = JSON.parse(JSON.stringify(window.InitialData.students || []));
                        parsed._mai_sinif_students_v1 = true;
                        this.saveData(parsed);
                    }
                    if (!parsed.navSections || !parsed.navSections.length) {
                        parsed.navSections = JSON.parse(JSON.stringify(window.InitialData.navSections || []));
                    }
                    if (!parsed.customSections) {
                        parsed.customSections = JSON.parse(JSON.stringify(window.InitialData.customSections || []));
                    }
                    if (!parsed._clean_classrooms_v1 && window.InitialData.weeklySchedule) {
                        parsed.weeklySchedule = JSON.parse(JSON.stringify(window.InitialData.weeklySchedule));
                        parsed._clean_classrooms_v1 = true;
                        this.saveData(parsed);
                    }
                    if (!parsed.lessonPeriods) parsed.lessonPeriods = JSON.parse(JSON.stringify(window.InitialData.lessonPeriods || []));
                }
                return parsed;
            }
        } catch (e) {
            console.error("Veri yükleme hatası:", e);
        }

        // İlk defa açılıyorsa InitialData yükle ve kaydet
        const initial = window.InitialData ? JSON.parse(JSON.stringify(window.InitialData)) : {};
        initial._murat_kundakci_duty_v5 = true;
        this.saveData(initial);
        return initial;
    },

    // Verileri kaydet
    saveData(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            localStorage.setItem('rotali_fenci_last_backup', new Date().toISOString());
            return true;
        } catch (e) {
            console.error("Veri kaydetme hatası:", e);
            alert("Veri kaydedilirken depolama alanı hatası oluştu!");
            return false;
        }
    },

    // Ayarları yükle
    loadSettings() {
        try {
            const raw = localStorage.getItem(this.SETTINGS_KEY);
            if (raw) return JSON.parse(raw);
        } catch (e) {}
        return {
            theme: 'dark',
            geminiApiKey: '',
            autoBackup: true,
            soundEffects: true,
            compactMode: false,
            schoolName: '',
            teacherName: 'Murat Kundakcı (Rotalı Fenci)',
            pinLock: ''
        };
    },

    // Ayarları kaydet
    saveSettings(settings) {
        try {
            localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
            return true;
        } catch (e) {
            return false;
        }
    },

    // JSON Olarak Dışa Aktar (Dosya İndir)
    exportJSON(data) {
        const payload = {
            brand: "Rotalı Fenci Kişisel Öğretmen İşletim Sistemi",
            version: "2.0.0",
            exportDate: new Date().toISOString(),
            data: data || this.loadData(),
            settings: this.loadSettings()
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const dateStr = new Date().toISOString().slice(0, 10);
        a.download = `rotali-fenci-tam-yedek-${dateStr}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    // JSON Dosyasından İçe Aktar
    importJSON(file, callback) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsed = JSON.parse(e.target.result);
                if (parsed.data) {
                    this.saveData(parsed.data);
                    if (parsed.settings) this.saveSettings(parsed.settings);
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
    resetToDefaults() {
        if (confirm("DİKKAT: Tüm verileriniz sıfırlanacak ve fabrika ayarlarına dönülecektir. Devam etmek istiyor musunuz?")) {
            localStorage.removeItem(this.STORAGE_KEY);
            localStorage.removeItem(this.SETTINGS_KEY);
            const fresh = JSON.parse(JSON.stringify(window.InitialData || {}));
            this.saveData(fresh);
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
