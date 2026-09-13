// Rotalı Fenci - Kişisel Dijital Öğretmen Paneli Reaktif Yönetimi (Okul İşlerim)

document.addEventListener('alpine:init', () => {
    Alpine.data('rotaliApp', () => ({
        // Aktif Sekme
        currentTab: 'dashboard',
        selectedClassId: '7A',
        searchQuery: '',
        projectCategoryFilter: 'Hepsi',
        
        // Veri Modelleri
        data: window.StorageManager.loadData(),
        settings: window.StorageManager.loadSettings(),
        templates: window.TemplatesData || {},
        assistants: window.AIEngine.assistants || [],

        // Modal Durumları
        isCommandOpen: false,
        commandQuery: '',
        isAIOpen: false,
        selectedAssistant: 'observation-enhancer',
        aiParams: { topic: '', customPrompt: '' },
        aiResult: '',
        isAILoading: false,

        // Sertifika Modalı
        isCertModalOpen: false,
        selectedCertType: 'cert-stem',
        certStudentName: 'Ali Can',
        certStudentClass: '7/A',
        certDate: new Date().toISOString().slice(0, 10),

        // Yeni Gözlem Modalı
        isObsModalOpen: false,
        newObs: {
            studentId: '',
            category: 'Etkinlik ve Laboratuvar Becerisi',
            rawNote: '',
            status: 'Olumlu Gelişim',
            tags: ['🧪 Deney becerisi']
        },

        // Yeni Görev Modalı
        isTaskModalOpen: false,
        newTask: {
            title: '',
            category: 'Öğrenci Takibi',
            priority: 'urgent',
            date: new Date().toISOString().slice(0, 10)
        },

        // Ödev Takip Sistemi Durumu
        selectedHomeworkDate: '2026-09-11',
        currentHomeworkTitle: 'Hücre ve Organeller Etkinlik Defteri (s. 18-22)',
        homeworkViewMode: 'daily',
        isHwHistoryModalOpen: false,
        selectedHwStudent: null,
        scoringLegend: [
            { score: '0', label: 'Yok / Yapmadı', pts: '0 Puan', color: 'red', desc: 'Ödev getirilmedi veya hiç yapılmadı (0p)' },
            { score: '1', label: 'Yarım / Eksik', pts: '1 Puan', color: 'amber', desc: 'Kısmen / eksik yapıldı (+/-) (1p)' },
            { score: '2', label: 'Tam / Artı', pts: '2 Puan', color: 'emerald', desc: 'Eksiksiz ve doğru tamamlandı (+) (2p)' },
            { score: '4', label: 'Yıldız', pts: '4 Puan', color: 'yellow', desc: 'Üstün başarı ve özenli çalışma (★) (4p)' },
            { score: 'G', label: 'Gelmedi', pts: 'Devamsız', color: 'slate', desc: 'Öğrenci o gün okula gelmedi' }
        ],

        // Yeni Proje Takvimi Kaydı Modalı
        isProjCalModalOpen: false,
        newProjCal: {
            title: '',
            category: 'TÜBİTAK',
            targetProject: '',
            startDate: new Date().toISOString().slice(0, 10),
            deadline: '',
            status: 'Planlandı',
            priority: 'Yüksek',
            notes: ''
        },

        // Ders Programı Yönetimi Durumu
        selectedScheduleDay: 'Pazartesi',
        scheduleViewMode: 'daily', // Günlük detay ön planda
        isEditLessonModalOpen: false,
        isScheduleImageUploadModalOpen: false,
        uploadedScheduleImage: null,
        isParsingImage: false,
        parsedSchedulePreview: null,
        imageUploadStatusText: '',
        editingLesson: {
            day: 'Pazartesi',
            periodNo: 1,
            periodLabel: '1. Ders (08:30 - 09:10)',
            classId: '5/A',
            subject: 'Fen Bilimleri',
            topic: '',
            outcomeCode: '',
            outcomeDesc: '',
            room: 'Fen Laboratuvarı'
        },

        // Aktif Öğretmen & Hesaplar
        teacherAccounts: window.StorageManager.getAccounts(),
        activeTeacherId: window.StorageManager.getActiveTeacherId(),
        loginUsername: '',
        loginPassword: '',
        loginError: '',
        isPasswordVisible: false,
        isAuthenticated: localStorage.getItem('rotali_auth_state') === 'authenticated',

        // 📅 Türkiye Yüzyılı Maarif Modeli Yıllık Plan Modalı
        isAnnualPlanModalOpen: false,
        selectedAnnualPlanGrade: 5,
        selectedAnnualPlanWeekIndex: 0,
        annualPlanViewMode: 'interactive', // 'interactive' (Görseldeki gibi), 'cards' veya 'table'
        annualPlanSearchQuery: '',
        annualPlanAccordion: {
            unit: true,
            topic: true,
            outcomes: true,
            process: true,
            extra: true,
            notes: true
        },
        annualPlanNotes: {},
        activeWeekNote: '',
        isAddingWeekNote: false,
        annualPlanData: window.AnnualPlanData || {},
        curriculumData: window.CurriculumData || {},

        // Bildirim Toast
        toast: {
            show: false,
            message: ''
        },

        // Başlangıç
        init() {
            if (this.settings.theme === 'light') {
                document.body.classList.add('light');
            } else {
                document.body.classList.remove('light');
            }

            // Seçili sınıfı ayarla
            if (this.data && this.data.classes && this.data.classes.length > 0) {
                const found = this.data.classes.some(c => c.id === this.selectedClassId);
                if (!found) {
                    this.selectedClassId = this.data.classes[0].id;
                }
            }

            this.loadCurrentWeekNote();

            // Otomatik Maarif Modeli Kazanım Senkronizasyonu (TYMM 2026-2027)
            if (this.activeTeacherId === 'teacher1' && this.data && this.data.weeklySchedule && !this.data._maarif_outcomes_v4) {
                const initialSched = window.InitialData ? window.InitialData.weeklySchedule : null;
                if (initialSched) {
                    this.data.weeklySchedule = JSON.parse(JSON.stringify(initialSched));
                    this.data._maarif_outcomes_v4 = true;
                    window.StorageManager.saveData(this.data, 'teacher1');
                }
            }

            // Klavye Kısayolları
            window.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    this.isCommandOpen = !this.isCommandOpen;
                }
                if (e.key === 'Escape') {
                    this.isCommandOpen = false;
                    this.isAIOpen = false;
                    this.isCertModalOpen = false;
                    this.isObsModalOpen = false;
                    this.isTaskModalOpen = false;
                    this.isProjCalModalOpen = false;
                    this.isAnnualPlanModalOpen = false;
                }
                if ((this.currentTab === 'annual-plan' || this.isAnnualPlanModalOpen) && this.annualPlanViewMode === 'interactive' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                    if (e.key === 'ArrowLeft') {
                        this.prevAnnualPlanWeek();
                    } else if (e.key === 'ArrowRight') {
                        this.nextAnnualPlanWeek();
                    }
                }
            });

            // Veri Değişikliklerini Kaydet
            this.$watch('data', () => {
                window.StorageManager.saveData(this.data, this.activeTeacherId);
            }, { deep: true });

            this.$nextTick(() => {
                if (window.lucide) window.lucide.createIcons();
            });
        },

        // Bildirim Göster
        showToast(message) {
            this.toast.message = message;
            this.toast.show = true;
            setTimeout(() => {
                this.toast.show = false;
            }, 3000);
        },

        // Aktif Öğretmen Bilgisi
        getCurrentTeacher() {
            return this.teacherAccounts[this.activeTeacherId] || this.teacherAccounts['teacher1'] || {
                name: 'Öğretmen',
                title: 'Fen Bilimleri Öğretmeni',
                badge: 'Öğretmen'
            };
        },

        // Giriş Yap (Kullanıcı Adı ve Şifreye Göre Otomatik Öğretmen Tespiti)
        login() {
            const inputUser = (this.loginUsername || '').trim().toLowerCase();
            const inputPass = (this.loginPassword || '').trim();

            if (!inputUser || !inputPass) {
                this.loginError = 'Lütfen kullanıcı adı ve şifrenizi eksiksiz giriniz.';
                return;
            }

            let targetId = null;
            let targetAcc = null;

            // Girilen kullanıcı adına göre öğretmeni tespit et
            for (let key in this.teacherAccounts) {
                if (this.teacherAccounts[key].username && this.teacherAccounts[key].username.toLowerCase() === inputUser) {
                    targetId = key;
                    targetAcc = this.teacherAccounts[key];
                    break;
                }
            }

            if (targetAcc && targetAcc.password === inputPass) {
                this.activeTeacherId = targetId;
                window.StorageManager.setActiveTeacherId(targetId);
                this.data = window.StorageManager.loadData(targetId);
                this.settings = window.StorageManager.loadSettings(targetId);
                if (this.data.classes && this.data.classes.length > 0) {
                    this.selectedClassId = this.data.classes[0].id;
                }
                this.loadCurrentWeekNote();

                this.isAuthenticated = true;
                this.loginError = '';
                this.loginPassword = '';
                this.loginUsername = '';
                localStorage.setItem('rotali_auth_state', 'authenticated');
                this.showToast(`Hoş geldiniz, ${targetAcc.name}! 🚀`);
                this.$nextTick(() => {
                    if (window.lucide) window.lucide.createIcons();
                });
            } else {
                this.loginError = 'Hatalı kullanıcı adı veya şifre! Lütfen bilgilerinizi kontrol edip tekrar deneyiniz.';
            }
        },

        // Çıkış Yap
        logout() {
            if (confirm('Öğretmen oturumunu kapatmak istediğinize emin misiniz?')) {
                this.isAuthenticated = false;
                this.loginUsername = '';
                this.loginPassword = '';
                this.loginError = '';
                localStorage.removeItem('rotali_auth_state');
                this.showToast('Öğretmen oturumu kapatıldı. 🔒');
                this.$nextTick(() => {
                    if (window.lucide) window.lucide.createIcons();
                });
            }
        },

        // Tema Değiştir
        toggleTheme() {
            this.settings.theme = this.settings.theme === 'dark' ? 'light' : 'dark';
            window.StorageManager.saveSettings(this.settings, this.activeTeacherId);
            if (this.settings.theme === 'light') {
                document.body.classList.add('light');
            } else {
                document.body.classList.remove('light');
            }
            this.showToast(`Tema ${this.settings.theme === 'dark' ? 'Koyu' : 'Açık'} moda geçirildi.`);
        },

        // Tab Değiştirme
        setTab(tab) {
            this.currentTab = tab;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.$nextTick(() => {
                if (window.lucide) window.lucide.createIcons();
            });
        },

        // İstatistikler & Filtreler
        get pendingTasksCount() {
            return (this.data.tasks || []).filter(t => !t.done).length;
        },
        get activeProjectsCount() {
            return (this.data.projectCalendar || []).filter(p => p.status !== 'Tamamlandı').length;
        },
        get totalStudentsCount() {
            return (this.data.students || []).length;
        },
        get filteredStudents() {
            let list = this.data.students || [];
            if (this.selectedClassId) {
                list = list.filter(s => s.classId === this.selectedClassId);
            }
            if (this.searchQuery) {
                const q = this.searchQuery.toLowerCase();
                list = list.filter(s => s.name.toLowerCase().includes(q) || (s.notes && s.notes.toLowerCase().includes(q)));
            }
            return list;
        },
        get filteredProjectCalendar() {
            let list = this.data.projectCalendar || [];
            if (this.projectCategoryFilter !== 'Hepsi') {
                list = list.filter(p => p.category === this.projectCategoryFilter);
            }
            return list;
        },

        // Görev Tamamlama
        toggleTask(task) {
            task.done = !task.done;
            this.showToast(task.done ? "Görev tamamlandı! 🎉" : "Görev aktif edildi.");
        },

        // Yeni Görev Ekle
        addTask() {
            if (!this.newTask.title) return;
            this.data.tasks.unshift({
                id: 'task-' + Date.now(),
                title: this.newTask.title,
                category: this.newTask.category,
                priority: this.newTask.priority,
                date: this.newTask.date,
                done: false
            });
            this.newTask.title = '';
            this.isTaskModalOpen = false;
            this.showToast("Yeni görev eklendi!");
        },

        // ================= ÖDEV TAKİP SİSTEMİ METODLARI =================
        getTodayHomeworkSession() {
            if (!this.data.homeworkDays) this.data.homeworkDays = [];
            let session = this.data.homeworkDays.find(h => h.date === this.selectedHomeworkDate && h.classId === this.selectedClassId);
            if (!session) {
                session = {
                    date: this.selectedHomeworkDate,
                    classId: this.selectedClassId,
                    title: this.currentHomeworkTitle || 'Fen Bilimleri Etkinlik & Ödev Değerlendirmesi',
                    grades: {}
                };
                this.data.homeworkDays.push(session);
            }
            return session;
        },

        getStudentHomeworkGrade(studentId) {
            const session = this.getTodayHomeworkSession();
            if (session && session.grades && session.grades[studentId]) {
                return session.grades[studentId];
            }
            return { score: '', note: '' };
        },

        setStudentHomeworkGrade(studentId, score) {
            const session = this.getTodayHomeworkSession();
            if (!session.grades) session.grades = {};
            const existingNote = session.grades[studentId]?.note || '';
            
            // Eğer aynı skora basıldıysa ve silmek isterse
            if (session.grades[studentId]?.score === score) {
                // Seçili kalsın veya güncellensin
            }
            session.grades[studentId] = { score: score, note: existingNote };
            if (this.currentHomeworkTitle && !session.title) {
                session.title = this.currentHomeworkTitle;
            }
            this.data = JSON.parse(JSON.stringify(this.data));

            const labels = {
                '0': '❌ 0 - Yok (0p)',
                '1': '⚠️ 1 - Yarım (1p)',
                '2': '✅ 2 - Tam (+2p)',
                '4': '⭐ 4 - Yıldız (★ +4p)',
                'G': '🚫 G - Gelmedi'
            };
            this.showToast(`Ödev Durumu: ${labels[score] || score} kaydedildi.`);
        },

        setStudentHomeworkNote(studentId, note) {
            const session = this.getTodayHomeworkSession();
            if (!session.grades) session.grades = {};
            const curScore = session.grades[studentId]?.score || '';
            session.grades[studentId] = { score: curScore, note: note };
            this.data = JSON.parse(JSON.stringify(this.data));
        },

        bulkSetClassHomework(score) {
            const session = this.getTodayHomeworkSession();
            if (!session.grades) session.grades = {};
            const students = this.filteredStudents;
            students.forEach(st => {
                const existingNote = session.grades[st.id]?.note || '';
                session.grades[st.id] = { score: score, note: existingNote };
            });
            this.data = JSON.parse(JSON.stringify(this.data));
            const labels = { '0': '0 (Yok)', '1': '1 (Yarım)', '2': '2 (Tam +)', '4': '4 (Yıldız ★)', 'G': 'G (Gelmedi)' };
            this.showToast(`Tüm ${this.selectedClassId} sınıfına "${labels[score]}" ödev durumu işlendi! ⚡`);
        },

        clearHomeworkDate() {
            if (confirm(`${this.selectedClassId} sınıfının ${this.selectedHomeworkDate} tarihli ödev kayıtlarını temizlemek istediğinize emin misiniz?`)) {
                const session = this.getTodayHomeworkSession();
                session.grades = {};
                this.data = JSON.parse(JSON.stringify(this.data));
                this.showToast("Seçili tarihin ödev kayıtları sıfırlandı.");
            }
        },

        changeHomeworkDate(delta) {
            const current = new Date(this.selectedHomeworkDate);
            current.setDate(current.getDate() + delta);
            this.selectedHomeworkDate = current.toISOString().slice(0, 10);
            const session = this.data.homeworkDays?.find(h => h.date === this.selectedHomeworkDate && h.classId === this.selectedClassId);
            this.currentHomeworkTitle = session?.title || '';
        },

        setTodayHomeworkDate() {
            this.selectedHomeworkDate = new Date().toISOString().slice(0, 10);
            const session = this.data.homeworkDays?.find(h => h.date === this.selectedHomeworkDate && h.classId === this.selectedClassId);
            this.currentHomeworkTitle = session?.title || '';
            this.showToast("Bugünün tarihine geçildi: " + this.getFormattedHomeworkDate());
        },

        getFormattedHomeworkDate() {
            if (!this.selectedHomeworkDate) return '';
            const parts = this.selectedHomeworkDate.split('-');
            if (parts.length < 3) return this.selectedHomeworkDate;
            const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
            const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
            const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
            return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} ${days[d.getDay()]}`;
        },

        getStudentHomeworkStats(studentId) {
            const days = this.data.homeworkDays || [];
            let totalPoints = 0;
            let stars = 0;
            let full = 0;
            let half = 0;
            let zero = 0;
            let absent = 0;
            let totalDays = 0;

            days.forEach(day => {
                const gradeObj = day.grades ? day.grades[studentId] : null;
                if (gradeObj && gradeObj.score !== undefined && gradeObj.score !== '') {
                    totalDays++;
                    const s = String(gradeObj.score).toUpperCase();
                    if (s === '4') { stars++; totalPoints += 4; }
                    else if (s === '2') { full++; totalPoints += 2; }
                    else if (s === '1') { half++; totalPoints += 1; }
                    else if (s === '0') { zero++; }
                    else if (s === 'G') { absent++; }
                }
            });

            const validSessions = totalDays - absent;
            const maxPossible = validSessions * 4;
            const successRate = maxPossible > 0 ? Math.round((totalPoints / maxPossible) * 100) : 0;

            return { totalPoints, stars, full, half, zero, absent, totalDays, successRate };
        },

        getClassDailyStats() {
            const session = this.getTodayHomeworkSession();
            const students = this.filteredStudents;
            let stars = 0, full = 0, half = 0, zero = 0, absent = 0, gradedCount = 0, totalPts = 0;

            students.forEach(st => {
                const g = session.grades ? session.grades[st.id] : null;
                if (g && g.score !== undefined && g.score !== '') {
                    gradedCount++;
                    const s = String(g.score).toUpperCase();
                    if (s === '4') { stars++; totalPts += 4; }
                    else if (s === '2') { full++; totalPts += 2; }
                    else if (s === '1') { half++; totalPts += 1; }
                    else if (s === '0') { zero++; }
                    else if (s === 'G') { absent++; }
                }
            });

            const evaluatedStudents = gradedCount - absent;
            const maxPoints = evaluatedStudents * 4;
            const classPercent = maxPoints > 0 ? Math.round((totalPts / maxPoints) * 100) : 0;

            return {
                stars, full, half, zero, absent, gradedCount, totalStudents: students.length, classPercent, totalPts
            };
        },

        openStudentHomeworkHistory(student) {
            this.selectedHwStudent = student;
            this.isHwHistoryModalOpen = true;
        },

        getStudentHistoryLogs(studentId) {
            if (!studentId || !this.data.homeworkDays) return [];
            const list = [];
            this.data.homeworkDays.forEach(day => {
                if (day.grades && day.grades[studentId] && day.grades[studentId].score !== '') {
                    list.push({
                        date: day.date,
                        title: day.title || 'Fen Ödevi',
                        classId: day.classId,
                        score: day.grades[studentId].score,
                        note: day.grades[studentId].note || ''
                    });
                }
            });
            return list.sort((a, b) => new Date(b.date) - new Date(a.date));
        },

        printClassHomeworkReport() {
            const cls = this.data.classes.find(c => c.id === this.selectedClassId) || { name: this.selectedClassId };
            const stats = this.getClassDailyStats();
            const students = this.filteredStudents;
            const dateFormatted = this.getFormattedHomeworkDate();
            const session = this.getTodayHomeworkSession();
            const title = session.title || 'Fen Bilimleri Ödev Değerlendirmesi';

            let rows = students.map((st, i) => {
                const g = this.getStudentHomeworkGrade(st.id);
                const scoreLabels = { '4': '⭐ Yıldız (4p)', '2': '✅ Tam (2p)', '1': '⚠️ Yarım (1p)', '0': '❌ Yok (0p)', 'G': '🚫 Gelmedi' };
                const stStats = this.getStudentHomeworkStats(st.id);
                return `
                    <tr>
                        <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">${i+1}</td>
                        <td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: bold;">${st.no} - ${st.name}</td>
                        <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: 800;">${scoreLabels[g.score] || '-'}</td>
                        <td style="padding: 8px; border: 1px solid #cbd5e1; font-size: 11px;">${g.note || '-'}</td>
                        <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">${stStats.totalPoints} p (${stStats.stars}★)</td>
                    </tr>
                `;
            }).join('');

            const printHtml = `
                <div style="font-family: Arial, sans-serif; color: #0f172a; padding: 20px;">
                    <div style="text-align: center; border-bottom: 3px solid #dc2626; padding-bottom: 12px; margin-bottom: 15px;">
                        <h2 style="margin: 0; color: #dc2626; font-size: 22px; font-weight: 900;">ROTALI FENCİ — GÜNLÜK ÖDEV TAKİP ÇİZELGESİ</h2>
                        <p style="margin: 5px 0 0 0; font-size: 14px; font-weight: bold; color: #334155;">${cls.name} Sınıfı | ${dateFormatted}</p>
                        <p style="margin: 3px 0 0 0; font-size: 13px; color: #0284c7; font-weight: 600;">Ödev Konusu: ${title}</p>
                    </div>
                    <div style="display: flex; justify-content: space-around; background: #f8fafc; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 15px; font-size: 12px; font-weight: bold;">
                        <span style="color: #b45309;">⭐ Yıldız (4p): ${stats.stars}</span>
                        <span style="color: #15803d;">✅ Tam (2p): ${stats.full}</span>
                        <span style="color: #d97706;">⚠️ Yarım (1p): ${stats.half}</span>
                        <span style="color: #b91c1c;">❌ Yok (0p): ${stats.zero}</span>
                        <span style="color: #64748b;">🚫 Gelmedi (G): ${stats.absent}</span>
                        <span style="color: #1e3a8a;">📊 Sınıf Başarısı: %${stats.classPercent}</span>
                    </div>
                    <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                        <thead>
                            <tr style="background: #e2e8f0; color: #0f172a; font-weight: 900;">
                                <th style="padding: 8px; border: 1px solid #cbd5e1; width: 40px;">Sıra</th>
                                <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: left;">Öğrenci No & Adı Soyadı</th>
                                <th style="padding: 8px; border: 1px solid #cbd5e1; width: 140px;">Günün Ödev Notu</th>
                                <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: left;">Öğretmen Notu / Açıklama</th>
                                <th style="padding: 8px; border: 1px solid #cbd5e1; width: 130px;">Dönem Toplam Puan</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>
                    <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #cbd5e1; display: flex; justify-content: space-between; font-size: 11px; font-weight: bold; color: #64748b;">
                        <div>Puanlama Sistemi: 0 (Yok/0p) • 1 (Yarım/1p) • 2 (Tam/2p) • 4 (Yıldız/4p) • G (Gelmedi)</div>
                        <div>Fen Bilimleri Öğretmeni / Rotalı Fenci</div>
                    </div>
                </div>
            `;
            window.Exporter.printContent(`Ödev Çizelgesi - ${cls.name} - ${this.selectedHomeworkDate}`, printHtml);
        },

        // ================= DERS PROGRAMI YÖNETİMİ METODLARI =================
        getCurrentDayName() {
            const dayIndex = new Date().getDay();
            const daysMap = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
            const today = daysMap[dayIndex];
            if (['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'].includes(today)) {
                return today;
            }
            return 'Pazartesi';
        },

        getDailySchedule(dayName = null) {
            const targetDay = dayName || this.selectedScheduleDay || this.getCurrentDayName();
            if (!this.data.weeklySchedule) {
                this.data.weeklySchedule = JSON.parse(JSON.stringify(window.InitialData.weeklySchedule || {}));
            }
            return this.data.weeklySchedule[targetDay] || [];
        },

        getScheduleCell(dayName, periodNo) {
            const list = this.getDailySchedule(dayName);
            return list.find(l => l.periodNo === periodNo) || null;
        },

        openEditLessonModal(dayName, periodNo) {
            const list = this.getDailySchedule(dayName);
            const existing = list.find(l => l.periodNo === periodNo);
            const periodInfo = (this.data.lessonPeriods || []).find(p => p.periodNo === periodNo) || { label: periodNo + '. Ders', time: '' };
            
            this.editingLesson = {
                day: dayName,
                periodNo: periodNo,
                periodLabel: periodInfo.label + ' (' + periodInfo.time + ')',
                classId: existing?.classId || '5/A',
                subject: existing?.subject || 'Fen Bilimleri',
                topic: existing?.topic || '',
                outcomeCode: existing?.outcomeCode || '',
                outcomeDesc: existing?.outcomeDesc || '',
                room: existing?.room || 'Fen Laboratuvarı'
            };
            this.isEditLessonModalOpen = true;
        },

        saveEditingLesson() {
            if (!this.data.weeklySchedule) this.data.weeklySchedule = {};
            if (!this.data.weeklySchedule[this.editingLesson.day]) {
                this.data.weeklySchedule[this.editingLesson.day] = [];
            }
            
            const list = this.data.weeklySchedule[this.editingLesson.day];
            const idx = list.findIndex(l => l.periodNo === this.editingLesson.periodNo);
            
            const newEntry = {
                periodNo: this.editingLesson.periodNo,
                classId: this.editingLesson.classId,
                subject: this.editingLesson.subject,
                topic: this.editingLesson.topic,
                outcomeCode: this.editingLesson.outcomeCode,
                outcomeDesc: this.editingLesson.outcomeDesc,
                room: this.editingLesson.room
            };

            if (idx >= 0) {
                list[idx] = newEntry;
            } else {
                list.push(newEntry);
                list.sort((a, b) => a.periodNo - b.periodNo);
            }

            this.data = JSON.parse(JSON.stringify(this.data));
            this.isEditLessonModalOpen = false;
            this.showToast(`${this.editingLesson.day} ${this.editingLesson.periodNo}. Ders bilgisi güncellendi! 📅`);
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },

        clearLessonCell(dayName, periodNo) {
            if (confirm(`${dayName} günü ${periodNo}. ders kaydını silmek istediğinize emin misiniz?`)) {
                if (this.data.weeklySchedule && this.data.weeklySchedule[dayName]) {
                    const idx = this.data.weeklySchedule[dayName].findIndex(l => l.periodNo === periodNo);
                    if (idx >= 0) {
                        this.data.weeklySchedule[dayName][idx] = {
                            periodNo: periodNo,
                            classId: 'Boş',
                            subject: 'Boş Ders / Hazırlık',
                            topic: '',
                            outcomeCode: '-',
                            outcomeDesc: 'Planlanmış ders bulunmamaktadır.',
                            room: 'Öğretmenler Odası'
                        };
                        this.data = JSON.parse(JSON.stringify(this.data));
                        this.showToast("Ders saati boş olarak ayarlandı.");
                    }
                }
            }
        },

        // ================= DERS PROGRAMI GÖRSELİ YÜKLEME & OCR AYIKLAMA =================
        openScheduleImageModal() {
            this.uploadedScheduleImage = null;
            this.parsedSchedulePreview = null;
            this.isParsingImage = false;
            this.imageUploadStatusText = '';
            this.scheduleOcrEngine = this.settings.geminiApiKey ? 'gemini' : 'tesseract';
            this.isScheduleImageUploadModalOpen = true;
        },

        handleScheduleImageUpload(event) {
            const file = event.target.files ? event.target.files[0] : null;
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                this.uploadedScheduleImage = e.target.result;
                this.processScheduleImage();
            };
            reader.readAsDataURL(file);
        },

        async processScheduleImage() {
            if (!this.uploadedScheduleImage) return;

            this.isParsingImage = true;
            this.imageUploadStatusText = 'Görsel taranıyor, satırlar ve sınıflar çözümleniyor... ⏳';

            const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
            const standardOutcomes = {
                '5/A': { subject: 'Fen Bilimleri', topic: 'Güneş, Dünya ve Ay / Güneşin Yapısı', code: 'FB.5.1.1.1', desc: 'Güneş\'in yapısı, katmanları ve kendi ekseni etrafındaki dönme hareketini gözlem verileriyle modeller ve açıklar.', room: '5/A Sınıfı' },
                '5/D': { subject: 'Fen Bilimleri', topic: 'Güneş, Dünya ve Ay / Ay\'ın Evreleri', code: 'FB.5.1.1.1', desc: 'Güneş\'in yapısı ve Ay\'ın evrelerinin oluşum sırasını Dünya etrafındaki dolanma hareketiyle modeller.', room: '5/D Sınıfı' },
                '6/G': { subject: 'Fen Bilimleri', topic: 'Güneş Sistemi, Tutulmalar ve Denetleyici Sistemler', code: 'FB.6.1.1.1', desc: 'Güneş sistemi gezegenlerini, Güneş ve Ay tutulmalarını modeller; denetleyici ve düzenleyici sistemleri açıklar.', room: '6/G Sınıfı' },
                '7/A': { subject: 'Fen Bilimleri', topic: 'Hücre, Organeller ve Mitoz Bölünme', code: 'FB.7.2.1.1', desc: 'Bitki ve hayvan hücrelerini organelleri bakımından karşılaştırır; hücre-doku-organ-sistem ilişkisini modeller.', room: 'Fen Laboratuvarı' },
                '7/B': { subject: 'Fen Bilimleri', topic: 'Hücre, Organeller ve Mayoz Bölünme', code: 'FB.7.2.1.1', desc: 'Bitki ve hayvan hücrelerini karşılaştırır; mitoz ve mayoz bölünmenin canlılar için önemini açıklar.', room: 'Fen Laboratuvarı' },
                '5/D Rehberlik': { subject: 'Rehberlik ve Yönlendirme', topic: 'Sınıf Rehberliği ve Uyum', code: 'REHB.5.1', desc: '5/D Şube Rehberliği: Okula uyum, akran iletişimi, zaman yönetimi ve verimli çalışma oturumu.', room: '5/D Sınıfı' },
                '8/A': { subject: 'Fen Bilimleri (LGS)', topic: 'Mevsimlerin Oluşumu ve DNA/Genetik Kod', code: 'F.8.1.1.1', desc: 'Mevsimlerin oluşumuna yönelik dönme ekseni eğikliği ve Güneş etrafında dolanma hareketinin etkilerini modeller üzerinden tahmin eder ve açıklar.', room: '8/A Sınıfı' },
                '8/B': { subject: 'Fen Bilimleri (LGS)', topic: 'İklim, Hava Hareketleri ve DNA Eşlenmesi', code: 'F.8.1.2.1', desc: 'İklim ve hava olayları arasındaki temel farkları, klimatoloji ve meteoroloji bilim dallarının çalışma yöntemlerini grafik ve harita verileriyle analiz eder.', room: '8/B Sınıfı' },
                'TÜBİTAK Proje': { subject: 'TÜBİTAK 2204-B & STEM', topic: 'Bilimsel Araştırma Yöntemleri & Deney Tasarımı', code: 'TÜBİTAK-AR-GE', desc: 'Bilimsel araştırma basamaklarını kullanarak hipotez kurar, deney düzeneği tasarlar ve veri analizi gerçekleştirir.', room: 'STEM Atölyesi' },
                'Nöbet Görevi': { subject: 'Kat ve Laboratuvar Nöbeti', topic: 'Öğrenci Güvenliği & Teneffüs Düzeni (Cuma Nöbeti)', code: 'NÖBET', desc: 'Cuma günü okul kat nöbeti, laboratuvar güvenlik kontrolleri ve öğrenci teneffüs güvenliği takibini eksiksiz yerine getirir.', room: '2. Kat Koridor' },
                'Zümre / Plan': { subject: 'Zümre Toplantısı & Planlama', topic: 'Haftalık Maarif Modeli Müfredat Eşgüdümü', code: 'ZÜMRE', desc: 'Zümre öğretmenleri haftalık Maarif Modeli kazanım takibi, deney malzemeleri planlaması ve ortak ölçme-değerlendirme süreçlerini yürütür.', room: 'Öğretmenler Odası' },
                'STEM Kulübü': { subject: 'Robotik & STEM Kulübü', topic: 'Sensör Destekli Fen Deneyleri Tasarımı', code: 'STEM-KULÜP', desc: 'Arduino ve çevre sensörlerini fen deneylerine entegre ederek sıcaklık, nem ve ışık ölçümlü akıllı bilim istasyonu tasarlar.', room: 'Robotik Laboratuvarı' },
                'Boş': { subject: 'Ders Yok', topic: '', code: '-', desc: 'Bu saatte planlanmış dersiniz bulunmamaktadır (Boş Saat / Hazırlık).', room: 'Öğretmenler Odası' }
            };

            let extractedRaw = null;
            const apiKey = (this.settings.geminiApiKey || '').trim();

            // 1. Önce Gemini Vision API Deneyelim
            if (apiKey && apiKey.length > 10) {
                try {
                    this.imageUploadStatusText = '🤖 Gemini Vision AI ile haftalık ders tablosu taranıyor...';
                    extractedRaw = await window.AIEngine.parseScheduleImageWithGemini(this.uploadedScheduleImage, apiKey);
                } catch (apiErr) {
                    console.warn("Gemini Vision başarısız oldu, Tesseract OCR'a geçiliyor:", apiErr);
                    this.imageUploadStatusText = '⚠️ Gemini API yanıt vermedi, yerel OCR motoru çalıştırılıyor...';
                }
            }

            // 2. Gemini Yoksa veya Başarısız Olduysa Tesseract OCR Çalıştır
            if (!extractedRaw && window.AIEngine) {
                try {
                    extractedRaw = await window.AIEngine.parseScheduleImageWithTesseract(
                        this.uploadedScheduleImage,
                        (msg) => { this.imageUploadStatusText = msg; }
                    );
                } catch (ocrErr) {
                    console.warn("Tesseract OCR hatası:", ocrErr);
                    this.imageUploadStatusText = 'ℹ️ Görsel okuma tamamlandı. Aşağıdaki tablodan gerekirse sınıfları düzeltebilirsiniz.';
                }
            }

            // 3. Çözümlenen veya Varsayılan Veriyi Maarif Modeli ile Eşleştir
            const result = {};
            days.forEach(d => {
                result[d] = [];
                const dayList = (extractedRaw && extractedRaw[d] && Array.isArray(extractedRaw[d])) ? extractedRaw[d] : [];
                
                for (let pNo = 1; pNo <= 7; pNo++) {
                    const rawClass = dayList[pNo - 1] || 'Boş';
                    const normalizedClass = window.AIEngine ? window.AIEngine.normalizeClassToken(rawClass) : rawClass;
                    const meta = standardOutcomes[normalizedClass] || standardOutcomes['Boş'];

                    result[d].push({
                        periodNo: pNo,
                        classId: normalizedClass,
                        subject: meta.subject,
                        topic: meta.topic,
                        outcomeCode: meta.code,
                        outcomeDesc: meta.desc,
                        room: meta.room
                    });
                }
            });

            this.parsedSchedulePreview = result;
            this.isParsingImage = false;
            this.imageUploadStatusText = '✅ Görsel başarıyla çözümlendi! Aşağıdaki tablodan kontrol edip onaylayabilirsiniz.';
        },

        applyParsedSchedule() {
            if (!this.parsedSchedulePreview) return;

            const standardOutcomes = {
                '5/A': { subject: 'Fen Bilimleri', topic: 'Gökyüzündeki Komşumuz: Güneş', code: 'FB.5.1.1', desc: 'Güneş’in yapısı ve dönme hareketi ile ilgili bilgi toplayabilme', room: '5/A Sınıfı' },
                '5/D': { subject: 'Fen Bilimleri', topic: 'Gökyüzündeki Komşumuz: Güneş & Ay', code: 'FB.5.1.1', desc: 'Güneş’in yapısı ve dönme hareketi ile ilgili bilgi toplayabilme; Ay’ın evrelerini modelleme', room: '5/D Sınıfı' },
                '6/G': { subject: 'Fen Bilimleri', topic: 'Güneş Sistemi ve Gezegenler', code: 'FB.6.1.1', desc: 'Güneş sistemindeki gezegenleri niteliklerine göre sınıflandırabilme', room: '6/G Sınıfı' },
                '7/A': { subject: 'Fen Bilimleri', topic: 'Uzay Çağı & Uzay Araştırmaları', code: 'FB.7.1.1', desc: 'Uzay araştırmaları için geliştirilen teknolojileri karşılaştırabilme', room: 'Fen Laboratuvarı' },
                '7/B': { subject: 'Fen Bilimleri', topic: 'Uzay Çağı & Gözlem Araçları', code: 'FB.7.1.1', desc: 'Uzay araştırmaları için geliştirilen teknolojileri karşılaştırabilme; gözlem araçlarını modelleme', room: 'Fen Laboratuvarı' },
                '5/D Rehberlik': { subject: 'Rehberlik ve Yönlendirme', topic: 'Sınıf Rehberliği ve Uyum', code: 'REHB.5.1', desc: '5/D Şube Rehberliği: Okula uyum, akran iletişimi, zaman yönetimi ve verimli çalışma oturumu.', room: '5/D Sınıfı' },
                '8/A': { subject: 'Fen Bilimleri (LGS)', topic: 'Mevsimlerin Oluşumu', code: 'F.8.1.1.1', desc: 'Mevsimlerin oluşumuna yönelik tahminlerde bulunur.', room: '8/A Sınıfı' },
                '8/B': { subject: 'Fen Bilimleri (LGS)', topic: 'İklim ve Hava Hareketleri', code: 'F.8.1.2.1', desc: 'İklim ve hava olayları arasındaki farkı açıklar.', room: '8/B Sınıfı' },
                'TÜBİTAK Proje': { subject: 'TÜBİTAK 2204-B & STEM', topic: 'Bilimsel Araştırma Yöntemleri & Deney Tasarımı', code: 'TÜBİTAK-AR-GE', desc: 'Bilimsel araştırma basamaklarını kullanarak hipotez kurar, deney düzeneği tasarlar ve veri analizi gerçekleştirir.', room: 'STEM Atölyesi' },
                'Nöbet Görevi': { subject: 'Kat ve Laboratuvar Nöbeti', topic: 'Öğrenci Güvenliği & Teneffüs Düzeni (Cuma Nöbeti)', code: 'NÖBET', desc: 'Cuma günü okul kat nöbeti, laboratuvar güvenlik kontrolleri ve öğrenci teneffüs güvenliği takibini eksiksiz yerine getirir.', room: '2. Kat Koridor' },
                'Zümre / Plan': { subject: 'Zümre Toplantısı & Planlama', topic: 'Haftalık Maarif Modeli Müfredat Eşgüdümü', code: 'ZÜMRE', desc: 'Zümre öğretmenleri haftalık Maarif Modeli kazanım takibi, deney malzemeleri planlaması ve ortak ölçme-değerlendirme süreçlerini yürütür.', room: 'Öğretmenler Odası' },
                'STEM Kulübü': { subject: 'Robotik & STEM Kulübü', topic: 'Sensör Destekli Fen Deneyleri Tasarımı', code: 'STEM-KULÜP', desc: 'Arduino ve çevre sensörlerini fen deneylerine entegre ederek sıcaklık, nem ve ışık ölçümlü akıllı bilim istasyonu tasarlar.', room: 'Robotik Laboratuvarı' },
                'Boş': { subject: 'Ders Yok', topic: '', code: '-', desc: 'Bu saatte planlanmış dersiniz bulunmamaktadır (Boş Saat / Hazırlık).', room: 'Öğretmenler Odası' }
            };

            const updatedSchedule = {};
            const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];

            days.forEach(d => {
                const list = this.parsedSchedulePreview[d] || [];
                updatedSchedule[d] = list.map(item => {
                    const cId = item.classId || 'Boş';
                    const meta = standardOutcomes[cId] || standardOutcomes['Boş'];
                    return {
                        periodNo: item.periodNo,
                        classId: cId,
                        subject: meta.subject,
                        topic: meta.topic,
                        outcomeCode: meta.code,
                        outcomeDesc: meta.desc,
                        room: meta.room
                    };
                });
            });

            this.data.weeklySchedule = updatedSchedule;
            this.data._maarif_outcomes_v4 = true;
            this.data = JSON.parse(JSON.stringify(this.data));
            this.isScheduleImageUploadModalOpen = false;
            this.showToast("Görseldeki ders programı Maarif Modeli kazanımlarıyla başarıyla panele aktarıldı! 🚀");
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },

        setDutyDay(day) {
            if (!this.data.teacher) this.data.teacher = {};
            this.data.teacher.dutyDay = day;
            window.StorageManager.saveData(this.data, this.activeTeacherId);
            this.showToast(`Nöbet günü ${day} olarak belirlendi! 🛡️`);
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },

        saveDutyDay() {
            window.StorageManager.saveData(this.data, this.activeTeacherId);
            this.showToast(`Nöbet günü ${this.data.teacher?.dutyDay || 'Belirlenmedi'} olarak güncellendi! 🛡️`);
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },

        resetScheduleToEmpty() {
            if (confirm("Tüm haftalık ders programını boşaltmak istediğinize emin misiniz? (Bütün saatler 'Ders Yok' olarak ayarlanacaktır)")) {
                const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
                const emptySchedule = {};
                days.forEach(d => {
                    emptySchedule[d] = [1,2,3,4,5,6,7].map(no => ({
                        periodNo: no,
                        classId: 'Boş',
                        subject: 'Ders Yok',
                        topic: '',
                        outcomeCode: '-',
                        outcomeDesc: 'Bu saatte dersiniz bulunmamaktadır.',
                        room: 'Öğretmenler Odası'
                    }));
                });
                this.data.weeklySchedule = emptySchedule;
                this.data = JSON.parse(JSON.stringify(this.data));
                this.showToast("Tüm ders saatleri 'Ders Yok' olarak temizlendi.");
                this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
            }
        },

        quickAssignClass(day, periodNo, classId) {
            const standardOutcomes = {
                '5/A': { subject: 'Fen Bilimleri', topic: 'Gökyüzündeki Komşumuz: Güneş', code: 'FB.5.1.1', desc: 'Güneş’in yapısı ve dönme hareketi ile ilgili bilgi toplayabilme', room: '5/A Sınıfı' },
                '5/D': { subject: 'Fen Bilimleri', topic: 'Gökyüzündeki Komşumuz: Güneş & Ay', code: 'FB.5.1.1', desc: 'Güneş’in yapısı ve dönme hareketi ile ilgili bilgi toplayabilme; Ay’ın evrelerini modelleme', room: '5/D Sınıfı' },
                '6/G': { subject: 'Fen Bilimleri', topic: 'Güneş Sistemi ve Gezegenler', code: 'FB.6.1.1', desc: 'Güneş sistemindeki gezegenleri niteliklerine göre sınıflandırabilme', room: '6/G Sınıfı' },
                '7/A': { subject: 'Fen Bilimleri', topic: 'Uzay Çağı & Uzay Araştırmaları', code: 'FB.7.1.1', desc: 'Uzay araştırmaları için geliştirilen teknolojileri karşılaştırabilme', room: 'Fen Laboratuvarı' },
                '7/B': { subject: 'Fen Bilimleri', topic: 'Uzay Çağı & Gözlem Araçları', code: 'FB.7.1.1', desc: 'Uzay araştırmaları için geliştirilen teknolojileri karşılaştırabilme; gözlem araçlarını modelleme', room: 'Fen Laboratuvarı' },
                '5/D Rehberlik': { subject: 'Rehberlik ve Yönlendirme', topic: 'Sınıf Rehberliği ve Uyum', code: 'REHB.5.1', desc: '5/D Şube Rehberliği: Okula uyum, akran iletişimi, zaman yönetimi ve verimli çalışma oturumu.', room: '5/D Sınıfı' },
                '8/A': { subject: 'Fen Bilimleri (LGS)', topic: 'Mevsimlerin Oluşumu', code: 'F.8.1.1.1', desc: 'Mevsimlerin oluşumuna yönelik tahminlerde bulunur.', room: '8/A Sınıfı' },
                '8/B': { subject: 'Fen Bilimleri (LGS)', topic: 'İklim ve Hava Hareketleri', code: 'F.8.1.2.1', desc: 'İklim ve hava olayları arasındaki farkı açıklar.', room: '8/B Sınıfı' },
                'TÜBİTAK Proje': { subject: 'TÜBİTAK 2204-B & STEM', topic: 'Bilimsel Araştırma Yöntemleri & Deney Tasarımı', code: 'TÜBİTAK-AR-GE', desc: 'Bilimsel araştırma basamaklarını kullanarak hipotez kurar, deney düzeneği tasarlar ve veri analizi gerçekleştirir.', room: 'STEM Atölyesi' },
                'Nöbet Görevi': { subject: 'Kat ve Laboratuvar Nöbeti', topic: 'Öğrenci Güvenliği & Teneffüs Düzeni (Cuma Nöbeti)', code: 'NÖBET', desc: 'Cuma günü okul kat nöbeti, laboratuvar güvenlik kontrolleri ve öğrenci teneffüs güvenliği takibini eksiksiz yerine getirir.', room: '2. Kat Koridor' },
                'Zümre / Plan': { subject: 'Zümre Toplantısı & Planlama', topic: 'Haftalık Maarif Modeli Müfredat Eşgüdümü', code: 'ZÜMRE', desc: 'Zümre öğretmenleri haftalık Maarif Modeli kazanım takibi, deney malzemeleri planlaması ve ortak ölçme-değerlendirme süreçlerini yürütür.', room: 'Öğretmenler Odası' },
                'STEM Kulübü': { subject: 'Robotik & STEM Kulübü', topic: 'Sensör Destekli Fen Deneyleri Tasarımı', code: 'STEM-KULÜP', desc: 'Arduino ve çevre sensörlerini fen deneylerine entegre ederek sıcaklık, nem ve ışık ölçümlü akıllı bilim istasyonu tasarlar.', room: 'Robotik Laboratuvarı' },
                'Boş': { subject: 'Ders Yok', topic: '', code: '-', desc: 'Bu saatte planlanmış dersiniz bulunmamaktadır (Boş Saat / Hazırlık).', room: 'Öğretmenler Odası' }
            };

            const meta = standardOutcomes[classId] || {
                subject: 'Fen Bilimleri',
                topic: '',
                code: '',
                desc: '',
                room: 'Fen Laboratuvarı'
            };

            if (!this.data.weeklySchedule) this.data.weeklySchedule = {};
            if (!this.data.weeklySchedule[day]) this.data.weeklySchedule[day] = [];

            const list = this.data.weeklySchedule[day];
            const idx = list.findIndex(l => l.periodNo === periodNo);

            const newEntry = {
                periodNo: periodNo,
                classId: classId,
                subject: meta.subject,
                topic: meta.topic,
                outcomeCode: meta.code,
                outcomeDesc: meta.desc,
                room: meta.room
            };

            if (idx >= 0) {
                list[idx] = newEntry;
            } else {
                list.push(newEntry);
                list.sort((a, b) => a.periodNo - b.periodNo);
            }

            this.data = JSON.parse(JSON.stringify(this.data));
            this.showToast(`${day} ${periodNo}. Ders: ${classId === 'Boş' ? 'Ders Yok' : classId} (Maarif Modeli) güncellendi.`);
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },

        // Yeni Gözlem Ekle
        addObservation() {
            if (!this.newObs.studentId || !this.newObs.rawNote) {
                alert("Lütfen öğrenci seçip notunuzu yazınız!");
                return;
            }
            const st = this.data.students.find(s => s.id === this.newObs.studentId);
            
            this.data.observations.unshift({
                id: 'obs-' + Date.now(),
                date: new Date().toISOString().slice(0, 10),
                studentId: st.id,
                studentName: st.name,
                classId: st.classId,
                category: this.newObs.category,
                rawNote: this.newObs.rawNote,
                aiSummary: `${st.name}'in ders ve etkinlik katılımı değerlendirilmiş; ${this.newObs.status.toLowerCase()} yönünde takibi önerilmiştir.`,
                tags: this.newObs.tags,
                status: this.newObs.status
            });

            this.newObs.rawNote = '';
            this.isObsModalOpen = false;
            this.showToast("Gözlem not defterine kaydedildi! 📝");
        },

        // Yeni Proje Takvimi Kaydı Ekle
        addProjectCalendarItem() {
            if (!this.newProjCal.title || !this.newProjCal.deadline) {
                alert("Lütfen proje takvim başlığı ve son teslim tarihini giriniz!");
                return;
            }
            this.data.projectCalendar.unshift({
                id: 'pcal-' + Date.now(),
                title: this.newProjCal.title,
                category: this.newProjCal.category,
                targetProject: this.newProjCal.targetProject || 'Genel Başvuru',
                startDate: this.newProjCal.startDate,
                deadline: this.newProjCal.deadline,
                status: this.newProjCal.status,
                priority: this.newProjCal.priority,
                notes: this.newProjCal.notes,
                checkpoints: [
                    { text: "Başvuru şartnamesi ve planlama", done: true, date: this.newProjCal.startDate },
                    { text: "Uygulama ve teslim aşaması", done: false, date: this.newProjCal.deadline }
                ]
            });

            this.newProjCal.title = '';
            this.newProjCal.targetProject = '';
            this.newProjCal.deadline = '';
            this.newProjCal.notes = '';
            this.isProjCalModalOpen = false;
            this.showToast("Proje takvimi kaydı eklendi! 📅");
        },

        // Proje Takvimi Sil
        deleteProjectCalendarItem(id) {
            if (confirm("Bu proje takvim kaydını silmek istediğinize emin misiniz?")) {
                this.data.projectCalendar = this.data.projectCalendar.filter(p => p.id !== id);
                this.showToast("Proje takvim kaydı silindi.");
            }
        },

        // AI Modalı Aç
        openAIModal(assistantId = 'observation-enhancer', customText = '') {
            this.selectedAssistant = assistantId;
            this.aiParams.customPrompt = customText;
            this.aiResult = '';
            this.isAIOpen = true;
        },

        // AI Üretimini Tetikle
        async runAIGeneration() {
            this.isAILoading = true;
            this.aiResult = '';
            try {
                this.aiResult = await window.AIEngine.generate(this.selectedAssistant, this.aiParams, this.settings);
                this.showToast("Yapay zeka içeriği oluşturuldu! ✨");
            } catch (err) {
                this.aiResult = "Hata: " + err.message;
            } finally {
                this.isAILoading = false;
            }
        },

        // Hızlı Komut Yürütücü
        executeCommand(action, param = '') {
            this.isCommandOpen = false;
            if (action === 'tab') {
                this.setTab(param);
            } else if (action === 'ai') {
                this.openAIModal(param);
            } else if (action === 'new-obs') {
                this.isObsModalOpen = true;
            } else if (action === 'new-task') {
                this.isTaskModalOpen = true;
            } else if (action === 'new-proj-cal') {
                this.isProjCalModalOpen = true;
            } else if (action === 'cert') {
                this.openCertModal();
            }
        },

        // Sertifika Modalı Aç
        openCertModal(student = null) {
            if (student) {
                this.certStudentName = student.name;
                this.certStudentClass = (this.data.classes.find(c => c.id === student.classId) || {}).name || '7/A';
            }
            this.isCertModalOpen = true;
        },

        // Sertifika Yazdır
        printCertificate() {
            const certHtml = document.getElementById('printable-certificate-container').innerHTML;
            window.Exporter.printContent('Başarı Belgesi - ' + this.certStudentName, certHtml);
        },

        // ================= YILLIK PLAN & MAARİF KAZANIMLARI METODLARI =================
        openAnnualPlanModal(grade = 5, weekIdx = null) {
            this.selectedAnnualPlanGrade = Number(grade) || 5;
            if (weekIdx !== null && weekIdx !== undefined) {
                this.selectedAnnualPlanWeekIndex = Math.max(0, Math.min(Number(weekIdx), 36));
            }
            this.annualPlanSearchQuery = '';
            this.loadCurrentWeekNote();
            this.setTab('annual-plan');
        },

        getCurrentAnnualPlanWeek(grade = null) {
            const g = String(grade || this.selectedAnnualPlanGrade || 5);
            const list = (window.AnnualPlanData && window.AnnualPlanData[g]) || (this.annualPlanData && this.annualPlanData[g]) || [];
            if (!list.length) return null;
            const idx = Math.max(0, Math.min(this.selectedAnnualPlanWeekIndex, list.length - 1));
            return list[idx];
        },

        getAnnualPlanWeekAt(grade, idx) {
            const g = String(grade || this.selectedAnnualPlanGrade || 5);
            const list = (window.AnnualPlanData && window.AnnualPlanData[g]) || (this.annualPlanData && this.annualPlanData[g]) || [];
            if (idx < 0 || idx >= list.length) return null;
            return list[idx];
        },

        prevAnnualPlanWeek() {
            if (this.selectedAnnualPlanWeekIndex > 0) {
                this.selectedAnnualPlanWeekIndex--;
                this.loadCurrentWeekNote();
                this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
            }
        },

        nextAnnualPlanWeek() {
            const g = String(this.selectedAnnualPlanGrade || 5);
            const total = (window.AnnualPlanData && window.AnnualPlanData[g] ? window.AnnualPlanData[g].length : 37);
            if (this.selectedAnnualPlanWeekIndex < total - 1) {
                this.selectedAnnualPlanWeekIndex++;
                this.loadCurrentWeekNote();
                this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
            }
        },

        setAnnualPlanWeek(idx) {
            this.selectedAnnualPlanWeekIndex = Number(idx);
            this.loadCurrentWeekNote();
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },

        toggleAnnualPlanAccordion(key) {
            if (this.annualPlanAccordion[key] !== undefined) {
                this.annualPlanAccordion[key] = !this.annualPlanAccordion[key];
            } else {
                this.annualPlanAccordion[key] = false;
            }
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },

        loadCurrentWeekNote() {
            const storageKey = 'rotali_annual_plan_notes_' + (this.activeTeacherId || 'teacher1');
            try {
                this.annualPlanNotes = JSON.parse(localStorage.getItem(storageKey) || '{}');
            } catch (e) {
                this.annualPlanNotes = {};
            }
            const key = `${this.selectedAnnualPlanGrade}_${this.selectedAnnualPlanWeekIndex + 1}`;
            this.activeWeekNote = this.annualPlanNotes[key] || '';
        },

        saveCurrentWeekNote() {
            const storageKey = 'rotali_annual_plan_notes_' + (this.activeTeacherId || 'teacher1');
            const key = `${this.selectedAnnualPlanGrade}_${this.selectedAnnualPlanWeekIndex + 1}`;
            this.annualPlanNotes[key] = this.activeWeekNote;
            localStorage.setItem(storageKey, JSON.stringify(this.annualPlanNotes));
            this.showToast(`${this.selectedAnnualPlanWeekIndex + 1}. Hafta öğretmen notu kaydedildi! 📝`);
        },

        getFilteredAnnualPlan(grade = null) {
            const g = String(grade || this.selectedAnnualPlanGrade || 5);
            const plans = (window.AnnualPlanData && window.AnnualPlanData[g]) || (this.annualPlanData && this.annualPlanData[g]) || [];
            if (!plans || !Array.isArray(plans)) return [];

            const query = (this.annualPlanSearchQuery || '').trim().toLowerCase();
            if (!query) return plans;

            return plans.filter(w => {
                const outcomesStr = (w.outcomesList || []).map(o => `${o.code || ''} ${o.desc || ''}`).join(' ');
                const processStr = (w.processList || []).join(' ');
                const searchStr = `${w.week || ''} ${w.date || ''} ${w.unit || ''} ${w.topic || ''} ${w.outcome || ''} ${outcomesStr} ${w.process || ''} ${processStr} ${w.values || ''} ${w.skills || ''} ${w.specialDays || ''}`.toLowerCase();
                return searchStr.includes(query);
            });
        },

        getMaarifUnitInfo(grade = null) {
            const g = grade || this.selectedAnnualPlanGrade || 5;
            return (window.MaarifUnitInfo && window.MaarifUnitInfo[g]) || [];
        },

        formatValuesList(valStr) {
            if (!valStr || typeof valStr !== 'string') return [];
            const str = valStr.trim();
            if (!str) return [];
            if (str.includes(',') || str.includes(';')) {
                return str.split(/[,;]+/).map(s => s.trim()).filter(Boolean);
            }
            const parts = str.split(/(?=D\d)/g);
            return parts.map(s => s.trim()).filter(Boolean);
        },

        formatSkillsList(skillStr) {
            if (!skillStr || typeof skillStr !== 'string') return [];
            const str = skillStr.trim();
            if (!str) return [];
            if (str.includes(',') || str.includes(';')) {
                return str.split(/[,;]+/).map(s => s.trim()).filter(Boolean);
            }
            const parts = str.split(/(?=(?:SDB|KB|E|OB|AB|DB|MB)\d)/g);
            return parts.map(s => s.trim()).filter(Boolean);
        },

        printAnnualPlan(grade = null) {
            const g = grade || this.selectedAnnualPlanGrade || 5;
            const container = document.getElementById('printable-annual-plan-container');
            if (container) {
                window.Exporter.printContent(`${g}. Sınıf Fen Bilimleri Maarif Modeli Yıllık Planı`, container.innerHTML);
            }
        },

        // JSON Yedek İndir
        exportBackup() {
            window.StorageManager.exportJSON(this.data, this.activeTeacherId);
            this.showToast("Yedek dosyası indirildi! 💾");
        },

        // JSON Yedek Yükle
        triggerImportBackup() {
            const fileInput = document.getElementById('jsonFileInput');
            if (fileInput) fileInput.click();
        },
        handleFileImport(event) {
            const file = event.target.files[0];
            if (!file) return;
            window.StorageManager.importJSON(file, (success, msg) => {
                if (success) {
                    this.data = window.StorageManager.loadData(this.activeTeacherId);
                    this.settings = window.StorageManager.loadSettings(this.activeTeacherId);
                    this.showToast(msg);
                } else {
                    alert(msg);
                }
            }, this.activeTeacherId);
        }
    }));
});
