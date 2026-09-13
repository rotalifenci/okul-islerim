// Rotalı Fenci - Kişisel Dijital Öğretmen Paneli Reaktif Yönetimi (Okul İşlerim)

document.addEventListener('alpine:init', () => {
    Alpine.data('rotaliApp', () => ({
        // Aktif Sekme (Sayfa yenilenince hatırlanır, localStorage'dan yüklenir)
        currentTab: localStorage.getItem('rotali_last_tab') || 'calendar-tasks',
        selectedClassId: '7A',
        searchQuery: '',
        projectCategoryFilter: 'Hepsi',
        
        // Nöbet Yerleri ve 7 Haftalık Nöbet Rotasyon Döngüsü
        // (Sıra: Kat-2 (2 hafta), Kat-3 (2 hafta), Bahçe (1 hafta), Zemin (1 hafta), Kat-1 (1 hafta))
        dutyLocations: ['Bahçe', 'Zemin', 'Kat-1', 'Kat-2', 'Kat-3'],
        dutyRotation: ['Kat-2', 'Kat-2', 'Kat-3', 'Kat-3', 'Bahçe', 'Zemin', 'Kat-1'],
        
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
        // 👤 Hesap Bilgileri Yönetimi
        accountForm: {
            name: '',
            title: '',
            school: '',
            academicYear: '2026-2027',
            dutyDay: 'Cuma',
            dutyArea: 'Kat-2',
            newPassword: '',
            confirmPassword: ''
        },
        // 👥 Okul Toplantılarım Durumu
        
        // 🎨 Maarif Çalışmaları & Çoklu Fotoğraf Durumu
        selectedMaarifClass: 'Hepsi',
        selectedMaarifCategory: 'all',
        maarifSearchQuery: '',
        isMaarifModalOpen: false,
        isEditMaarif: false,
        maarifForm: {
            id: '',
            title: '',
            classes: ['5/A'],
            grade: 5,
            date: new Date().toISOString().slice(0, 10),
            category: 'Model & Deney',
            outcomeCode: '',
            outcomeTitle: '',
            description: '',
            photos: []
        },
        isLightboxOpen: false,
        lightboxImages: [],
        lightboxActiveIndex: 0,
        isMeetingModalOpen: false,
        isLessonPeriodsModalOpen: false,
        tempLessonPeriods: [],
        isEditMeeting: false,
        meetingFilterType: 'all',
        meetingFilterStatus: 'all',
        meetingSearchQuery: '',
        meetingForm: {
            id: '',
            title: '',
            type: 'Öğretmenler Kurulu',
            date: new Date().toISOString().slice(0, 10),
            time: '14:00',
            location: 'Konferans Salonu',
            attendees: 'Tüm Öğretmenler',
            agenda: '',
            decisions: '',
            status: 'Yapılacak'
        },
        isTaskModalOpen: false,
        newTask: {
            title: '',
            category: 'Öğrenci Takibi',
            priority: 'urgent',
            date: new Date().toISOString().slice(0, 10),
            timePeriod: 'Tüm Gün',
            notes: ''
        },
        selectedAssignmentClass: 'Hepsi',

        // 📚 Ödevler & Ödev Planlama Durumu (Sınıf Seviyeleri, Takvim, Zaman Aralığı)
        selectedAssignmentGrade: 'Hepsi',
        assignmentStartDate: '2026-09-01',
        assignmentEndDate: '2026-10-31',
        assignmentSearchQuery: '',
        isNewAssignmentModalOpen: false,
        editingAssignmentId: null,
        newAssignment: {
            grade: 5,
            targetClasses: ['5A', '5D'],
            title: '',
            description: '',
            assignedDate: new Date().toISOString().slice(0, 10),
            dueDate: new Date(Date.now() + 3*86400000).toISOString().slice(0, 10),
            status: 'Aktif',
            unit: ''
        },

        // Öğrenci Ödev Kontrolü Durumu
        selectedHomeworkDate: '2026-09-11',
        currentHomeworkTitle: 'Hücre ve Organeller Etkinlik Defteri (s. 18-22)',
        homeworkViewMode: 'daily',
        isHwHistoryModalOpen: false,
        selectedHwStudent: null,
        isAddStudentModalOpen: false,
        addStudentMode: 'single', // 'single', 'bulk' veya 'delete'
        newStudent: {
            classId: '5D',
            no: '',
            name: '',
            notes: ''
        },
        bulkStudentText: '',
        
        // 🖨️ Detaylı Tarih Aralıklı Rapor & Yazdırma Modalı
        isPrintReportModalOpen: false,
        reportClassId: '5A',
        reportStartDate: '2026-09-01',
        reportEndDate: '2026-09-30',

        scoringLegend: [
            { score: '0', label: '0: Yok (0p)', pts: '0 Puan', color: 'red', desc: 'Ödev getirilmedi veya hiç yapılmadı (0p)' },
            { score: '1', label: '1: YARIM ARTI (1p)', pts: '1 Puan', color: 'amber', desc: 'Kısmen / eksik yapıldı (+/-) (1p)' },
            { score: '2', label: '2: + (+2p)', pts: '2 Puan', color: 'emerald', desc: 'Eksiksiz ve doğru tamamlandı (+) (2p)' },
            { score: '4', label: '4: YILDIZ (+4p)', pts: '4 Puan', color: 'yellow', desc: 'Üstün başarı ve özenli çalışma (★) (4p)' },
            { score: 'G', label: 'G: Gelmedi', pts: 'Devamsız', color: 'slate', desc: 'Öğrenci o gün okula gelmedi' }
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
            room: '5/A Sınıfı'
        },

        // 👨‍🎓 Öğrenci Listesi & Sınıf Yönetimi Durumu
        selectedStudentListClass: 'ALL',
        studentListSearch: '',
        isAddClassModalOpen: false,
        newClassForm: { name: '', grade: 5, advisor: '' },
        // ⚠️ Hata & Sorun Bildirimi Durumu
        bugReports: [],
        bugFilterStatus: 'ALL',
        bugReportForm: {
            section: '📝 Öğrenci Ödev Kontrolü',
            errorType: 'Açılmayan İçerik / Boş Ekran',
            device: '',
            description: '',
            urgency: 'Normal',
            screenshot: ''
        },
        // Güvenlik & 4 Kullanıcılı Giriş Sistemi (1 Yönetici + 3 Öğretmen)
        users: window.AuthUsers || [],
        currentUser: null,
        isAuthenticated: false,
        loginSelectedUser: localStorage.getItem('rotali_active_user_id') || 'admin',
        loginUsername: localStorage.getItem('rotali_last_username') || 'admin',
        loginPassword: '',
        loginError: '',
        isPasswordVisible: false,

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
        annualPlanNotes: JSON.parse(localStorage.getItem('rotali_annual_plan_notes') || '{}'),
        activeWeekNote: '',
        isAddingWeekNote: false,
        annualPlanData: window.AnnualPlanData || {},
        curriculumData: window.CurriculumData || {},

        // Bildirim Toast
        toast: {
            show: false,
            message: ''
        },        // 📑 Günlük Plan Durumu (5, 6, 7, 8 & 37 Hafta Gezgini)
        selectedDailyPlanGrade: 5,
        selectedDailyPlanWeekIndex: 0,
        selectedDailyPlanClass: '5/A',
        dailyPlanViewMode: 'interactive', // 'interactive' (Haftalık Akıllı), 'all-weeks', 'list'
        dailyPlanSearchQuery: '',
        isDailyPlanModalOpen: false,
        isEditDailyPlan: false,
        customDailyPlans: JSON.parse(localStorage.getItem('rotali_custom_daily_plans') || '{}'),
        dailyPlanForm: {
            id: '',
            grade: 5,
            weekIndex: 0,
            date: '',
            day: 'Pazartesi',
            periodNo: 1,
            classId: '5/A',
            subject: 'Fen Bilimleri',
            unit: '',
            topic: '',
            outcomeCode: '',
            outcomeDesc: '',
            methods: 'Model Oluşturma, Deney & Gözlem, Soru-Cevap, Akran Öğrenmesi',
            materials: 'Ders Kitabı, Etkinlik Defteri, Akıllı Tahta, Deney Seti',
            intro: '',
            development: '',
            summary: '',
            evaluation: '',
            notes: ''
        },
        // 📱 Mobil & Yönetim Menüsü Durumu
        isMobileMenuOpen: false,
        isMenuManagerModalOpen: false,
        isAddSectionModalOpen: false,
        isEditSectionModalOpen: false,
        editingSection: { id: '', title: '', icon: 'folder', color: 'blue', badge: '', description: '', visible: true },
        newSectionForm: { title: '', icon: 'folder', color: 'blue', badge: '', description: '' },
        
        // 📦 Özel Bölüm İçerik Formu
        isCustomItemModalOpen: false,
        isEditCustomItem: false,
        customItemForm: { id: '', sectionId: '', title: '', category: '', count: '', status: 'Aktif', note: '', date: '' },
        
        // 👨‍🎓 Öğrenci Düzenleme Modalı
        isEditStudentModalOpen: false,
        editingStudent: { id: '', name: '', no: '', classId: '5A', notes: '', avatar: '👨‍🎓' },

        // 📅 Yıllık Plan / Kazanım Düzenleme
        isAddCurriculumModalOpen: false,
        isEditCurriculumModalOpen: false,
        curriculumForm: { grade: 5, weekNo: 1, dateRange: '', unit: '', outcomeCode: '', outcomeTitle: '', activities: '', notes: '' },

        // 🚀 Proje Düzenleme Modalı
        isEditProjCalModalOpen: false,
        editingProjCal: { id: '', title: '', category: 'TÜBİTAK', targetProject: '', startDate: '', deadline: '', status: 'Planlandı', priority: 'Yüksek', notes: '' },

        // Başlangıç & Kullanıcı Oturumu Yükleme
        init() {
            // 5 Kullanıcıdan Aktif Olanı Seç
            this.users = window.AuthUsers || [];
            try {
                const customUsers = JSON.parse(localStorage.getItem('rotali_users_custom') || '[]');
                if (Array.isArray(customUsers) && customUsers.length) {
                    customUsers.forEach(cu => {
                        const match = this.users.find(u => u.id === cu.id);
                        if (match) {
                            if (cu.name) match.name = cu.name;
                            if (cu.school) match.school = cu.school;
                        }
                    });
                }
            } catch (e) {}

            const activeUid = localStorage.getItem('rotali_active_user_id') || 'admin';
            this.currentUser = this.users.find(u => u.id === activeUid) || this.users[0] || null;
            this.loginSelectedUser = this.currentUser ? this.currentUser.id : 'admin';
            this.loginUsername = this.currentUser ? this.currentUser.username : 'admin';

            // İlgili kullanıcının bağımsız/izole verilerini yükle
            this.data = window.StorageManager.loadData(this.currentUser ? this.currentUser.id : 'admin');
            if (this.data && this.data.teacher && this.data.teacher.name && this.currentUser) {
                this.currentUser.name = this.data.teacher.name;
            }
            this.loadAccountForm();
            // Kalıcı oturum kontrolü: Daha önce giriş yaptıysa ve çıkış yapmadıysa otomatik giriş
            const savedAuth = localStorage.getItem('rotali_auth_state') === 'authenticated';
            const savedUserId = localStorage.getItem('rotali_active_user_id');
            if (savedAuth && savedUserId && this.currentUser && this.currentUser.id === savedUserId) {
                this.isAuthenticated = true;
            } else {
                this.isAuthenticated = false;
            }
            this.initBugReports();

            // Menü başlıklarını garantiye al
            if (this.data && this.data.navSections && Array.isArray(this.data.navSections)) {
                this.data.navSections.forEach(sec => {
                    sec.badge = '';
                    if (sec.id === 'account') {
                        sec.title = '👤 Hesap Bilgilerim';
                    }
                });
            }


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

            // Ödevler verisini doğrula
            if (!this.data.assignments || !Array.isArray(this.data.assignments)) {
                this.data.assignments = [];
            }

            this.loadCurrentWeekNote();

            // Öğrenci isimlerini temizleme
            if (this.data && this.data.students && Array.isArray(this.data.students)) {
                let cleanedAny = false;
                this.data.students.forEach(st => {
                    const cleaned = this.cleanStudentName(st.name);
                    if (cleaned && cleaned !== st.name) {
                        st.name = cleaned;
                        cleanedAny = true;
                    }
                });
                if (cleanedAny) {
                    const uid = this.currentUser ? this.currentUser.id : 'admin';
                    window.StorageManager.saveData(this.data, uid);
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
                    this.isMeetingModalOpen = false;
                    this.isProjCalModalOpen = false;
                    this.isAnnualPlanModalOpen = false;
                    this.isDailyPlanModalOpen = false;
                    this.isAddStudentModalOpen = false;
                    this.isNewAssignmentModalOpen = false;
                    this.isPrintReportModalOpen = false;
                }
                if ((this.currentTab === 'annual-plan' || this.isAnnualPlanModalOpen) && this.annualPlanViewMode === 'interactive' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                    if (e.key === 'ArrowLeft') {
                        this.prevAnnualPlanWeek();
                    } else if (e.key === 'ArrowRight') {
                        this.nextAnnualPlanWeek();
                    }
                }
            });

            // Veri Değişikliklerini Kullanıcıya Özel Kaydet
            this.$watch('data', () => {
                const uid = this.currentUser ? this.currentUser.id : 'admin';
                window.StorageManager.saveData(this.data, uid);
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

        // Kullanıcı Seçimi (Giriş Ekranında)
        selectLoginUser(user) {
            this.loginSelectedUser = user.id;
            this.loginUsername = user.username;
            this.loginPassword = '';
            this.loginError = '';
        },

        // Hızlı Şifre Doldurma & Giriş
        quickLoginWithPassword(pass) {
            this.loginPassword = pass;
            this.login();
        },

        // Hızlı Şifre Doldurma & Giriş
        quickLoginWithPassword(pass) {
            this.loginPassword = pass;
            this.login();
        },

        // Kullanıcının güncel şifresini al
        getUserPassword(userId) {
            try {
                const custom = JSON.parse(localStorage.getItem('rotali_custom_user_passwords') || '{}');
                if (custom[userId]) return custom[userId];
            } catch (e) {}
            const u = (this.users || []).find(x => x.id === userId);
            return u ? u.password : '';
        },


        // =========================================================================
        // 🏫 SINIF YÖNETİMİ & 👨‍🎓 ÖĞRENCİ LİSTESİ MODÜLÜ
        // =========================================================================
        openAddClassModal() {
            this.newClassForm = { name: '', grade: 5, advisor: '' };
            this.isAddClassModalOpen = true;
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },

        addNewClass() {
            let rawName = (this.newClassForm.name || '').trim();
            if (!rawName) {
                alert('Lütfen sınıf adını (Örn: 8/A veya 6/B) giriniz.');
                return;
            }
            // Standart sınıf formatı oluştur (Örn: 8-a -> 8/A, 8a -> 8/A)
            rawName = rawName.toUpperCase().replace(/\s+/g, '').replace('-', '/');
            if (!rawName.includes('/') && rawName.length >= 2) {
                rawName = rawName.slice(0, rawName.length - 1) + '/' + rawName.slice(rawName.length - 1);
            }
            const classId = rawName.replace('/', '').toUpperCase();

            if (!this.data.classes) this.data.classes = [];
            const exists = this.data.classes.find(c => (c.id && c.id.toUpperCase() === classId) || (c.name && c.name.toUpperCase() === rawName));
            if (exists) {
                alert(`"${rawName}" sınıfı zaten listenizde mevcut!`);
                return;
            }

            const matchGrade = rawName.match(/^(\d+)/);
            const grade = matchGrade ? parseInt(matchGrade[1]) : (parseInt(this.newClassForm.grade) || 5);

            const newCls = {
                id: classId,
                name: rawName,
                grade: grade,
                studentCount: 0,
                advisor: (this.newClassForm.advisor || '').trim()
            };

            this.data.classes.push(newCls);
            window.StorageManager.saveData(this.data);
            this.selectedClassId = classId;
            this.selectedStudentListClass = classId;
            this.isAddClassModalOpen = false;
            this.showToast(`"${rawName}" sınıfı başarıyla eklendi! 🎉`);
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },

        deleteClass(cls) {
            const studentCount = (this.data.students || []).filter(s => s.classId === cls.id).length;
            if (confirm(`"${cls.name}" sınıfını silmek istediğinize emin misiniz?${studentCount > 0 ? '\n\n⚠️ Bu sınıfa ait ' + studentCount + ' öğrenci de silinecektir!' : ''}`)) {
                this.data.classes = (this.data.classes || []).filter(c => c.id !== cls.id);
                if (studentCount > 0) {
                    this.data.students = (this.data.students || []).filter(s => s.classId !== cls.id);
                }
                if (this.selectedClassId === cls.id && this.data.classes.length > 0) {
                    this.selectedClassId = this.data.classes[0].id;
                }
                if (this.selectedStudentListClass === cls.id) {
                    this.selectedStudentListClass = 'ALL';
                }
                window.StorageManager.saveData(this.data);
                this.showToast(`"${cls.name}" sınıfı ve öğrencileri silindi.`);
                this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
            }
        },

        getClassName(classId) {
            if (!classId) return '';
            const found = (this.data.classes || []).find(c => c.id === classId || c.name === classId);
            return found ? found.name : classId;
        },

        getFilteredStudentList() {
            let list = this.data.students || [];
            if (this.selectedStudentListClass && this.selectedStudentListClass !== 'ALL') {
                list = list.filter(s => s.classId === this.selectedStudentListClass);
            }
            const query = (this.studentListSearch || '').trim().toLowerCase();
            if (query) {
                list = list.filter(s => 
                    (s.name || '').toLowerCase().includes(query) ||
                    (s.no || '').toString().includes(query) ||
                    this.getClassName(s.classId).toLowerCase().includes(query)
                );
            }
            return list.slice().sort((a, b) => {
                if (a.classId !== b.classId) {
                    return (a.classId || '').localeCompare(b.classId || '');
                }
                return (Number(a.no) || 0) - (Number(b.no) || 0);
            });
        },

        exportStudentListToExcel() {
            const list = this.getFilteredStudentList();
            if (!list.length) {
                this.showToast("Dışa aktarılacak öğrenci bulunamadı!", "warning");
                return;
            }
            const clsName = this.selectedStudentListClass === 'ALL' ? 'Tum_Siniflar' : this.getClassName(this.selectedStudentListClass);
            const headers = ['Sıra No', 'Okul No', 'Öğrenci Adı Soyadı', 'Sınıf / Şube', 'Notlar / Durum'];
            const rows = list.map((st, idx) => [
                idx + 1,
                st.no || '',
                st.name || '',
                this.getClassName(st.classId),
                st.notes || ''
            ]);
            window.Exporter.exportHtmlTableToExcel(
                `Ogrenci_Listesi_${clsName}`,
                `Rotalı Fenci - Öğrenci Listesi (${this.selectedStudentListClass === 'ALL' ? 'Tüm Sınıflar' : this.getClassName(this.selectedStudentListClass)})`,
                headers,
                rows
            );
            this.showToast("Öğrenci listesi Excel olarak başarıyla indirildi! 📊");
        },

        printStudentList() {
            const list = this.getFilteredStudentList();
            if (!list.length) {
                this.showToast("Yazdırılacak öğrenci bulunamadı!", "warning");
                return;
            }
            const clsTitle = this.selectedStudentListClass === 'ALL' ? 'Tüm Sınıflar' : `${this.getClassName(this.selectedStudentListClass)} Sınıfı`;
            let tableRows = '';
            list.forEach((st, idx) => {
                tableRows += `
                    <tr style="${idx % 2 === 0 ? 'background-color:#ffffff;' : 'background-color:#f8fafc;'}">
                        <td style="padding:6px; border:1px solid #cbd5e1; text-align:center; font-weight:bold; color:#64748b;">${idx + 1}</td>
                        <td style="padding:6px; border:1px solid #cbd5e1; text-align:center; font-weight:900; color:#dc2626; font-size:11pt;">${st.no || ''}</td>
                        <td style="padding:6px; border:1px solid #cbd5e1; font-weight:bold; color:#0f172a; font-size:10.5pt;">${st.name || ''}</td>
                        <td style="padding:6px; border:1px solid #cbd5e1; text-align:center; font-weight:900;">${this.getClassName(st.classId)}</td>
                        <td style="padding:6px; border:1px solid #cbd5e1; font-size:9pt; color:#475569;">${st.notes || ''}</td>
                    </tr>
                `;
            });

            const html = `
                <div style="font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                    <div style="text-align:center; padding-bottom:12px; border-bottom:2px solid #0f172a; margin-bottom:12px;">
                        <h1 style="font-size:18pt; font-weight:900; color:#0f172a; margin:0; text-transform:uppercase;">ÖĞRENCİ LİSTESİ & ŞUBE MEVCUDU</h1>
                        <div style="display:flex; justify-content:space-between; align-items:center; font-size:9pt; font-weight:bold; color:#475569; margin-top:8px;">
                            <span><strong>Öğretmen:</strong> ${this.data.teacher?.name || this.currentUser?.name || 'Murat Kundakcı'}</span>
                            <span style="padding:2px 8px; background-color:#fee2e2; color:#991b1b; border:1px solid #f87171; border-radius:4px; font-weight:900;">${clsTitle}</span>
                            <span><strong>Toplam Öğrenci:</strong> ${list.length}</span>
                            <span><strong>Tarih:</strong> ${new Date().toLocaleDateString('tr-TR')}</span>
                        </div>
                    </div>
                    <table style="width:100%; border-collapse:collapse; border:1px solid #cbd5e1; font-size:10pt;">
                        <thead>
                            <tr style="background-color:#dc2626; color:#ffffff; font-weight:900; font-size:9pt; text-transform:uppercase;">
                                <th style="padding:8px; border:1px solid #94a3b8; width:45px; text-align:center;">Sıra</th>
                                <th style="padding:8px; border:1px solid #94a3b8; width:80px; text-align:center;">Okul No</th>
                                <th style="padding:8px; border:1px solid #94a3b8; text-align:left;">Öğrenci Adı Soyadı</th>
                                <th style="padding:8px; border:1px solid #94a3b8; width:80px; text-align:center;">Sınıf</th>
                                <th style="padding:8px; border:1px solid #94a3b8; text-align:left;">Notlar / Açıklama</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </div>
            `;
            window.Exporter.printContent(`Öğrenci Listesi - ${clsTitle}`, html);
        },

        // Şifre ile Doğrudan Giriş Yap (Kullanıcı Adı Gerekmez)
        login() {
            const pass = (this.loginPassword || '').trim();
            if (!pass) {
                this.loginError = 'Lütfen şifrenizi giriniz!';
                return;
            }

            // Girilen şifre hangi kullanıcıya aitse onu otomatik tespit et (Özel şifreler dahil)
            let customPasswords = {};
            try {
                customPasswords = JSON.parse(localStorage.getItem('rotali_custom_user_passwords') || '{}');
            } catch (e) {}

            const user = (this.users || []).find(u => {
                const activePass = customPasswords[u.id] || u.password;
                return activePass === pass || (u.passwords && u.passwords.includes(pass));
            });

            if (user) {
                this.currentUser = user;
                this.isAuthenticated = true;
                this.loginError = '';
                this.loginPassword = '';
                localStorage.setItem('rotali_active_user_id', user.id);
                localStorage.setItem('rotali_last_username', user.username);
                localStorage.setItem('rotali_auth_state', 'authenticated'); // Kalıcı oturum: çıkış yapılmadıkça giriş ekranı gösterilmez

                // İlgili kullanıcının bağımsız izole verilerini yükle
                this.data = window.StorageManager.loadData(user.id);
                this.loadAccountForm();

            // Menü başlıklarını garantiye al
            if (this.data && this.data.navSections && Array.isArray(this.data.navSections)) {
                this.data.navSections.forEach(sec => {
                    sec.badge = '';
                    if (sec.id === 'account') {
                        sec.title = '👤 Hesap Bilgilerim';
                    }
                });
            }

                this.showToast(`Giriş başarılı! Hoş geldiniz, ${this.data.teacher?.name || user.name} 👋 ✨`);
                this.$nextTick(() => {
                    if (window.lucide) window.lucide.createIcons();
                });
            } else {
                this.loginError = 'Hatalı şifre! Lütfen şifrenizi kontrol edip tekrar deneyiniz.';
            }
        },

        // Çıkış Yap / Oturumu Kapat
        logout() {
            if (confirm(`${this.currentUser?.name || 'Kullanıcı'} oturumunu kapatmak istediğinize emin misiniz?`)) {
                this.isAuthenticated = false;
                this.loginPassword = '';
                this.loginError = '';
                localStorage.removeItem('rotali_auth_state');
                this.showToast('Oturum kapatıldı. 🔒');
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
            localStorage.setItem('rotali_last_tab', tab); // Sayfa yenilenince aynı bölüm açılsın
            if (tab === 'account' || tab === 'settings') {
                this.loadAccountForm();

            // Menü başlıklarını garantiye al
            if (this.data && this.data.navSections && Array.isArray(this.data.navSections)) {
                this.data.navSections.forEach(sec => {
                    sec.badge = '';
                    if (sec.id === 'account') {
                        sec.title = '👤 Hesap Bilgilerim';
                    }
                });
            }

            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.$nextTick(() => {
                if (window.lucide) window.lucide.createIcons();
            });
        },

        // 👤 Hesap Bilgilerini Yükle
        loadAccountForm() {
            if (!this.data) return;
            if (!this.data.teacher) {
                this.data.teacher = {
                    name: this.currentUser?.name || 'Murat Kundakcı (Rotalı Fenci)',
                    title: 'Fen Bilimleri Öğretmeni',
                    school: '',
                    academicYear: '2026-2027',
                    dutyDay: 'Cuma',
                    dutyArea: 'Kat-2'
                };
            }
            const t = this.data.teacher;
            const u = this.currentUser || {};
            this.accountForm = {
                name: t.name || u.name || '',
                title: t.title || 'Fen Bilimleri Öğretmeni',
                school: t.school || u.school || '',
                academicYear: t.academicYear || '2026-2027',
                dutyDay: t.dutyDay || (t.dutySchedule && t.dutySchedule[0]?.day) || 'Cuma',
                dutyArea: t.dutyArea || (t.dutySchedule && t.dutySchedule[0]?.area) || 'Kat-2',
                newPassword: '',
                confirmPassword: ''
            };
        },

        // 👤 Hesap Bilgilerini Kaydet
        saveAccountForm() {
            if (!this.accountForm.name || !this.accountForm.name.trim()) {
                alert('Lütfen adınızı ve soyadınızı giriniz!');
                return;
            }

            const trimmedName = this.accountForm.name.trim();
            const trimmedTitle = (this.accountForm.title || '').trim();
            const trimmedSchool = (this.accountForm.school || '').trim();
            const trimmedYear = (this.accountForm.academicYear || '2026-2027').trim();
            const dutyDay = this.accountForm.dutyDay || 'Cuma';
            const dutyArea = this.accountForm.dutyArea || 'Kat-2';

            // Şifre Değiştirme Kontrolü
            if (this.accountForm.newPassword || this.accountForm.confirmPassword) {
                if (this.accountForm.newPassword !== this.accountForm.confirmPassword) {
                    alert('Girdiğiniz yeni şifreler birbiriyle eşleşmiyor! Lütfen kontrol ediniz.');
                    return;
                }
                if (this.accountForm.newPassword.length < 3) {
                    alert('Şifreniz en az 3 karakter olmalıdır!');
                    return;
                }

                const uid = this.currentUser ? this.currentUser.id : 'admin';
                let customPasswords = {};
                try {
                    customPasswords = JSON.parse(localStorage.getItem('rotali_custom_user_passwords') || '{}');
                } catch (e) {}
                customPasswords[uid] = this.accountForm.newPassword;
                localStorage.setItem('rotali_custom_user_passwords', JSON.stringify(customPasswords));

                if (this.currentUser) {
                    this.currentUser.password = this.accountForm.newPassword;
                }
            }

            // this.data.teacher nesnesini güncelle
            if (!this.data.teacher) this.data.teacher = {};
            this.data.teacher.name = trimmedName;
            this.data.teacher.title = trimmedTitle;
            this.data.teacher.school = trimmedSchool;
            this.data.teacher.academicYear = trimmedYear;
            this.data.teacher.dutyDay = dutyDay;
            this.data.teacher.dutyArea = dutyArea;

            // currentUser nesnesini güncelle
            if (this.currentUser) {
                this.currentUser.name = trimmedName;
                this.currentUser.school = trimmedSchool;
            }

            // AuthUsers listesini güncelle ve localStorage'a kaydet
            if (this.users && Array.isArray(this.users)) {
                const u = this.users.find(x => x.id === (this.currentUser ? this.currentUser.id : 'admin'));
                if (u) {
                    u.name = trimmedName;
                    u.school = trimmedSchool;
                }
                try {
                    localStorage.setItem('rotali_users_custom', JSON.stringify(this.users));
                } catch (e) {}
            }

            // Kullanıcıya özel anahtarla verileri kaydet
            const uid = this.currentUser ? this.currentUser.id : 'admin';
            window.StorageManager.saveData(this.data, uid);

            // Şifre form alanlarını temizle
            this.accountForm.newPassword = '';
            this.accountForm.confirmPassword = '';

            this.showToast('👤 Hesap ve profil bilgileriniz başarıyla kaydedildi! ✅');

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
            window.StorageManager.saveData(this.data);
            this.showToast(task.done ? "Görev tamamlandı! 🎉" : "Görev aktif edildi.");
        },

        // Yeni Görev Ekle
        addTask() {
            if (!this.newTask.title.trim()) {
                alert("Lütfen görev başlığını giriniz!");
                return;
            }
            if (!this.data.tasks) this.data.tasks = [];
            this.data.tasks.unshift({
                id: 'task-' + Date.now(),
                title: this.newTask.title.trim(),
                category: this.newTask.category || 'Öğrenci Takibi',
                priority: this.newTask.priority || 'urgent',
                date: this.newTask.date || new Date().toISOString().slice(0, 10),
                timePeriod: this.newTask.timePeriod || 'Tüm Gün',
                notes: this.newTask.notes || '',
                done: false
            });
            this.newTask.title = '';
            this.newTask.notes = '';
            this.isTaskModalOpen = false;
            window.StorageManager.saveData(this.data);
            this.showToast("Yeni görev eklendi! 📋");
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },

        // Görev Sil
        deleteTask(taskId) {
            if (!confirm("Bu görevi silmek istediğinize emin misiniz?")) return;
            this.data.tasks = (this.data.tasks || []).filter(t => t.id !== taskId);
            window.StorageManager.saveData(this.data);
            this.showToast("Görev silindi. 🗑️");
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

        cleanStudentName(name) {
            if (!name) return '';
            let res = String(name).trim();
            // 5/A, 5-A, 5A, 6/G, 7/A, 7/B, 7-B, 5/D vb. sınıf ve no ön eklerini kaldır
            res = res.replace(/^([5-8]\s*[\/\-\.\_]?\s*[A-Za-z]\b|\d+\s*[\.\-]?\s*sınıf|no\s*[\:\-\.\s]?\s*\d+)\s*[\-\:\,\.]?\s*/i, '');
            res = res.replace(/^\d+[\s\.\-\:\,\t]+/i, ''); // Baştaki numara kalıntıları
            return res.trim();
        },

        setStudentHomeworkGrade(studentId, score) {
            const session = this.getTodayHomeworkSession();
            if (!session.grades) session.grades = {};
            const existingNote = session.grades[studentId]?.note || '';
            
            // Eğer aynı skora 2. kez tıklandıysa işareti kaldır (Toggle Off)
            if (session.grades[studentId] && session.grades[studentId].score === score) {
                delete session.grades[studentId];
                this.data = JSON.parse(JSON.stringify(this.data));
                this.showToast("Ödev işareti kaldırıldı.");
                return;
            }

            session.grades[studentId] = { score: score, note: existingNote };
            if (this.currentHomeworkTitle && !session.title) {
                session.title = this.currentHomeworkTitle;
            }
            this.data = JSON.parse(JSON.stringify(this.data));

            const labels = {
                '0': '0 (YOK - 0p)',
                '1': 'YARIM ARTI (1p)',
                '2': '+ (TAM - +2p)',
                '4': 'YILDIZ (+4p)',
                'G': 'G (GELMEDİ)'
            };
            this.showToast(`Ödev Durumu: ${labels[score] || score} olarak işlendi.`);
        },

        setStudentHomeworkNote(studentId, note) {
            const session = this.getTodayHomeworkSession();
            if (!session.grades) session.grades = {};
            const curScore = session.grades[studentId]?.score || '';
            session.grades[studentId] = { score: curScore, note: note };
            this.data = JSON.parse(JSON.stringify(this.data));
        },

        saveHomeworkData() {
            window.StorageManager.saveData(this.data);
            this.showToast("Ödev puanları ve öğretmen notları başarıyla kaydedildi! 💾");
        },

        openAddStudentModal(mode = 'single') {
            this.newStudent.classId = this.selectedClassId || '5D';
            this.newStudent.name = '';
            this.newStudent.no = '';
            this.newStudent.notes = '';
            this.bulkStudentText = '';
            this.addStudentMode = mode;
            this.isAddStudentModalOpen = true;
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },

        addSingleStudent() {
            if (!this.newStudent.name || !this.newStudent.no) {
                alert("Lütfen öğrenci okul numarasını ve adını soyadını giriniz.");
                return;
            }
            const clsId = this.newStudent.classId || this.selectedClassId || '5D';
            const cleanName = this.cleanStudentName(this.newStudent.name);
            const newSt = {
                id: 's_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
                name: cleanName,
                no: parseInt(this.newStudent.no) || this.newStudent.no,
                classId: clsId,
                avatar: '👨‍🎓',
                notes: this.newStudent.notes ? this.newStudent.notes.trim() : '',
                tags: ['⭐ Kayıtlı']
            };
            if (!this.data.students) this.data.students = [];
            this.data.students.push(newSt);
            this.data.students.sort((a, b) => (Number(a.no) || 0) - (Number(b.no) || 0));
            window.StorageManager.saveData(this.data);
            this.newStudent.name = '';
            this.newStudent.no = '';
            this.newStudent.notes = '';
            this.isAddStudentModalOpen = false;
            this.showToast(`${newSt.name} (${clsId}) başarıyla eklendi! 🎉`);
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },

        addBulkStudents() {
            if (!this.bulkStudentText || !this.bulkStudentText.trim()) {
                alert("Lütfen eklenecek öğrenci listesini kutuya yapıştırınız.");
                return;
            }
            const clsId = this.newStudent.classId || this.selectedClassId || '5D';
            const lines = this.bulkStudentText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            let addedCount = 0;
            if (!this.data.students) this.data.students = [];

            lines.forEach((line, idx) => {
                const match = line.match(/^(\d+)[\s\-\,\.\t]+(.+)$/);
                let no = (this.data.students.filter(s => s.classId === clsId).length + 1) * 5;
                let rawName = line;
                if (match) {
                    no = parseInt(match[1]);
                    rawName = match[2].trim();
                }
                const name = this.cleanStudentName(rawName);
                if (name) {
                    this.data.students.push({
                        id: 's_' + Date.now() + '_' + idx + '_' + Math.floor(Math.random() * 1000),
                        name: name,
                        no: no,
                        classId: clsId,
                        avatar: '👨‍🎓',
                        notes: '',
                        tags: ['⭐ Kayıtlı']
                    });
                    addedCount++;
                }
            });

            this.data.students.sort((a, b) => (Number(a.no) || 0) - (Number(b.no) || 0));
            window.StorageManager.saveData(this.data);
            this.bulkStudentText = '';
            this.isAddStudentModalOpen = false;
            this.showToast(`${clsId} sınıfına ${addedCount} öğrenci başarıyla eklendi! 🚀`);
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },

        deleteStudent(st) {
            if (confirm(`"${st.name}" (${st.classId} - No: ${st.no}) isimli öğrenciyi silmek istediğinize emin misiniz?`)) {
                this.data.students = this.data.students.filter(s => s.id !== st.id);
                window.StorageManager.saveData(this.data);
                this.showToast(`${st.name} listeden silindi.`);
                this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
            }
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
            const labels = { '0': '0 (YOK)', '1': 'YARIM ARTI', '2': '+ (TAM)', '4': 'YILDIZ', 'G': 'G (GELMEDİ)' };
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

        // ================= 📚 ÖDEVLER (ASSIGNMENTS & AJANDA) YÖNETİMİ =================
        openNewAssignmentModal(item = null) {
            if (item) {
                this.editingAssignmentId = item.id;
                this.newAssignment = {
                    grade: Number(item.grade) || 5,
                    targetClasses: item.targetClasses ? [...item.targetClasses] : ['5A'],
                    title: item.title || '',
                    description: item.description || '',
                    assignedDate: item.assignedDate || new Date().toISOString().slice(0, 10),
                    dueDate: item.dueDate || new Date().toISOString().slice(0, 10),
                    status: item.status || 'Aktif',
                    unit: item.unit || ''
                };
            } else {
                this.editingAssignmentId = null;
                const defaultGrade = this.selectedAssignmentGrade !== 'Hepsi' ? Number(this.selectedAssignmentGrade) : 5;
                const defaultClasses = defaultGrade === 5 ? ['5A', '5D'] : (defaultGrade === 6 ? ['6G'] : (defaultGrade === 7 ? ['7A', '7B'] : ['8A']));
                this.newAssignment = {
                    grade: defaultGrade,
                    targetClasses: defaultClasses,
                    title: '',
                    description: '',
                    assignedDate: new Date().toISOString().slice(0, 10),
                    dueDate: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
                    status: 'Aktif',
                    unit: ''
                };
            }
            this.isNewAssignmentModalOpen = true;
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },

        saveAssignment() {
            if (!this.newAssignment.title || !this.newAssignment.title.trim()) {
                alert("Lütfen ödev başlığı giriniz.");
                return;
            }
            if (!this.newAssignment.dueDate) {
                alert("Lütfen ödevin getirilme / teslim tarihini seçiniz.");
                return;
            }

            if (!this.data.assignments) this.data.assignments = [];

            if (this.editingAssignmentId) {
                const idx = this.data.assignments.findIndex(a => a.id === this.editingAssignmentId);
                if (idx !== -1) {
                    this.data.assignments[idx] = {
                        ...this.data.assignments[idx],
                        ...this.newAssignment,
                        grade: Number(this.newAssignment.grade)
                    };
                    this.showToast("Ödev başarıyla güncellendi! 📝");
                }
            } else {
                const newId = 'hw_' + Date.now();
                this.data.assignments.unshift({
                    id: newId,
                    ...this.newAssignment,
                    grade: Number(this.newAssignment.grade)
                });
                this.showToast("Yeni ödev takvime eklendi! 📚");
            }

            window.StorageManager.saveData(this.data);
            this.isNewAssignmentModalOpen = false;
            this.editingAssignmentId = null;
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },

        deleteAssignment(id) {
            if (confirm("Bu ödev kaydını silmek istediğinize emin misiniz?")) {
                this.data.assignments = (this.data.assignments || []).filter(a => a.id !== id);
                window.StorageManager.saveData(this.data);
                this.showToast("Ödev silindi.");
            }
        },

        goToStudentHomeworkCheck(assignment) {
            if (!assignment) return;
            const targetClass = (assignment.targetClasses && assignment.targetClasses[0]) || (assignment.grade === 5 ? '5A' : (assignment.grade === 6 ? '6G' : '7A'));
            this.selectedClassId = targetClass;
            this.selectedHomeworkDate = assignment.dueDate || new Date().toISOString().slice(0, 10);
            this.currentHomeworkTitle = assignment.title || '';
            
            // Eğer o güne ait oturum yoksa oluştur
            let session = this.data.homeworkDays?.find(h => h.date === this.selectedHomeworkDate && h.classId === this.selectedClassId);
            if (!session) {
                if (!this.data.homeworkDays) this.data.homeworkDays = [];
                session = {
                    date: this.selectedHomeworkDate,
                    classId: this.selectedClassId,
                    title: this.currentHomeworkTitle,
                    grades: {}
                };
                this.data.homeworkDays.push(session);
                window.StorageManager.saveData(this.data);
            } else if (!session.title) {
                session.title = this.currentHomeworkTitle;
                window.StorageManager.saveData(this.data);
            }

            this.setTab('students');
            this.showToast(`${targetClass} sınıfı için "${this.selectedHomeworkDate}" tarihli Öğrenci Ödev Kontrolü ekranına yönlendirildi.`);
        },

        getFilteredAssignments() {
            let list = this.data.assignments || [];
            if (!Array.isArray(list)) return [];

            // Sınıf seviyesi filtresi
            if (this.selectedAssignmentGrade && this.selectedAssignmentGrade !== 'Hepsi') {
                const g = Number(this.selectedAssignmentGrade);
                list = list.filter(a => Number(a.grade) === g);
            }

            // Zaman aralığı filtresi
            if (this.assignmentStartDate) {
                list = list.filter(a => (a.dueDate || a.assignedDate) >= this.assignmentStartDate);
            }
            if (this.assignmentEndDate) {
                list = list.filter(a => (a.dueDate || a.assignedDate) <= this.assignmentEndDate);
            }

            // Arama filtresi
            if (this.assignmentSearchQuery && this.assignmentSearchQuery.trim()) {
                const q = this.assignmentSearchQuery.trim().toLowerCase();
                list = list.filter(a => 
                    (a.title && a.title.toLowerCase().includes(q)) ||
                    (a.description && a.description.toLowerCase().includes(q)) ||
                    (a.unit && a.unit.toLowerCase().includes(q))
                );
            }

            // Tarihe göre gün be gün sıralama (En yakın teslim tarihi en üstte)
            return list.sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));
        },

        getAssignmentDateGroups() {
            const list = this.getFilteredAssignments();
            const groups = {};
            list.forEach(item => {
                const dateKey = item.dueDate || item.assignedDate || 'Tarihsiz';
                if (!groups[dateKey]) {
                    groups[dateKey] = [];
                }
                groups[dateKey].push(item);
            });
            return Object.keys(groups).sort().map(date => ({
                date: date,
                formattedDate: this.formatAssignmentDate(date),
                items: groups[date]
            }));
        },

        formatAssignmentDate(dateStr) {
            if (!dateStr || dateStr === 'Tarihsiz') return 'Belirtilmemiş';
            const parts = dateStr.split('-');
            if (parts.length < 3) return dateStr;
            const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
            const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
            const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
            return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} ${days[d.getDay()]}`;
        },

        openPrintReportModal() {
            this.reportClassId = this.selectedClassId || '5A';
            if (!this.reportEndDate) this.reportEndDate = new Date().toISOString().slice(0, 10);
            if (!this.reportStartDate) {
                this.reportStartDate = '2026-09-01';
            }
            this.isPrintReportModalOpen = true;
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },

        getReportHomeworkDates() {
            const clsId = this.reportClassId;
            const start = this.reportStartDate;
            const end = this.reportEndDate;
            const list = (this.data.homeworkDays || []).filter(h => {
                if (h.classId !== clsId) return false;
                if (start && h.date < start) return false;
                if (end && h.date > end) return false;
                return true;
            });
            return list.sort((a, b) => a.date.localeCompare(b.date));
        },

        getReportStudents() {
            return (this.data.students || []).filter(s => s.classId === this.reportClassId).sort((a, b) => (Number(a.no) || 0) - (Number(b.no) || 0));
        },

        getStudentGradeForDate(studentId, date) {
            const session = (this.data.homeworkDays || []).find(h => h.classId === this.reportClassId && h.date === date);
            if (session && session.grades && session.grades[studentId]) {
                return session.grades[studentId];
            }
            return { score: '', note: '' };
        },

        getReportStudentStats(studentId) {
            const dates = this.getReportHomeworkDates();
            let total = 0;
            let stars = 0, full = 0, half = 0, zero = 0, absent = 0;
            dates.forEach(d => {
                const g = d.grades ? d.grades[studentId] : null;
                if (g && g.score !== undefined && g.score !== '') {
                    const s = String(g.score).toUpperCase();
                    if (s === '4') { stars++; total += 4; }
                    else if (s === '2') { full++; total += 2; }
                    else if (s === '1') { half++; total += 1; }
                    else if (s === '0') { zero++; }
                    else if (s === 'G') { absent++; }
                }
            });
            const classPercent = dates.length > 0 ? Math.round((total / (dates.length * 4)) * 100) : 0;
            return { total, stars, full, half, zero, absent, count: dates.length, percent: classPercent };
        },

        printDetailedReport() {
            const printContent = document.getElementById('printableReportArea');
            if (!printContent) return;
            const win = window.open('', '_blank', 'width=1100,height=800');
            win.document.write(`
                <html>
                <head>
                    <title>Rotalı Fenci - Detaylı Ödev Takip Çizelgesi (${this.reportClassId})</title>
                    <style>
                        @page { size: landscape; margin: 10mm; }
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #000; margin: 0; padding: 15px; font-size: 11px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                        th, td { border: 1px solid #94a3b8; padding: 5px 6px; text-align: center; }
                        th { background: #e2e8f0; font-weight: 800; font-size: 10px; }
                        .text-left { text-align: left; }
                        .score-star { font-weight: bold; color: #b45309; }
                        .score-full { font-weight: bold; color: #15803d; }
                        .score-half { font-weight: bold; color: #d97706; }
                        .score-zero { font-weight: bold; color: #b91c1c; }
                        .score-absent { font-weight: bold; color: #64748b; }
                        .header-box { text-align: center; border-bottom: 2px solid #dc2626; padding-bottom: 8px; margin-bottom: 12px; }
                        .summary-box { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 11px; font-weight: bold; }
                    </style>
                </head>
                <body>
                    ${printContent.innerHTML}
                </body>
                </html>
            `);
            win.document.close();
            win.focus();
            setTimeout(() => {
                win.print();
                win.close();
            }, 300);
        },

        printClassHomeworkReport() {
            this.openPrintReportModal();
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
                room: existing?.room || (existing?.classId ? existing.classId + ' Sınıfı' : 'Sınıf')
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
                '7/A': { subject: 'Fen Bilimleri', topic: 'Hücre, Organeller ve Mitoz Bölünme', code: 'FB.7.2.1.1', desc: 'Bitki ve hayvan hücrelerini organelleri bakımından karşılaştırır; hücre-doku-organ-sistem ilişkisini modeller.', room: '5/A Sınıfı' },
                '7/B': { subject: 'Fen Bilimleri', topic: 'Hücre, Organeller ve Mayoz Bölünme', code: 'FB.7.2.1.1', desc: 'Bitki ve hayvan hücrelerini karşılaştırır; mitoz ve mayoz bölünmenin canlılar için önemini açıklar.', room: '5/A Sınıfı' },
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
                '7/A': { subject: 'Fen Bilimleri', topic: 'Uzay Çağı & Uzay Araştırmaları', code: 'FB.7.1.1', desc: 'Uzay araştırmaları için geliştirilen teknolojileri karşılaştırabilme', room: '5/A Sınıfı' },
                '7/B': { subject: 'Fen Bilimleri', topic: 'Uzay Çağı & Gözlem Araçları', code: 'FB.7.1.1', desc: 'Uzay araştırmaları için geliştirilen teknolojileri karşılaştırabilme; gözlem araçlarını modelleme', room: '5/A Sınıfı' },
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
            window.StorageManager.saveData(this.data);
            this.showToast(`Nöbet günü ${day} olarak belirlendi! 🛡️`);
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },

        setDutyArea(area) {
            if (!this.data.teacher) this.data.teacher = {};
            this.data.teacher.dutyArea = area;
            window.StorageManager.saveData(this.data);
            this.showToast(`Nöbet yeri ${area} olarak belirlendi! 📍`);
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },

        getDutyForWeek(weekNo) {
            if (!weekNo || weekNo < 1) weekNo = 1;
            const rot = this.dutyRotation || ['Kat-2', 'Kat-2', 'Kat-3', 'Kat-3', 'Bahçe', 'Zemin', 'Kat-1'];
            const idx = (weekNo - 1) % rot.length;
            return rot[idx];
        },

        saveDutyDay() {
            window.StorageManager.saveData(this.data);
            this.showToast(`Nöbet bilgisi (${this.data.teacher?.dutyDay || 'Cuma'} - ${this.data.teacher?.dutyArea || 'Kat-2'}) güncellendi! 🛡️`);
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
                '7/A': { subject: 'Fen Bilimleri', topic: 'Uzay Çağı & Uzay Araştırmaları', code: 'FB.7.1.1', desc: 'Uzay araştırmaları için geliştirilen teknolojileri karşılaştırabilme', room: '5/A Sınıfı' },
                '7/B': { subject: 'Fen Bilimleri', topic: 'Uzay Çağı & Gözlem Araçları', code: 'FB.7.1.1', desc: 'Uzay araştırmaları için geliştirilen teknolojileri karşılaştırabilme; gözlem araçlarını modelleme', room: '5/A Sınıfı' },
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
                room: '5/A Sınıfı'
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
            } else if (action === 'new-assignment') {
                this.openNewAssignmentModal();
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
            const storageKey = 'rotali_annual_plan_notes';
            try {
                this.annualPlanNotes = JSON.parse(localStorage.getItem(storageKey) || '{}');
            } catch (e) {
                this.annualPlanNotes = {};
            }
            const key = `${this.selectedAnnualPlanGrade}_${this.selectedAnnualPlanWeekIndex + 1}`;
            this.activeWeekNote = this.annualPlanNotes[key] || '';
        },

        saveCurrentWeekNote() {
            const storageKey = 'rotali_annual_plan_notes';
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

        // ==========================================
        
        
        // ==========================================
        // 📑 GÜNLÜK PLAN YÖNETİCİSİ (5, 6, 7, 8 & 37 HAFTA)
        // ==========================================
        getGradeCurriculum(grade = null) {
            const g = String(grade || this.selectedDailyPlanGrade || 5);
            return (window.AnnualPlanData && window.AnnualPlanData[g]) || (this.annualPlanData && this.annualPlanData[g]) || [];
        },
        getDailyPlanCurrentWeek(grade = null) {
            const g = grade || this.selectedDailyPlanGrade || 5;
            const weeks = this.getGradeCurriculum(g);
            if (!weeks || !weeks.length) return null;
            const idx = Math.min(Math.max(0, this.selectedDailyPlanWeekIndex), weeks.length - 1);
            return weeks[idx];
        },
        prevDailyPlanWeek() {
            if (this.selectedDailyPlanWeekIndex > 0) {
                this.selectedDailyPlanWeekIndex--;
                this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
            }
        },
        nextDailyPlanWeek() {
            const weeks = this.getGradeCurriculum(this.selectedDailyPlanGrade);
            if (this.selectedDailyPlanWeekIndex < (weeks.length - 1)) {
                this.selectedDailyPlanWeekIndex++;
                this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
            }
        },
        setDailyPlanWeek(index) {
            this.selectedDailyPlanWeekIndex = Number(index) || 0;
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },
        getDailyLessonsForWeek(grade, weekIdx) {
            const g = grade || this.selectedDailyPlanGrade || 5;
            const w = this.getDailyPlanCurrentWeek(g);
            if (!w) return [];
            
            const key = this.getWeekKey(g, weekIdx);
            const custom = this.customDailyPlans[key] || {};

            const outc = (w.outcomesList && w.outcomesList[0]) || { code: w.outcomeCode || `FB.${g}.`, desc: w.outcome || w.outcomeDesc || '' };
            const proc = (w.processList && w.processList.length) ? w.processList.join(' ') : (w.process || '');

            return [
                {
                    lessonNo: 1,
                    title: "1. Ders: Giriş & Merak Uyandırma (Ön Bilgi & Problem Durumu)",
                    focus: "Ön Bilgileri Harekete Geçirme & Günlük Yaşam Bağlantısı",
                    intro: custom.l1_intro || `Derse ${w.topic} ile ilgili günlük yaşamdan merak uyandırıcı soru, görsel veya kısa video ile başlanır. Öğrencilerin ön bilgileri yoklanır.`,
                    activity: custom.l1_act || `Öğrencilere problem durumu sunulur. ${outc.code} kapsamında dikkat çekici bir örnek tartışmaya açılır.`,
                    materials: custom.materials || "Akıllı Tahta, EBA Görselleri, Ders Kitabı",
                    evaluation: "Ön değerlendirme soru-cevap oturumu."
                },
                {
                    lessonNo: 2,
                    title: "2. Ders: Keşfetme & Deney / Model Uygulaması",
                    focus: "Uygulamalı Grup Çalışması & Deney / Simülasyon Süreci",
                    intro: custom.l2_intro || "Deney ve model etkinliği için laboratuvar/sınıf kuralları hatırlatılır, malzeme setleri dağıtılır.",
                    activity: custom.l2_act || (proc ? `Etkinlik Süreci: ${proc.substring(0, 180)}... Öğrenciler gruplar halinde modeli kurar ve gözlem verilerini kaydeder.` : "Öğrenciler 4'erli gruplar halinde deney ve modelleme çalışmasını yürütür."),
                    materials: custom.materials || "Etkinlik Defteri, Deney Malzemeleri, Model Hamuru / Küreler",
                    evaluation: "Grup çalışma formu ve deney gözlem çizelgesi kontrolü."
                },
                {
                    lessonNo: 3,
                    title: "3. Ders: Açıklama & Bilimsel Kavram İnşası",
                    focus: "Verilerin Analizi, Kavram Haritası & Bilimsel Çıkarım",
                    intro: custom.l3_intro || "Grupların deney ve gözlem sonuçları tahtada toplanır, karşılaştırmalı analiz yapılır.",
                    activity: custom.l3_act || `Öğretmen rehberliğinde ${w.topic} konusundaki temel bilimsel ilkeler yapılandırılır. Kavram haritası ve defter notları tamamlanır.`,
                    materials: custom.materials || "Ders Defteri, Kavram Haritaları, Çalışma Yaprağı",
                    evaluation: "Kavram yanılgısı tespit soruları ve sözlü pekiştirme."
                },
                {
                    lessonNo: 4,
                    title: "4. Ders: Derinleştirme, Değerlendirme & Ödev",
                    focus: "Kazanım Pekiştirme, Çıkış Kartı & Beceri Temelli Sorular",
                    intro: custom.l4_intro || "Önceki 3 dersin özetlenmesi ve MEB/LGS tarzı örnek soru çözümü ile derse başlanır.",
                    activity: custom.l4_act || "Öğrenciler bireysel olarak değerlendirme sorularını çözer. Çıkış kartı (3 soruluk mini test) uygulanır. Haftalık etkinlik defteri ödevi verilir.",
                    materials: custom.materials || "Soru Bankası, Çıkış Kartları, Ödev Çalışma Sayfaları",
                    evaluation: custom.evaluation || `Ödev: ${w.unit} - ${w.topic} etkinlik defteri soruları tamamlanacak.`
                }
            ];
        },
        openEditWeeklyDailyPlan() {
            const g = this.selectedDailyPlanGrade || 5;
            const w = this.getDailyPlanCurrentWeek(g);
            if (!w) {
                this.showToast("Lütfen geçerli bir hafta seçiniz.");
                return;
            }
            const key = this.getWeekKey(g, this.selectedDailyPlanWeekIndex);
            const custom = this.customDailyPlans[key] || {};
            const outc = (w.outcomesList && w.outcomesList[0]) || { code: w.outcomeCode || `FB.${g}.`, desc: w.outcome || '' };

            this.dailyPlanForm = {
                id: key,
                grade: g,
                weekIndex: this.selectedDailyPlanWeekIndex,
                weekTitle: w.week,
                date: w.date,
                unit: w.unit,
                topic: w.topic,
                outcomeCode: outc.code,
                outcomeDesc: outc.desc,
                methods: custom.methods || 'Model Oluşturma, Deney & Gözlem, Soru-Cevap, Akran Öğrenmesi',
                materials: custom.materials || 'Ders Kitabı, Etkinlik Defteri, Akıllı Tahta, Deney Seti',
                intro: custom.l1_intro || `Derse ${w.topic} ile ilgili günlük yaşamdan merak uyandırıcı soru ve video ile başlanır.`,
                development: custom.l2_act || (w.process || 'Grup etkinliği, model/deney uygulaması ile kavram inşası yürütülür.'),
                summary: custom.l3_act || 'Kavram haritası ve özet notlar oluşturulur.',
                evaluation: custom.evaluation || `Ders sonu çıkış kartı ve ${w.topic} etkinlik defteri ödevlendirmesi yapılır.`,
                notes: custom.notes || ''
            };
            this.isDailyPlanModalOpen = true;
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },
        saveCustomWeeklyDailyPlan() {
            const key = this.dailyPlanForm.id || this.getWeekKey();
            if (!this.customDailyPlans[key]) {
                this.customDailyPlans[key] = {};
            }
            this.customDailyPlans[key].methods = this.dailyPlanForm.methods;
            this.customDailyPlans[key].materials = this.dailyPlanForm.materials;
            this.customDailyPlans[key].l1_intro = this.dailyPlanForm.intro;
            this.customDailyPlans[key].l2_act = this.dailyPlanForm.development;
            this.customDailyPlans[key].l3_act = this.dailyPlanForm.summary;
            this.customDailyPlans[key].evaluation = this.dailyPlanForm.evaluation;
            this.customDailyPlans[key].notes = this.dailyPlanForm.notes;

            localStorage.setItem('rotali_custom_daily_plans', JSON.stringify(this.customDailyPlans));
            this.isDailyPlanModalOpen = false;
            this.showToast("Bu haftanın günlük planı kaydedildi! 📑");
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },
        printWeeklyDailyPlanInteractive(grade = null) {
            const g = grade || this.selectedDailyPlanGrade || 5;
            const w = this.getDailyPlanCurrentWeek(g);
            if (!w) return;
            const lessons = this.getDailyLessonsForWeek(g, this.selectedDailyPlanWeekIndex);
            const outc = (w.outcomesList && w.outcomesList[0]) || { code: w.outcomeCode || `FB.${g}.`, desc: w.outcome || '' };

            const lessonsHtml = lessons.map(l => `
                <div style="border: 1px solid #333; padding: 10px; border-radius: 6px; margin-bottom: 12px; background: #fafafa;">
                    <div style="font-weight: bold; font-size: 13px; color: #004d40; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 6px;">
                        ${l.title}
                    </div>
                    <div style="font-size: 11px; margin-bottom: 4px;"><strong>Odak & Amaç:</strong> ${l.focus}</div>
                    <div style="font-size: 11px; margin-bottom: 4px;"><strong>Giriş & Süreç:</strong> ${l.intro}</div>
                    <div style="font-size: 11px; margin-bottom: 4px;"><strong>Etkinlik / Deney:</strong> ${l.activity}</div>
                    <div style="font-size: 11px; margin-bottom: 4px;"><strong>Materyal:</strong> ${l.materials}</div>
                    <div style="font-size: 11px;"><strong>Ölçme / Ödev:</strong> ${l.evaluation}</div>
                </div>
            `).join('');

            const html = `
                <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.4; color: #111;">
                    <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 8px; margin-bottom: 12px;">
                        <h2 style="margin: 0; font-size: 16px;">T.C. MİLLÎ EĞİTİM BAKANLIĞI</h2>
                        <h3 style="margin: 4px 0; font-size: 15px;">TÜRKİYE YÜZYILI MAARİF MODELİ HAFTALIK DERS / GÜNLÜK PLAN AKIŞI</h3>
                        <p style="margin: 0; font-size: 11px; color: #555;">2026-2027 Eğitim-Öğretim Yılı • Fen Bilimleri Dersi • ${g}. Sınıf</p>
                    </div>

                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 11px;">
                        <tr>
                            <td style="border: 1px solid #333; padding: 5px; font-weight: bold; width: 18%; background: #f0f0f0;">Sınıf / Şube:</td>
                            <td style="border: 1px solid #333; padding: 5px;">${g}. Sınıf</td>
                            <td style="border: 1px solid #333; padding: 5px; font-weight: bold; width: 18%; background: #f0f0f0;">Hafta / Tarih:</td>
                            <td style="border: 1px solid #333; padding: 5px;">${w.week} (${w.date}) • ${w.hours || '4 Saat'}</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #333; padding: 5px; font-weight: bold; background: #f0f0f0;">Tema / Ünite:</td>
                            <td colspan="3" style="border: 1px solid #333; padding: 5px;">${w.unit}</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #333; padding: 5px; font-weight: bold; background: #f0f0f0;">Konu:</td>
                            <td colspan="3" style="border: 1px solid #333; padding: 5px; font-weight: bold;">${w.topic}</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #333; padding: 5px; font-weight: bold; background: #f0f0f0;">Kazanım:</td>
                            <td colspan="3" style="border: 1px solid #333; padding: 5px;"><strong>${outc.code}:</strong> ${outc.desc}</td>
                        </tr>
                    </table>

                    <div style="margin-bottom: 10px;">
                        <h4 style="margin: 0 0 8px 0; font-size: 12px; color: #004d40;">DERS SAATLERİ AKIŞ VE ETKİNLİK PLANI (4 DERS SAATİ):</h4>
                        ${lessonsHtml}
                    </div>

                    <table style="width: 100%; margin-top: 25px; font-size: 11px; text-align: center;">
                        <tr>
                            <td style="width: 50%;">
                                <strong>Murat Kundakcı</strong><br>
                                Fen Bilimleri Öğretmeni
                            </td>
                            <td style="width: 50%;">
                                <strong>Okul Müdürü</strong><br>
                                Uygundur / Onay
                            </td>
                        </tr>
                    </table>
                </div>
            `;
            window.Exporter.printContent(`${g}. Sınıf ${w.week} Günlük Ders Planı`, html);
        },


        
        // ==========================================
        // 📎 GÜNLÜK PLAN DOSYA EKLEME & MAARİF BİLGİ ÇEKME
        // ==========================================
        getWeekKey(grade = null, weekIdx = null) {
            const g = grade || this.selectedDailyPlanGrade || 5;
            const w = this.getDailyPlanCurrentWeek(g);
            const wNo = w?.weekNo || ((weekIdx !== null ? weekIdx : this.selectedDailyPlanWeekIndex) + 1);
            return `dp_${g}_${wNo}`;
        },
        getWeekAttachedFiles(grade = null, weekIdx = null) {
            const key = this.getWeekKey(grade, weekIdx);
            return (this.customDailyPlans[key] && this.customDailyPlans[key].attachedFiles) || [];
        },
        handleDailyPlanFileUpload(event) {
            const files = event.target.files;
            if (!files || !files.length) return;
            const key = this.getWeekKey();
            if (!this.customDailyPlans[key]) {
                this.customDailyPlans[key] = {};
            }
            if (!this.customDailyPlans[key].attachedFiles) {
                this.customDailyPlans[key].attachedFiles = [];
            }

            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.customDailyPlans[key].attachedFiles.push({
                        id: 'file_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 4),
                        name: file.name,
                        size: (file.size / 1024).toFixed(1) + ' KB',
                        type: file.type || 'application/octet-stream',
                        dataUrl: e.target.result,
                        uploadDate: new Date().toISOString().slice(0, 10)
                    });
                    localStorage.setItem('rotali_custom_daily_plans', JSON.stringify(this.customDailyPlans));
                    this.showToast(`"${file.name}" günlük plana eklendi! 📎`);
                    this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
                };
                reader.readAsDataURL(file);
            });
            event.target.value = '';
        },
        deleteAttachedFile(fileId) {
            if (!confirm("Bu ekli dosyayı silmek istediğinize emin misiniz?")) return;
            const key = this.getWeekKey();
            if (this.customDailyPlans[key] && this.customDailyPlans[key].attachedFiles) {
                this.customDailyPlans[key].attachedFiles = this.customDailyPlans[key].attachedFiles.filter(f => f.id !== fileId);
                localStorage.setItem('rotali_custom_daily_plans', JSON.stringify(this.customDailyPlans));
                this.showToast("Dosya kaldırıldı. 🗑️");
            }
        },
        downloadAttachedFile(file) {
            const a = document.createElement('a');
            a.href = file.dataUrl;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        },
        pullFromAnnualPlanToDailyPlan() {
            const g = this.selectedDailyPlanGrade || 5;
            const w = this.getDailyPlanCurrentWeek(g);
            if (!w) {
                this.showToast("Haftalık plan verisi bulunamadı!");
                return;
            }
            const key = this.getWeekKey(g, this.selectedDailyPlanWeekIndex);
            if (!this.customDailyPlans[key]) this.customDailyPlans[key] = {};

            const outc = (w.outcomesList && w.outcomesList[0]) || { code: w.outcomeCode || `FB.${g}.`, desc: w.outcome || '' };
            const proc = (w.processList && w.processList.length) ? w.processList.join(' ') : (w.process || '');

            const methods = 'Model Oluşturma, Deney & Gözlem, Soru-Cevap, Akran Öğrenmesi';
            const materials = `Ders Kitabı, Etkinlik Defteri, Akıllı Tahta, ${w.topic} Deney Seti`;
            const intro = `Derse "${w.topic}" konusu ile ilgili günlük yaşamdan problem durumu ve merak uyandırıcı soru/video ile başlanır.`;
            const act = proc ? `Süreç Bileşeni: ${proc}` : `${outc.code} (${outc.desc}) kapsamında grup deney ve modelleme çalışması yürütülür.`;
            const summary = `"${w.topic}" konusundaki temel bilimsel kavramlar yapılandırılır, kavram haritası ve özet çıkarılır.`;
            const evalStr = `Çıkış kartı değerlendirmesi ve ${w.topic} etkinlik defteri ödevi tamamlanır.`;
            const notes = `Yıllık plandan çekildi: ${w.values ? 'Değerler: ' + w.values : ''} ${w.skills ? 'Beceriler: ' + w.skills : ''}`;

            this.customDailyPlans[key].methods = methods;
            this.customDailyPlans[key].materials = materials;
            this.customDailyPlans[key].l1_intro = intro;
            this.customDailyPlans[key].l2_act = act;
            this.customDailyPlans[key].l3_act = summary;
            this.customDailyPlans[key].evaluation = evalStr;
            this.customDailyPlans[key].notes = notes;

            if (this.dailyPlanForm) {
                this.dailyPlanForm.methods = methods;
                this.dailyPlanForm.materials = materials;
                this.dailyPlanForm.intro = intro;
                this.dailyPlanForm.development = act;
                this.dailyPlanForm.summary = summary;
                this.dailyPlanForm.evaluation = evalStr;
                this.dailyPlanForm.notes = notes;
            }

            localStorage.setItem('rotali_custom_daily_plans', JSON.stringify(this.customDailyPlans));
            this.showToast("📋 Maarif Yıllık Plan bilgileri günlük plana aktarıldı! ✨");
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },

        // 📱 MOBİL & YÖNETİM MENÜSÜ YÖNETİCİSİ (CRUD)
        // ==========================================
        get navSectionsList() {
            return this.data.navSections || [];
        },
        get visibleNavSections() {
            return (this.data.navSections || []).filter(s => s.visible !== false);
        },
        toggleMobileMenu() {
            this.isMobileMenuOpen = !this.isMobileMenuOpen;
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },
        closeMobileMenu() {
            this.isMobileMenuOpen = false;
        },
        openMenuManager() {
            this.isMenuManagerModalOpen = true;
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },
        moveSection(index, direction) {
            const list = this.data.navSections;
            if (!list) return;
            const newIndex = index + direction;
            if (newIndex < 0 || newIndex >= list.length) return;
            const temp = list[index];
            list[index] = list[newIndex];
            list[newIndex] = temp;
            window.StorageManager.saveData(this.data);
            this.showToast("Menü sırası güncellendi! ↕️");
        },
        toggleSectionVisibility(sec) {
            sec.visible = sec.visible === false ? true : false;
            window.StorageManager.saveData(this.data);
            this.showToast(sec.visible ? `${sec.title} menüde gösterildi 👁️` : `${sec.title} menüden gizlendi 🙈`);
        },
        openAddSection() {
            this.newSectionForm = {
                title: '',
                icon: 'folder',
                color: 'blue',
                badge: 'Yeni',
                description: ''
            };
            this.isAddSectionModalOpen = true;
        },
        saveNewSection() {
            if (!this.newSectionForm.title.trim()) {
                alert("Lütfen bölüm adını yazınız!");
                return;
            }
            const secId = 'sec_' + Date.now().toString(36);
            const newSec = {
                id: secId,
                title: this.newSectionForm.title.trim(),
                icon: this.newSectionForm.icon || 'folder',
                color: this.newSectionForm.color || 'blue',
                badge: this.newSectionForm.badge ? this.newSectionForm.badge.trim() : '',
                visible: true,
                isSystem: false,
                description: this.newSectionForm.description || ''
            };
            if (!this.data.navSections) this.data.navSections = [];
            this.data.navSections.push(newSec);

            if (!this.data.customSections) this.data.customSections = [];
            this.data.customSections.push({
                id: secId,
                title: newSec.title,
                icon: newSec.icon,
                color: newSec.color,
                badge: newSec.badge,
                description: newSec.description,
                items: []
            });

            window.StorageManager.saveData(this.data);
            this.isAddSectionModalOpen = false;
            this.currentTab = secId;
            this.showToast(`"${newSec.title}" bölümü eklendi ve açıldı! 🎉`);
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },
        openEditSection(sec) {
            this.editingSection = JSON.parse(JSON.stringify(sec));
            this.isEditSectionModalOpen = true;
        },
        saveEditSection() {
            if (!this.editingSection.title.trim()) {
                alert("Lütfen bölüm adını yazınız!");
                return;
            }
            const sec = (this.data.navSections || []).find(s => s.id === this.editingSection.id);
            if (sec) {
                sec.title = this.editingSection.title.trim();
                sec.icon = this.editingSection.icon || sec.icon;
                sec.color = this.editingSection.color || sec.color;
                sec.badge = this.editingSection.badge ? this.editingSection.badge.trim() : '';
            }
            const custom = (this.data.customSections || []).find(s => s.id === this.editingSection.id);
            if (custom) {
                custom.title = this.editingSection.title.trim();
                custom.icon = this.editingSection.icon || custom.icon;
                custom.color = this.editingSection.color || custom.color;
                custom.description = this.editingSection.description || '';
            }
            window.StorageManager.saveData(this.data);
            this.isEditSectionModalOpen = false;
            this.showToast("Bölüm başarıyla güncellendi! ✅");
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },
        deleteSection(sec) {
            if (sec.isSystem) {
                alert("Sistem varsayılan bölümleri silinemez, dilerseniz gizleyebilirsiniz.");
                return;
            }
            if (!confirm(`"${sec.title}" bölümünü ve içindeki tüm kayıtları silmek istediğinize emin misiniz?`)) {
                return;
            }
            this.data.navSections = (this.data.navSections || []).filter(s => s.id !== sec.id);
            this.data.customSections = (this.data.customSections || []).filter(s => s.id !== sec.id);
            if (this.currentTab === sec.id) {
                this.currentTab = 'calendar-tasks';
            }
            window.StorageManager.saveData(this.data);
            this.showToast(`"${sec.title}" bölümü silindi. 🗑️`);
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },
        resetNavSections() {
            if (!confirm("Tüm yönetim menüsü sıralaması ve varsayılan bölümler fabrika ayarlarına sıfırlansın mı?")) return;
            this.data.navSections = JSON.parse(JSON.stringify(window.InitialData.navSections || []));
            window.StorageManager.saveData(this.data);
            this.showToast("Menü düzeni varsayılana sıfırlandı! 🔄");
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },

        // ==========================================
        // 📦 ÖZEL BÖLÜMLER İÇERİK YÖNETİCİSİ (CRUD)
        // ==========================================
        isCustomSection(tabId) {
            return (this.data.customSections || []).some(s => s.id === tabId);
        },
        getCustomSection(tabId) {
            return (this.data.customSections || []).find(s => s.id === tabId) || { id: tabId, title: 'Özel Bölüm', items: [] };
        },
        openAddCustomItem(sectionId) {
            this.isEditCustomItem = false;
            this.customItemForm = {
                id: 'item_' + Date.now().toString(36),
                sectionId: sectionId,
                title: '',
                category: 'Genel',
                count: '',
                status: 'Aktif',
                note: '',
                date: new Date().toISOString().slice(0, 10)
            };
            this.isCustomItemModalOpen = true;
        },
        openEditCustomItem(sectionId, item) {
            this.isEditCustomItem = true;
            this.customItemForm = {
                id: item.id,
                sectionId: sectionId,
                title: item.title || '',
                category: item.category || 'Genel',
                count: item.count || '',
                status: item.status || 'Aktif',
                note: item.note || '',
                date: item.date || new Date().toISOString().slice(0, 10)
            };
            this.isCustomItemModalOpen = true;
        },
        saveCustomItem() {
            if (!this.customItemForm.title.trim()) {
                alert("Lütfen bir başlık giriniz!");
                return;
            }
            const sec = (this.data.customSections || []).find(s => s.id === this.customItemForm.sectionId);
            if (!sec) return;
            if (!sec.items) sec.items = [];

            if (this.isEditCustomItem) {
                const idx = sec.items.findIndex(it => it.id === this.customItemForm.id);
                if (idx !== -1) {
                    sec.items[idx] = { ...this.customItemForm };
                }
            } else {
                sec.items.unshift({ ...this.customItemForm });
            }
            window.StorageManager.saveData(this.data);
            this.isCustomItemModalOpen = false;
            this.showToast("Kayıt başarıyla kaydedildi! 💾");
        },
        deleteCustomItem(sectionId, itemId) {
            if (!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;
            const sec = (this.data.customSections || []).find(s => s.id === sectionId);
            if (sec && sec.items) {
                sec.items = sec.items.filter(it => it.id !== itemId);
                window.StorageManager.saveData(this.data);
                this.showToast("Kayıt silindi! 🗑️");
            }
        },

        // ==========================================
        // 👨‍🎓 ÖĞRENCİ DÜZENLEME & SİLME (CRUD)
        // ==========================================
        openEditStudent(st) {
            this.editingStudent = {
                id: st.id,
                name: st.name || '',
                no: st.no || '',
                classId: st.classId || this.selectedClassId,
                notes: st.notes || '',
                avatar: st.avatar || '👨‍🎓'
            };
            this.isEditStudentModalOpen = true;
        },
        saveEditStudent() {
            if (!this.editingStudent.name.trim()) {
                alert("Lütfen öğrenci adını giriniz!");
                return;
            }
            const idx = (this.data.students || []).findIndex(s => s.id === this.editingStudent.id);
            if (idx !== -1) {
                this.data.students[idx].name = this.editingStudent.name.trim();
                this.data.students[idx].no = Number(this.editingStudent.no) || this.data.students[idx].no;
                this.data.students[idx].classId = this.editingStudent.classId;
                this.data.students[idx].notes = this.editingStudent.notes;
                this.data.students[idx].avatar = this.editingStudent.avatar;
                
                // Sırala
                this.data.students.sort((a, b) => (Number(a.no) || 0) - (Number(b.no) || 0));
                window.StorageManager.saveData(this.data);
                this.isEditStudentModalOpen = false;
                this.showToast(`${this.editingStudent.name} başarıyla güncellendi! ✅`);
            }
        },
        confirmDeleteStudent(st) {
            if (!confirm(`"${st.no} - ${st.name}" öğrencisini silmek istediğinize emin misiniz?`)) return;
            this.deleteStudent(st);
            this.showToast(`${st.name} silindi. 🗑️`);
        },

        // ==========================================
        // 🚀 PROJE TAKVİMİ DÜZENLEME & SİLME (CRUD)
        // ==========================================
        openEditProjCal(p) {
            this.editingProjCal = {
                id: p.id,
                title: p.title || '',
                category: p.category || 'TÜBİTAK',
                targetProject: p.targetProject || '',
                startDate: p.startDate || '',
                deadline: p.deadline || '',
                status: p.status || 'Planlandı',
                priority: p.priority || 'Yüksek',
                notes: p.notes || ''
            };
            this.isEditProjCalModalOpen = true;
        },
        saveEditProjCal() {
            if (!this.editingProjCal.title.trim()) {
                alert("Lütfen proje başlığı giriniz!");
                return;
            }
            const idx = (this.data.projectCalendar || []).findIndex(p => p.id === this.editingProjCal.id);
            if (idx !== -1) {
                this.data.projectCalendar[idx] = { ...this.editingProjCal };
                window.StorageManager.saveData(this.data);
                this.isEditProjCalModalOpen = false;
                this.showToast("Proje kaydı güncellendi! ✅");
            }
        },
        deleteProjCal(pId) {
            if (!confirm("Bu projeyi takvimden silmek istediğinize emin misiniz?")) return;
            this.data.projectCalendar = (this.data.projectCalendar || []).filter(p => p.id !== pId);
            window.StorageManager.saveData(this.data);
            this.showToast("Proje takvimden silindi. 🗑️");
        },

        // ==========================================
        // 📋 MAARİF YILLIK PLAN DÜZENLEME (CRUD)
        // ==========================================
        openAddCurriculum(grade) {
            this.curriculumForm = {
                grade: grade || this.selectedAnnualPlanGrade || 5,
                weekNo: (this.getGradeCurriculum(grade).length + 1) || 1,
                dateRange: 'Yeni Hafta',
                unit: 'Fen Bilimleri Ünitesi',
                outcomeCode: `FB.${grade || 5}.`,
                outcomeTitle: '',
                activities: '',
                notes: ''
            };
            this.isAddCurriculumModalOpen = true;
        },
        openEditCurriculum(grade, item) {
            this.curriculumForm = {
                grade: grade || this.selectedAnnualPlanGrade || 5,
                weekNo: item.weekNo || 1,
                dateRange: item.dateRange || '',
                unit: item.unit || '',
                outcomeCode: item.outcomeCode || '',
                outcomeTitle: item.outcomeTitle || '',
                activities: item.activities || '',
                notes: item.notes || ''
            };
            this.isEditCurriculumModalOpen = true;
        },
        saveCurriculumWeek() {
            if (!this.curriculumForm.outcomeTitle.trim()) {
                alert("Lütfen kazanım veya konu başlığını giriniz!");
                return;
            }
            const g = this.curriculumForm.grade;
            if (!this.curriculumData[g]) this.curriculumData[g] = [];
            
            const existingIdx = this.curriculumData[g].findIndex(w => w.weekNo === this.curriculumForm.weekNo);
            if (existingIdx !== -1) {
                this.curriculumData[g][existingIdx] = { ...this.curriculumForm };
            } else {
                this.curriculumData[g].push({ ...this.curriculumForm });
                this.curriculumData[g].sort((a, b) => a.weekNo - b.weekNo);
            }
            // Kaydet
            localStorage.setItem(`rotali_curriculum_${g}`, JSON.stringify(this.curriculumData[g]));
            this.isAddCurriculumModalOpen = false;
            this.isEditCurriculumModalOpen = false;
            this.showToast("Yıllık plan haftası kaydedildi! 📋");
        },
        deleteCurriculumWeek(grade, weekNo) {
            if (!confirm(`${weekNo}. Hafta kazanımını silmek istediğinize emin misiniz?`)) return;
            if (this.curriculumData[grade]) {
                this.curriculumData[grade] = this.curriculumData[grade].filter(w => w.weekNo !== weekNo);
                localStorage.setItem(`rotali_curriculum_${grade}`, JSON.stringify(this.curriculumData[grade]));
                this.showToast("Kazanım planı silindi. 🗑️");
            }
        },

        
        // ================= ⏰ DERS SAATLERİ & ZAMANLARI YÖNETİMİ =================
        openLessonPeriodsModal() {
            const periods = (this.data.lessonPeriods && this.data.lessonPeriods.length) 
                ? this.data.lessonPeriods 
                : (window.InitialData.lessonPeriods || []);
            this.tempLessonPeriods = JSON.parse(JSON.stringify(periods));
            this.isLessonPeriodsModalOpen = true;
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },

        saveLessonPeriods() {
            if (!this.tempLessonPeriods || !this.tempLessonPeriods.length) {
                alert('En az 1 ders saati tanımlı olmalıdır!');
                return;
            }
            this.data.lessonPeriods = JSON.parse(JSON.stringify(this.tempLessonPeriods));
            const uid = this.currentUser ? this.currentUser.id : 'admin';
            window.StorageManager.saveData(this.data, uid);
            this.isLessonPeriodsModalOpen = false;
            this.showToast('Ders saatleri ve zamanları başarıyla kaydedildi! ⏰');
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },

        addTempLessonPeriod() {
            const nextNo = (this.tempLessonPeriods.length > 0) 
                ? Math.max(...this.tempLessonPeriods.map(p => p.periodNo)) + 1 
                : 1;
            this.tempLessonPeriods.push({
                periodNo: nextNo,
                label: nextNo + '. Ders',
                time: '15:30 - 16:10'
            });
        },

        removeTempLessonPeriod(index) {
            if (this.tempLessonPeriods.length <= 1) {
                alert('En az 1 ders saati kalmalıdır!');
                return;
            }
            this.tempLessonPeriods.splice(index, 1);
            // Numaraları yeniden sırala
            this.tempLessonPeriods.forEach((p, idx) => {
                p.periodNo = idx + 1;
                p.label = (idx + 1) + '. Ders';
            });
        },

        resetTempLessonPeriods() {
            if (confirm('Ders saatlerini MEB standart varsayılanlarına (08:30-15:15) sıfırlamak istediğinize emin misiniz?')) {
                this.tempLessonPeriods = JSON.parse(JSON.stringify(window.InitialData.lessonPeriods || []));
                this.showToast('Varsayılan ders saatleri yüklendi.');
            }
        },

        // ================= 👥 OKUL TOPLANTILARI YÖNETİMİ =================
        getFilteredMeetings() {
            let list = this.data.meetings || [];
            if (this.meetingFilterType && this.meetingFilterType !== 'all') {
                list = list.filter(m => m.type === this.meetingFilterType);
            }
            if (this.meetingFilterStatus && this.meetingFilterStatus !== 'all') {
                list = list.filter(m => m.status === this.meetingFilterStatus);
            }
            if (this.meetingSearchQuery && this.meetingSearchQuery.trim()) {
                const q = this.meetingSearchQuery.toLowerCase().trim();
                list = list.filter(m => 
                    (m.title && m.title.toLowerCase().includes(q)) ||
                    (m.agenda && m.agenda.toLowerCase().includes(q)) ||
                    (m.decisions && m.decisions.toLowerCase().includes(q)) ||
                    (m.location && m.location.toLowerCase().includes(q)) ||
                    (m.attendees && m.attendees.toLowerCase().includes(q))
                );
            }
            return list;
        },

        openNewMeetingModal() {
            this.isEditMeeting = false;
            this.meetingForm = {
                id: 'meet-' + Date.now(),
                title: '',
                type: 'Öğretmenler Kurulu',
                date: new Date().toISOString().slice(0, 10),
                time: '14:30',
                location: 'Öğretmenler Odası',
                attendees: 'Tüm Öğretmenler',
                agenda: '',
                decisions: '',
                status: 'Yapılacak'
            };
            this.isMeetingModalOpen = true;
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },

        openEditMeetingModal(meeting) {
            this.isEditMeeting = true;
            this.meetingForm = JSON.parse(JSON.stringify(meeting));
            this.isMeetingModalOpen = true;
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },

        saveMeetingForm() {
            if (!this.meetingForm.title || !this.meetingForm.title.trim()) {
                alert('Lütfen toplantı başlığını giriniz!');
                return;
            }

            if (!this.data.meetings) this.data.meetings = [];

            if (this.isEditMeeting) {
                const idx = this.data.meetings.findIndex(m => m.id === this.meetingForm.id);
                if (idx !== -1) {
                    this.data.meetings[idx] = { ...this.meetingForm };
                } else {
                    this.data.meetings.push({ ...this.meetingForm });
                }
                this.showToast('Toplantı bilgileri güncellendi! 👥');
            } else {
                this.data.meetings.unshift({ ...this.meetingForm });
                this.showToast('Yeni toplantı başarıyla eklendi! 👥');
            }

            const uid = this.currentUser ? this.currentUser.id : 'admin';
            window.StorageManager.saveData(this.data, uid);
            this.isMeetingModalOpen = false;
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },

        toggleMeetingStatus(meeting) {
            meeting.status = meeting.status === 'Tamamlandı' ? 'Yapılacak' : 'Tamamlandı';
            const uid = this.currentUser ? this.currentUser.id : 'admin';
            window.StorageManager.saveData(this.data, uid);
            this.showToast(`Toplantı durumu "${meeting.status}" olarak güncellendi.`);
        },

        deleteMeeting(meetingId) {
            if (confirm('Bu toplantı kaydını silmek istediğinize emin misiniz?')) {
                this.data.meetings = (this.data.meetings || []).filter(m => m.id !== meetingId);
                const uid = this.currentUser ? this.currentUser.id : 'admin';
                window.StorageManager.saveData(this.data, uid);
                this.showToast('Toplantı silindi. 🗑️');
            }
        },

        printMeetingList() {
            window.print();
        },

        printMeetingDecisions(meeting) {
            const printWin = window.open('', '_blank');
            const teacherName = this.data.teacher?.name || this.currentUser?.name || 'Murat Kundakcı';
            const schoolName = this.data.teacher?.school || 'Cumhuriyet Ortaokulu';
            const html = `
                <!DOCTYPE html>
                <html lang="tr">
                <head>
                    <meta charset="UTF-8">
                    <title>${meeting.title} - Toplantı Tutanağı</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 30px; color: #111; line-height: 1.6; }
                        h1 { font-size: 18px; text-align: center; margin-bottom: 5px; text-transform: uppercase; }
                        h2 { font-size: 14px; text-align: center; color: #555; margin-top: 0; margin-bottom: 25px; }
                        .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                        .info-table td { border: 1px solid #ccc; padding: 8px 12px; font-size: 12px; }
                        .info-table td.label { font-weight: bold; background-color: #f5f5f5; width: 25%; }
                        .section { margin-bottom: 20px; }
                        .section-title { font-size: 13px; font-weight: bold; border-bottom: 2px solid #333; padding-bottom: 4px; margin-bottom: 8px; text-transform: uppercase; }
                        .content-box { font-size: 12px; white-space: pre-line; background: #fafafa; border: 1px solid #eee; padding: 12px; border-radius: 6px; }
                        .signatures { margin-top: 50px; display: flex; justify-content: space-between; font-size: 12px; }
                        .sig-box { text-align: center; width: 200px; }
                    </style>
                </head>
                <body>
                    <h1>${schoolName}</h1>
                    <h2>${meeting.title} - RESMİ TOPLANTI TUTANAĞI</h2>
                    
                    <table class="info-table">
                        <tr>
                            <td class="label">Toplantı Türü</td>
                            <td>${meeting.type}</td>
                            <td class="label">Tarih / Saat</td>
                            <td>${meeting.date} - ${meeting.time}</td>
                        </tr>
                        <tr>
                            <td class="label">Toplantı Yeri</td>
                            <td>${meeting.location || 'Okul'}</td>
                            <td class="label">Durum</td>
                            <td>${meeting.status}</td>
                        </tr>
                        <tr>
                            <td class="label">Katılımcılar</td>
                            <td colspan="3">${meeting.attendees || 'Tüm Kurul Üyeleri'}</td>
                        </tr>
                    </table>

                    <div class="section">
                        <div class="section-title">1. GÜNDEM MADDELERİ</div>
                        <div class="content-box">${meeting.agenda || 'Gündem maddesi belirtilmemiştir.'}</div>
                    </div>

                    <div class="section">
                        <div class="section-title">2. ALINAN KARARLAR VE DEĞERLENDİRME</div>
                        <div class="content-box">${meeting.decisions || 'Alınan karar kaydı bulunmamaktadır.'}</div>
                    </div>

                    <div class="signatures">
                        <div class="sig-box">
                            <p><strong>Hazırlayan / Düzenleyen</strong></p>
                            <br><br>
                            <p>${teacherName}</p>
                            <p>${this.data.teacher?.title || 'Fen Bilimleri Öğretmeni'}</p>
                        </div>
                        <div class="sig-box">
                            <p><strong>Okul Müdürü / Kurul Başkanı</strong></p>
                            <br><br>
                            <p>.......................................</p>
                            <p>İmza / Onay</p>
                        </div>
                    </div>
                    <script>
                        window.onload = function() { window.print(); }
                    </script>
                </body>
                </html>
            `;
            printWin.document.write(html);
            printWin.document.close();
        },

        
        // ================= 🎨 MAARİF ÇALIŞMALARI & ÇOKLU FOTOĞRAF GALERİSİ =================
        getFilteredMaarifWorks() {
            let list = this.data.maarifWorks || [];
            if (this.selectedMaarifClass && this.selectedMaarifClass !== 'Hepsi') {
                list = list.filter(w => (w.classes || []).includes(this.selectedMaarifClass) || (w.grade && (w.grade + '. Sınıf' === this.selectedMaarifClass)));
            }
            if (this.selectedMaarifCategory && this.selectedMaarifCategory !== 'all') {
                list = list.filter(w => w.category === this.selectedMaarifCategory);
            }
            if (this.maarifSearchQuery && this.maarifSearchQuery.trim()) {
                const q = this.maarifSearchQuery.toLowerCase().trim();
                list = list.filter(w => 
                    (w.title && w.title.toLowerCase().includes(q)) ||
                    (w.description && w.description.toLowerCase().includes(q)) ||
                    (w.outcomeCode && w.outcomeCode.toLowerCase().includes(q)) ||
                    (w.outcomeTitle && w.outcomeTitle.toLowerCase().includes(q)) ||
                    (w.category && w.category.toLowerCase().includes(q)) ||
                    ((w.classes || []).some(c => c.toLowerCase().includes(q)))
                );
            }
            return list;
        },

        openNewMaarifModal() {
            this.isEditMaarif = false;
            this.maarifForm = {
                id: 'mw-' + Date.now(),
                title: '',
                classes: ['5/D'],
                grade: 5,
                date: new Date().toISOString().slice(0, 10),
                category: 'Model & Sergi',
                outcomeCode: 'FB.5.1.1',
                outcomeTitle: '',
                description: '',
                photos: []
            };
            this.isMaarifModalOpen = true;
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },

        openEditMaarifModal(work) {
            this.isEditMaarif = true;
            this.maarifForm = JSON.parse(JSON.stringify(work));
            if (!this.maarifForm.photos) this.maarifForm.photos = [];
            if (!this.maarifForm.classes) this.maarifForm.classes = [];
            this.isMaarifModalOpen = true;
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },

        toggleMaarifClass(className) {
            if (!this.maarifForm.classes) this.maarifForm.classes = [];
            const idx = this.maarifForm.classes.indexOf(className);
            if (idx > -1) {
                this.maarifForm.classes.splice(idx, 1);
            } else {
                this.maarifForm.classes.push(className);
            }
        },

        async handleMaarifPhotosUpload(event) {
            const files = event.target.files;
            if (!files || !files.length) return;
            if (!this.maarifForm.photos) this.maarifForm.photos = [];

            const compressImage = (file) => new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;
                        const maxDim = 1200;
                        if (width > maxDim || height > maxDim) {
                            if (width > height) {
                                height = Math.round((height * maxDim) / width);
                                width = maxDim;
                            } else {
                                width = Math.round((width * maxDim) / height);
                                height = maxDim;
                            }
                        }
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);
                        resolve(canvas.toDataURL('image/jpeg', 0.82));
                    };
                    img.onerror = () => resolve(e.target.result);
                    img.src = e.target.result;
                };
                reader.onerror = () => resolve(null);
                reader.readAsDataURL(file);
            });

            let added = 0;
            for (const file of Array.from(files)) {
                if (!file.type.startsWith('image/')) continue;
                try {
                    const base64 = await compressImage(file);
                    if (base64) {
                        this.maarifForm.photos.push(base64);
                        added++;
                    }
                } catch (err) {
                    console.warn('Fotoğraf sıkıştırma hatası:', err);
                }
            }

            // Alpine reaktif güncelleme tetikle
            this.maarifForm.photos = [...this.maarifForm.photos];

            if (added > 0) {
                this.showToast(`${added} fotoğraf eklendi! 📸`);
            } else {
                this.showToast('⚠️ Fotoğraf eklenemedi, lütfen tekrar deneyin.');
            }

            // Input'u sıfırla (aynı dosyayı tekrar seçebilsin)
            event.target.value = '';
        },


        removeMaarifPhoto(index) {
            if (this.maarifForm.photos) {
                this.maarifForm.photos.splice(index, 1);
            }
        },

        saveMaarifWork() {
            if (!this.maarifForm.title || !this.maarifForm.title.trim()) {
                alert('Lütfen çalışmanın adını / konusunu giriniz!');
                return;
            }
            if (!this.maarifForm.classes || !this.maarifForm.classes.length) {
                alert('Lütfen çalışmanın yapıldığı en az bir sınıf seçiniz!');
                return;
            }

            if (!this.data.maarifWorks) this.data.maarifWorks = [];

            if (this.isEditMaarif) {
                const idx = this.data.maarifWorks.findIndex(w => w.id === this.maarifForm.id);
                if (idx !== -1) {
                    this.data.maarifWorks[idx] = { ...this.maarifForm };
                } else {
                    this.data.maarifWorks.push({ ...this.maarifForm });
                }
                this.showToast('Maarif çalışması güncellendi! 🎨');
            } else {
                this.data.maarifWorks.unshift({ ...this.maarifForm });
                this.showToast('Yeni Maarif çalışması eklendi! 🎨');
            }

            const uid = this.currentUser ? this.currentUser.id : 'admin';
            window.StorageManager.saveData(this.data, uid);
            this.isMaarifModalOpen = false;
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },

        deleteMaarifWork(workId) {
            if (confirm('Bu Maarif çalışmasını ve ekli tüm fotoğrafları silmek istediğinize emin misiniz?')) {
                this.data.maarifWorks = (this.data.maarifWorks || []).filter(w => w.id !== workId);
                const uid = this.currentUser ? this.currentUser.id : 'admin';
                window.StorageManager.saveData(this.data, uid);
                this.showToast('Maarif çalışması silindi. 🗑️');
            }
        },

        // 🔍 Fotoğraf Tam Ekran Lightbox
        openPhotoLightbox(photos, startIndex = 0) {
            if (!photos || !photos.length) return;
            this.lightboxImages = photos;
            this.lightboxActiveIndex = startIndex;
            this.isLightboxOpen = true;
        },

        nextLightboxPhoto() {
            if (this.lightboxActiveIndex < this.lightboxImages.length - 1) {
                this.lightboxActiveIndex++;
            } else {
                this.lightboxActiveIndex = 0;
            }
        },

        prevLightboxPhoto() {
            if (this.lightboxActiveIndex > 0) {
                this.lightboxActiveIndex--;
            } else {
                this.lightboxActiveIndex = this.lightboxImages.length - 1;
            }
        },

        
        // ================= 📊 EXCEL & PDF RAPOR ALMA FONKSİYONLARI =================
        exportHomeworkToExcel() {
            const cls = (this.data.classes || []).find(c => c.id === this.selectedClassId) || { name: this.selectedClassId };
            const students = this.filteredStudents || [];
            const dateStr = this.selectedHomeworkDate || new Date().toISOString().slice(0, 10);
            const title = `${cls.name} Sınıfı Ödev ve Başarı Raporu (${dateStr})`;
            
            const headers = ['Okul No', 'Adı Soyadı', 'Sınıf', 'Günün Ödevi', 'Puan', '⭐ Yıldız', '✅ Artı (+)', '⚠️ Yarım', '❌ Sıfır (0)', '🚫 Gelmedi', 'Toplam Puan', 'Başarı %'];
            const rows = students.map(st => {
                const stStats = this.getStudentStats ? this.getStudentStats(st.id) : { stars: 0, full: 0, half: 0, zero: 0, absent: 0, totalScore: 0, successPercent: 0 };
                const todayHw = this.getStudentHomework ? this.getStudentHomework(st.id, dateStr) : { status: '-' };
                const statusMap = { '4': '⭐ Yıldız (4p)', '2': '✅ Artı (+2p)', '1': '⚠️ Yarım (1p)', '0': '❌ Yok (0p)', 'G': '🚫 Gelmedi' };
                return [
                    st.no || '',
                    st.name || '',
                    cls.name || '',
                    this.currentHomeworkTitle || 'Günlük Ödev',
                    statusMap[todayHw.status] || todayHw.status || '-',
                    stStats.stars || 0,
                    stStats.full || 0,
                    stStats.half || 0,
                    stStats.zero || 0,
                    stStats.absent || 0,
                    stStats.totalScore || 0,
                    '%' + (stStats.successPercent || 0)
                ];
            });

            window.Exporter.exportHtmlTableToExcel(`${cls.name}_odev_raporu_${dateStr}`, title, headers, rows);
            this.showToast(`${cls.name} sınıfı ödev raporu Excel olarak indirildi! 📊`);
        },

        exportAssignmentsToExcel() {
            const list = this.filteredAssignments || this.data.assignments || [];
            const title = `Rotalı Fenci - 2026-2027 Ödev Planlama Listesi`;
            const headers = ['Sınıf Düzeyi', 'Hedef Şubeler', 'Ödev Başlığı', 'Başlangıç Tarihi', 'Teslim Tarihi', 'Durum', 'Açıklama'];
            const rows = list.map(a => [
                (a.grade || 5) + '. Sınıf',
                (a.targetClasses || []).join(', '),
                a.title || '',
                a.startDate || '',
                a.dueDate || '',
                a.status || 'Aktif',
                a.description || ''
            ]);

            window.Exporter.exportHtmlTableToExcel(`odev_plani_listesi`, title, headers, rows);
            this.showToast(`Ödev planlama listesi Excel olarak indirildi! 📊`);
        },

        exportMeetingsToExcel() {
            const list = this.getFilteredMeetings ? this.getFilteredMeetings() : (this.data.meetings || []);
            const title = `Rotalı Fenci - Okul Toplantı Ajandası`;
            const headers = ['Tarih', 'Saat', 'Toplantı Türü', 'Toplantı Başlığı / Konusu', 'Toplantı Yeri', 'Katılımcılar', 'Durum'];
            const rows = list.map(m => [
                m.date || '',
                m.time || '',
                m.type || '',
                m.title || '',
                m.location || 'Okul',
                m.attendees || 'Tüm Kurul',
                m.status || 'Yapılacak'
            ]);

            window.Exporter.exportHtmlTableToExcel(`toplanti_ajandasi`, title, headers, rows);
            this.showToast(`Toplantı ajandası Excel olarak indirildi! 📊`);
        },

        exportMaarifWorksToExcel() {
            const list = this.getFilteredMaarifWorks ? this.getFilteredMaarifWorks() : (this.data.maarifWorks || []);
            const title = `Türkiye Yüzyılı Maarif Modeli Çalışmaları ve Etkinlik Listesi`;
            const headers = ['Tarih', 'Kategori', 'Sınıflar', 'Çalışma / Etkinlik Adı', 'Kazanım Kodu', 'Fotoğraf Sayısı'];
            const rows = list.map(w => [
                w.date || '',
                w.category || '',
                (w.classes || []).join(', '),
                w.title || '',
                w.outcomeCode || '-',
                (w.photos || []).length + ' Fotoğraf'
            ]);

            window.Exporter.exportHtmlTableToExcel(`maarif_calismalari_listesi`, title, headers, rows);
            this.showToast(`Maarif çalışmaları listesi Excel olarak indirildi! 📊`);
        },

        // 🖨️ Maarif Çalışmaları Fotoğraflı Kolaj PDF Raporu
        printMaarifWorksPDF() {
            const list = this.getFilteredMaarifWorks ? this.getFilteredMaarifWorks() : (this.data.maarifWorks || []);
            if (!list || !list.length) {
                alert('Rapor alınacak Maarif çalışması bulunamadı!');
                return;
            }

            const teacherName = this.data.teacher?.name || this.currentUser?.name || 'Fen Bilimleri Öğretmeni';
            const school = this.data.teacher?.school || '';
            const academicYear = this.data.teacher?.academicYear || '2026-2027';
            const printDate = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
            const totalPhotos = list.reduce((acc, w) => acc + (w.photos || []).length, 0);

            // Her fotoğraf → ayrı sayfa. Fotoğrafı olmayan çalışmalar için de bilgi sayfası oluştur.
            const pages = [];

            list.forEach(work => {
                const classes = (work.classes || []).join(' • ');
                const headerHtml = `
                    <div class="photo-header">
                        <div class="photo-header-top">
                            <div class="photo-title">${work.title || 'İsimsiz Çalışma'}</div>
                            ${work.outcomeCode ? `<span class="outcome-badge">${work.outcomeCode}</span>` : ''}
                        </div>
                        <div class="photo-meta">
                            ${classes ? `<span class="tag class-tag">📚 ${classes}</span>` : ''}
                            <span class="tag cat-tag">🏷 ${work.category || 'Etkinlik'}</span>
                            <span class="tag date-tag">📅 ${work.date || '—'}</span>
                        </div>
                        ${work.description ? `<div class="photo-desc">${work.description}</div>` : ''}
                    </div>`;

                if (!work.photos || !work.photos.length) {
                    // Fotoğrafsız çalışma: tek bilgi sayfası
                    pages.push(`
                        <div class="photo-page">
                            ${headerHtml}
                            <div class="no-photo-box">
                                <div style="font-size:40px;margin-bottom:8px;">📷</div>
                                <div style="font-size:13px;font-weight:700;color:#64748b;">Bu çalışmaya fotoğraf eklenmemiş</div>
                            </div>
                        </div>`);
                } else {
                    work.photos.forEach((photo, idx) => {
                        const photoNum = work.photos.length > 1 ? `Fotoğraf ${idx + 1} / ${work.photos.length}` : '';
                        pages.push(`
                            <div class="photo-page">
                                ${headerHtml}
                                ${photoNum ? `<div class="photo-num">${photoNum}</div>` : ''}
                                <div class="photo-frame">
                                    <img src="${photo}" alt="Calisma Fotografi">
                                </div>
                                <div class="photo-footer">${teacherName} · ${school ? school + ' · ' : ''}${academicYear} · ${printDate}</div>
                            </div>`);
                    });
                }
            });

            const html = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<title>Maarif Calismalari Raporu</title>
<style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    @page { size: A4 portrait; margin: 0; }
    body { font-family: Arial, sans-serif; background: #fff; color: #1e293b; }

    /* KAPAK */
    .cover {
        width: 210mm; height: 297mm;
        display: flex; flex-direction: column; justify-content: center; align-items: center;
        background: #064e3b; color: white; text-align: center; padding: 40px;
        page-break-after: always;
    }
    .cover-emoji { font-size: 72px; margin-bottom: 24px; }
    .cover-title { font-size: 28px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px; }
    .cover-subtitle { font-size: 14px; opacity: 0.8; margin-bottom: 36px; }
    .cover-line { width: 120px; height: 4px; background: #34d399; border-radius: 4px; margin: 0 auto 32px; }
    .cover-teacher { font-size: 20px; font-weight: 900; color: #6ee7b7; margin-bottom: 6px; }
    .cover-school { font-size: 13px; opacity: 0.85; margin-bottom: 4px; }
    .cover-year { font-size: 12px; opacity: 0.7; margin-bottom: 40px; }
    .cover-stats { display: flex; gap: 60px; justify-content: center; margin-bottom: 32px; }
    .stat-num { font-size: 52px; font-weight: 900; color: #34d399; line-height: 1; }
    .stat-lbl { font-size: 12px; opacity: 0.7; margin-top: 6px; text-align: center; }
    .cover-date { font-size: 11px; opacity: 0.55; }

    /* HER FOTOĞRAF SAYFASI */
    .photo-page {
        width: 210mm; height: 297mm;
        display: flex; flex-direction: column;
        padding: 8mm 10mm 6mm;
        page-break-after: always;
        background: #fff;
    }

    /* BAŞLIK ALANI */
    .photo-header {
        flex-shrink: 0;
        padding: 8px 12px 8px;
        background: #f0fdf4;
        border-left: 5px solid #059669;
        border-radius: 0 8px 8px 0;
        margin-bottom: 5mm;
    }
    .photo-header-top { display: flex; align-items: flex-start; gap: 10px; flex-wrap: wrap; margin-bottom: 5px; }
    .photo-title { font-size: 15px; font-weight: 900; color: #064e3b; line-height: 1.3; flex: 1; }
    .outcome-badge { background: #059669; color: white; font-size: 9px; font-weight: 900; padding: 3px 10px; border-radius: 999px; white-space: nowrap; font-family: monospace; align-self: center; }
    .photo-meta { display: flex; flex-wrap: wrap; gap: 6px; }
    .tag { font-size: 10px; font-weight: 800; padding: 2px 9px; border-radius: 6px; }
    .class-tag { background: #d1fae5; color: #064e3b; border: 1px solid #6ee7b7; }
    .cat-tag { background: #dbeafe; color: #1e40af; border: 1px solid #93c5fd; }
    .date-tag { background: #fef3c7; color: #78350f; border: 1px solid #fbbf24; }
    .photo-desc { font-size: 10px; color: #475569; line-height: 1.5; margin-top: 5px; }
    .photo-num { font-size: 9px; font-weight: 800; color: #94a3b8; text-align: right; margin-bottom: 2mm; flex-shrink: 0; }

    /* FOTOĞRAF ALANI — Sayfayı doldur */
    .photo-frame {
        flex: 1;
        min-height: 0;
        border-radius: 8px;
        overflow: hidden;
        border: 2px solid #d1fae5;
        background: #f1f5f9;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .photo-frame img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
        background: #f1f5f9;
    }

    /* FOTOĞRAFSIZ KUTU */
    .no-photo-box {
        flex: 1;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        border: 2px dashed #d1fae5; border-radius: 8px; background: #f8fafc;
    }

    /* ALT BİLGİ */
    .photo-footer {
        flex-shrink: 0;
        text-align: center;
        font-size: 8px;
        color: #94a3b8;
        font-weight: 600;
        margin-top: 3mm;
        padding-top: 3mm;
        border-top: 1px solid #e2e8f0;
    }

    @media print {
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        .cover { background: #064e3b !important; }
        .photo-header { background: #f0fdf4 !important; }
    }
</style>
</head>
<body>

<!-- KAPAK SAYFASI -->
<div class="cover">
    <div class="cover-emoji">🎨</div>
    <div class="cover-title">Maarif Çalışmaları</div>
    <div class="cover-subtitle">Türkiye Yüzyılı Maarif Modeli · Fotoğraflı Etkinlik Raporu</div>
    <div class="cover-line"></div>
    <div class="cover-teacher">${teacherName}</div>
    ${school ? `<div class="cover-school">${school}</div>` : ''}
    <div class="cover-year">Fen Bilimleri · ${academicYear}</div>
    <div class="cover-stats">
        <div>
            <div class="stat-num">${list.length}</div>
            <div class="stat-lbl">Çalışma</div>
        </div>
        <div>
            <div class="stat-num">${totalPhotos}</div>
            <div class="stat-lbl">Fotoğraf</div>
        </div>
    </div>
    <div class="cover-date">Rapor Tarihi: ${printDate}</div>
</div>

<!-- FOTOĞRAF SAYFALARI -->
${pages.join('\n')}

<script>
// Tum fotograflar yuklendikten sonra yazdir
const imgs = document.querySelectorAll('img');
const total = imgs.length;
if (total === 0) { setTimeout(() => window.print(), 300); }
else {
    let done = 0;
    imgs.forEach(img => {
        const check = () => { done++; if (done >= total) setTimeout(() => window.print(), 300); };
        if (img.complete) check();
        else { img.onload = check; img.onerror = check; }
    });
}
<\/script>
</body>
</html>`;

            const win = window.open('', '_blank', 'width=960,height=760');
            if (!win) {
                alert('Popup engelleyiciniz aktif. Lütfen tarayıcınızın adres çubuğunda popup iznini açın ve tekrar deneyin.');
                return;
            }
            win.document.write(html);
            win.document.close();
            this.showToast(`🖨️ ${totalPhotos} fotoğraflı PDF raporu hazırlanıyor...`);

        exportScheduleToExcel() {
            const title = `${this.data.teacher?.name || 'Murat Kundakcı'} - Haftalık Ders Programı (2026-2027)`;
            const headers = ['Ders Saati', 'Zaman', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
            const periods = this.data.lessonPeriods || window.InitialData.lessonPeriods || [];
            const rows = periods.map(p => {
                const row = [p.label, p.time];
                ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'].forEach(day => {
                    const cell = this.getScheduleCell ? this.getScheduleCell(day, p.periodNo) : null;
                    if (cell && cell.classId && cell.classId !== 'Boş') {
                        row.push(`${cell.classId} (${cell.subject || 'Fen'}) - ${cell.room || 'Sınıf'}`);
                    } else {
                        row.push('Ders Yok');
                    }
                });
                return row;
            });

            window.Exporter.exportHtmlTableToExcel(`haftalik_ders_programi`, title, headers, rows);
            this.showToast(`Ders programı Excel olarak indirildi! 📊`);
        },

        exportBackup() {
            window.StorageManager.exportJSON(this.data);
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
                    this.data = window.StorageManager.loadData();
                    this.settings = window.StorageManager.loadSettings();
                    this.showToast(msg);
                } else {
                    alert(msg);
                }
            });
        }
    }));
});
