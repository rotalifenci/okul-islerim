// Rotalı Fenci - Çoklu Kullanıcı & Katı Veri İzolasyonu Depolama Yöneticisi
window.StorageManager = {
    ADMIN_STORAGE_KEY: 'rotali_fenci_os_v1',
    SETTINGS_KEY: 'rotali_fenci_settings_v1',

    // Aktif kullanıcının storage anahtarını belirle
    getUserStorageKey(userId = null) {
        const uid = userId || localStorage.getItem('rotali_active_user_id') || 'admin';
        if (uid === 'admin') {
            return this.ADMIN_STORAGE_KEY;
        }
        return `rotali_fenci_user_${uid}_v1`;
    },

    // Verileri yükle veya kullanıcıya özel başlangıç veri setiyle başlat
    loadData(userId = null) {
        const uid = userId || localStorage.getItem('rotali_active_user_id') || 'admin';
        const storageKey = this.getUserStorageKey(uid);

        try {
            const raw = localStorage.getItem(storageKey);
            if (raw) {
                const parsed = JSON.parse(raw);
                
                // Eğer yönetici ise tüm güncellemeleri ve migrationları uygula
                if (uid === 'admin') {
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
                            this.saveData(parsed, uid);
                        }
                        if (!parsed._mai_sinif_students_v1) {
                            parsed.classes = JSON.parse(JSON.stringify(window.InitialData.classes || []));
                            parsed.students = JSON.parse(JSON.stringify(window.InitialData.students || []));
                            parsed._mai_sinif_students_v1 = true;
                            this.saveData(parsed, uid);
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
                            this.saveData(parsed, uid);
                        }
                        if (!parsed._school_meetings_tab_v1) {
                            if (parsed.navSections && Array.isArray(parsed.navSections)) {
                            parsed.navSections.forEach(s => { s.badge = ''; });
                                const hasMeetings = parsed.navSections.some(s => s.id === 'school-meetings');
                                if (!hasMeetings) {
                                    const taskIdx = parsed.navSections.findIndex(s => s.id === 'school-tasks');
                                    const meetSec = { id: 'school-meetings', title: '👥 Okul Toplantılarım', icon: 'users', color: 'indigo', visible: true, isSystem: true, badge: '' };
                                    if (taskIdx !== -1) {
                                        parsed.navSections.splice(taskIdx, 0, meetSec);
                                    } else {
                                        parsed.navSections.push(meetSec);
                                    }
                                }
                            }
                            if (!parsed.meetings) {
                                parsed.meetings = JSON.parse(JSON.stringify(window.InitialData.meetings || []));
                            }
                            parsed._school_meetings_tab_v1 = true;
                            this.saveData(parsed, uid);
                        }
                        if (!parsed._daily_plan_tab_v1) {
                            if (!parsed.dailyPlans) {
                                parsed.dailyPlans = JSON.parse(JSON.stringify(window.InitialData.dailyPlans || []));
                            }
                            parsed._daily_plan_tab_v1 = true;
                            this.saveData(parsed, uid);
                        }
                        if (!parsed.lessonPeriods) parsed.lessonPeriods = JSON.parse(JSON.stringify(window.InitialData.lessonPeriods || []));

                        if (parsed.navSections && Array.isArray(parsed.navSections)) {
                            parsed.navSections.forEach(s => { s.badge = ''; });
                            const hasMaarif = parsed.navSections.some(s => s.id === 'maarif-works');
                            if (!hasMaarif) {
                                const mSec = { id: 'maarif-works', title: '🎨 Maarif Çalışmaları', icon: 'palette', color: 'emerald', visible: true, isSystem: true, badge: '' };
                                const dpIdx = parsed.navSections.findIndex(s => s.id === 'daily-plan');
                                if (dpIdx !== -1) {
                                    parsed.navSections.splice(dpIdx + 1, 0, mSec);
                                } else {
                                    parsed.navSections.push(mSec);
                                }
                                this.saveData(parsed, uid);
                            }
                        }
                                                if (parsed.navSections && Array.isArray(parsed.navSections)) {
                            parsed.navSections.forEach(s => { s.badge = ''; });
                            const hasStudentList = parsed.navSections.some(s => s.id === 'student-list');
                            if (!hasStudentList) {
                                const slSec = { id: 'student-list', title: '👨‍🎓 Öğrenci Listesi', icon: 'graduation-cap', color: 'blue', visible: true, isSystem: true, badge: '' };
                                const stIdx = parsed.navSections.findIndex(s => s.id === 'school-tasks');
                                if (stIdx !== -1) {
                                    parsed.navSections.splice(stIdx + 1, 0, slSec);
                                } else {
                                    parsed.navSections.push(slSec);
                                }
                                this.saveData(parsed, uid);
                            }
                        }

                        if (!parsed.maarifWorks) {
                            parsed.maarifWorks = JSON.parse(JSON.stringify(window.InitialData.maarifWorks || []));
                        }


                        if (parsed.weeklySchedule) {
                            Object.keys(parsed.weeklySchedule).forEach(day => {
                                if (Array.isArray(parsed.weeklySchedule[day])) {
                                    parsed.weeklySchedule[day].forEach(lesson => {
                                        if (lesson.room && lesson.room.includes('Kendi Sınıfı') && lesson.classId && lesson.classId !== 'Boş') {
                                            lesson.room = lesson.classId + ' Sınıfı';
                                        }
                                    });
                                }
                            });
                        }


                        if (parsed.navSections && Array.isArray(parsed.navSections)) {
                            parsed.navSections.forEach(s => { s.badge = ''; });
                            const hasAccount = parsed.navSections.some(s => s.id === 'account');
                            if (!hasAccount) {
                                const accSec = { id: 'account', title: '👤 Hesap Bilgilerim', icon: 'user-check', color: 'red', visible: true, isSystem: true, badge: '' };
                                const setIdx = parsed.navSections.findIndex(s => s.id === 'settings');
                                if (setIdx !== -1) {
                                    parsed.navSections.splice(setIdx, 0, accSec);
                                } else {
                                    parsed.navSections.push(accSec);
                                }
                                this.saveData(parsed, uid);
                            }
                        }

                    }
                } else {
                    // Öğretmen kullanıcısı için garanti alanlar
                    if (!parsed.weeklySchedule) parsed.weeklySchedule = window.createEmptyWeeklySchedule ? window.createEmptyWeeklySchedule() : {};
                    if (!parsed.classes) parsed.classes = [];
                    if (!parsed.students) parsed.students = [];
                    if (!parsed.assignments) parsed.assignments = [];
                    if (!parsed.tasks) parsed.tasks = [];
                    if (!parsed.meetings) parsed.meetings = [];
                    if (!parsed.customSections) parsed.customSections = [];
                    if (!parsed.navSections) parsed.navSections = JSON.parse(JSON.stringify(window.InitialData.navSections || []));
                    if (!parsed.lessonPeriods) parsed.lessonPeriods = JSON.parse(JSON.stringify(window.InitialData.lessonPeriods || []));

                        if (parsed.navSections && Array.isArray(parsed.navSections)) {
                            parsed.navSections.forEach(s => { s.badge = ''; });
                            const hasMaarif = parsed.navSections.some(s => s.id === 'maarif-works');
                            if (!hasMaarif) {
                                const mSec = { id: 'maarif-works', title: '🎨 Maarif Çalışmaları', icon: 'palette', color: 'emerald', visible: true, isSystem: true, badge: '' };
                                const dpIdx = parsed.navSections.findIndex(s => s.id === 'daily-plan');
                                if (dpIdx !== -1) {
                                    parsed.navSections.splice(dpIdx + 1, 0, mSec);
                                } else {
                                    parsed.navSections.push(mSec);
                                }
                                this.saveData(parsed, uid);
                            }
                        }
                                                if (parsed.navSections && Array.isArray(parsed.navSections)) {
                            parsed.navSections.forEach(s => { s.badge = ''; });
                            const hasStudentList = parsed.navSections.some(s => s.id === 'student-list');
                            if (!hasStudentList) {
                                const slSec = { id: 'student-list', title: '👨‍🎓 Öğrenci Listesi', icon: 'graduation-cap', color: 'blue', visible: true, isSystem: true, badge: '' };
                                const stIdx = parsed.navSections.findIndex(s => s.id === 'school-tasks');
                                if (stIdx !== -1) {
                                    parsed.navSections.splice(stIdx + 1, 0, slSec);
                                } else {
                                    parsed.navSections.push(slSec);
                                }
                                this.saveData(parsed, uid);
                            }
                        }

                        if (!parsed.maarifWorks) {
                            parsed.maarifWorks = JSON.parse(JSON.stringify(window.InitialData.maarifWorks || []));
                        }


                        if (parsed.weeklySchedule) {
                            Object.keys(parsed.weeklySchedule).forEach(day => {
                                if (Array.isArray(parsed.weeklySchedule[day])) {
                                    parsed.weeklySchedule[day].forEach(lesson => {
                                        if (lesson.room && lesson.room.includes('Kendi Sınıfı') && lesson.classId && lesson.classId !== 'Boş') {
                                            lesson.room = lesson.classId + ' Sınıfı';
                                        }
                                    });
                                }
                            });
                        }


                        if (parsed.navSections && Array.isArray(parsed.navSections)) {
                            parsed.navSections.forEach(s => { s.badge = ''; });
                            const hasAccount = parsed.navSections.some(s => s.id === 'account');
                            if (!hasAccount) {
                                const accSec = { id: 'account', title: '👤 Hesap Bilgilerim', icon: 'user-check', color: 'red', visible: true, isSystem: true, badge: '' };
                                const setIdx = parsed.navSections.findIndex(s => s.id === 'settings');
                                if (setIdx !== -1) {
                                    parsed.navSections.splice(setIdx, 0, accSec);
                                } else {
                                    parsed.navSections.push(accSec);
                                }
                                this.saveData(parsed, uid);
                            }
                        }

                }

                
                        if (parsed.navSections && Array.isArray(parsed.navSections)) {
                            parsed.navSections.forEach(s => { s.badge = ''; });
                            parsed.navSections.forEach(sec => {
                                if (sec.id === 'account') {
                                    sec.title = '👤 Hesap Bilgilerim';
                                }
                            });
                        }

                return parsed;
            }
        } catch (e) {
            console.error("Veri yükleme hatası:", e);
        }

        // Eğer bu kullanıcı için kayıt bulunamazsa:
        if (uid === 'admin') {
            const initial = window.InitialData ? JSON.parse(JSON.stringify(window.InitialData)) : {};
            initial._murat_kundakci_duty_v5 = true;
            this.saveData(initial, uid);
            return initial;
        } else {
            // Öğretmen için SIFIR / İZOLE BAŞLANGIÇ VERİSİ
            const userObj = (window.AuthUsers || []).find(u => u.id === uid) || { name: 'Fen Bilimleri Öğretmeni' };
            const teacherInitial = {
                teacher: {
                    id: uid,
                    name: userObj.name,
                    title: 'Fen Bilimleri Öğretmeni',
                    school: '',
                    academicYear: '2026-2027',
                    dutyDay: 'Belirlenmedi',
                    dutyArea: 'Kat-1',
                    dutyLocations: ["Bahçe", "Zemin", "Kat-1", "Kat-2", "Kat-3"],
                    dutyRotation: ["Kat-1", "Kat-2", "Kat-3", "Bahçe", "Zemin"],
                    totalLessons: 0,
                    fenLessons: 0,
                    rehberLessons: 0,
                    freeLessons: 35
                },
                classes: [],       // Sıfır sınıf (tamamen izole)
                students: [],      // Sıfır öğrenci (tamamen izole)
                weeklySchedule: window.createEmptyWeeklySchedule ? window.createEmptyWeeklySchedule() : {}, // Boş program (izole)
                assignments: [],   // Sıfır ödev
                tasks: [],         // Sıfır görev
                meetings: [],      // Sıfır toplantı
                projectCalendar: [],
                customSections: [],
                navSections: JSON.parse(JSON.stringify(window.InitialData ? window.InitialData.navSections : [])),
                lessonPeriods: JSON.parse(JSON.stringify(window.InitialData ? window.InitialData.lessonPeriods : []))
            };
            this.saveData(teacherInitial, uid);
            return teacherInitial;
        }
    },

    // Verileri kaydet
    saveData(data, userId = null) {
        const uid = userId || localStorage.getItem('rotali_active_user_id') || 'admin';
        const storageKey = this.getUserStorageKey(uid);
        try {
            localStorage.setItem(storageKey, JSON.stringify(data));
            localStorage.setItem(`rotali_last_backup_${uid}`, new Date().toISOString());
        } catch (e) {
            console.error("Veri kaydetme hatası:", e);
        }
    },

    // Ayarları yükle
    loadSettings() {
        try {
            const raw = localStorage.getItem(this.SETTINGS_KEY);
            return raw ? JSON.parse(raw) : { theme: 'dark', notifications: true };
        } catch (e) {
            return { theme: 'dark', notifications: true };
        }
    },

    // Ayarları kaydet
    saveSettings(settings) {
        try {
            localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
        } catch (e) {
            console.error("Ayar kaydetme hatası:", e);
        }
    },

    // Kullanıcıya ait tüm verileri sıfırla
    resetUserData(userId = null) {
        const uid = userId || localStorage.getItem('rotali_active_user_id') || 'admin';
        const storageKey = this.getUserStorageKey(uid);
        localStorage.removeItem(storageKey);
        return this.loadData(uid);
    }
};
