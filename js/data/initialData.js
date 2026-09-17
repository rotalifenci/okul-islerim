// ==========================================================================
// KULLANICI VE YETKİLENDİRME LİSTESİ (1 YÖNETİCİ + 3 ÖĞRETMEN)
// ==========================================================================
window.AuthUsers = [
    {
        id: 'admin',
        username: 'admin',
        name: 'Murat Kundakcı (Rotalı Fenci)',
        role: 'Yönetici',
        roleBadge: '👑 Yönetici',
        password: 'Rotali5822.',
        passwords: ['Rotali5822.'],
        avatar: 'assets/logo.jpg',
        subject: 'Fen Bilimleri & Şube Rehberliği',
        description: 'Tüm sistem yöneticisi ve kadrolu öğretmen',
        displayPassword: 'Rotali5822.'
    },
    {
        id: 'ogretmen1',
        username: 'ogretmen1',
        name: '1. Fen Bilimleri Öğretmeni',
        role: 'Öğretmen',
        roleBadge: '👨‍🏫 Öğretmen 1',
        password: '1111',
        passwords: ['1111', '1001', 'fen1', 'ogretmen1'],
        avatar: '',
        subject: 'Fen Bilimleri',
        description: 'Kişiye özel izole ders programı ve sınıf paneli',
        displayPassword: '1111'
    },
    {
        id: 'ogretmen2',
        username: 'ogretmen2',
        name: '2. Fen Bilimleri Öğretmeni',
        role: 'Öğretmen',
        roleBadge: '👩‍🏫 Öğretmen 2',
        password: '2222',
        passwords: ['2222', '1002', 'fen2', 'ogretmen2'],
        avatar: '',
        subject: 'Fen Bilimleri',
        description: 'Kişiye özel izole ders programı ve sınıf paneli',
        displayPassword: '2222'
    },
    {
        id: 'ogretmen3',
        username: 'ogretmen3',
        name: '3. Fen Bilimleri Öğretmeni',
        role: 'Öğretmen',
        roleBadge: '👨‍🏫 Öğretmen 3',
        password: '3333',
        passwords: ['3333', '1003', 'fen3', 'ogretmen3'],
        avatar: '',
        subject: 'Fen Bilimleri',
        description: 'Kişiye özel izole ders programı ve sınıf paneli',
        displayPassword: '3333'
    }
];

window.createEmptyWeeklySchedule = function() {
    const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
    const sched = {};
    days.forEach(d => {
        sched[d] = [];
        for (let p = 1; p <= 7; p++) {
            sched[d].push({
                periodNo: p,
                classId: 'Boş',
                subject: '',
                topic: '',
                outcomeCode: '',
                outcomeDesc: '',
                room: 'Sınıf'
            });
        }
    });
    return sched;
};

// Rotalı Fenci - Başlangıç Veri Seti (Murat Kundakcı - 21 Derslik Resmi Program & Cuma Nöbeti)
window.InitialData = {
    teacher: {
        name: "Murat Kundakcı (Rotalı Fenci)",
        title: "Fen Bilimleri Öğretmeni & 5/D Şube Rehber Öğretmeni",
        school: "",
        academicYear: "2026-2027",
        dutyDay: "Cuma",
        dutyArea: "Kat-2",
        dutyLocations: ["Bahçe", "Zemin", "Kat-1", "Kat-2", "Kat-3"],
        dutyRotation: ["Kat-2", "Kat-2", "Kat-3", "Kat-3", "Bahçe", "Zemin", "Kat-1"],
        totalLessons: 21,
        fenLessons: 20,
        rehberLessons: 1,
        freeLessons: 14
    },
    navSections: [
        { id: 'calendar-tasks', title: '📅 Ders Programı', icon: 'calendar', color: 'amber', visible: true, isSystem: true, badge: '' },
        { id: 'students', title: '📝 Öğrenci Ödev Kontrolü', icon: 'clipboard-check', color: 'sky', visible: true, isSystem: true, badge: '' },
        { id: 'assignments', title: '📚 Ödevler', icon: 'book-marked', color: 'purple', visible: true, isSystem: true, badge: '' },
        { id: 'school-meetings', title: '👥 Okul Toplantılarım', icon: 'users', color: 'indigo', visible: true, isSystem: true, badge: '' },
        { id: 'school-tasks', title: '📌 Okul Görevlerim', icon: 'check-square', color: 'red', visible: true, isSystem: true, badge: '' },
        { id: 'student-list', title: '👨‍🎓 Öğrenci Listesi', icon: 'graduation-cap', color: 'blue', visible: true, isSystem: true, badge: '' },
        { id: 'annual-plan', title: '📋 Maarif Yıllık Planı', icon: 'book-open', color: 'emerald', visible: true, isSystem: true, badge: '' },
        { id: 'daily-plan', title: '📑 Günlük Plan', icon: 'file-text', color: 'teal', visible: true, isSystem: true, badge: '' },
        { id: 'maarif-works', title: '🎨 Maarif Çalışmaları', icon: 'palette', color: 'emerald', visible: true, isSystem: true, badge: '' },
        { id: 'account', title: '👤 Hesap Bilgilerim', icon: 'user-check', color: 'red', visible: true, isSystem: true, badge: '' },
        { id: 'project-calendar', title: 'Proje Takvimi', icon: 'calendar-range', color: 'emerald', visible: true, isSystem: true, badge: '' },
        { id: 'certificates', title: 'Sertifika / Belge Üretici', icon: 'award', color: 'yellow', visible: true, isSystem: true, badge: '' },
        { id: 'social', title: 'Sosyal Medya & Bülten', icon: 'share-2', color: 'pink', visible: true, isSystem: true, badge: '' },
        { id: 'ai-assistant', title: 'AI Öğretmen Asistanı', icon: 'sparkles', color: 'red', visible: true, isSystem: true, badge: '' },
        { id: 'bug-reports', title: '⚠️ Hatalar & Sorun Bildir', icon: 'alert-triangle', color: 'rose', visible: true, isSystem: true, badge: '' },
        { id: 'school-documents', title: '📄 Okul Çıktıları ve Dosya Arşivi', icon: 'file-text', color: 'blue', visible: true, isSystem: true, badge: '' },
        { id: 'settings', title: 'Ayarlar & Yedekleme', icon: 'settings', color: 'slate', visible: true, isSystem: true, badge: '' }
    ],
    schoolDocuments: [],
    maarifWorks: [
        {
            id: "mw-1",
            title: "Güneş, Dünya ve Ay Modelleri Sergisi & Simülasyonu",
            classes: ["5/D", "5/A"],
            grade: 5,
            date: "2026-09-18",
            category: "Model & Sergi",
            outcomeCode: "FB.5.1.4",
            outcomeTitle: "Güneş, Dünya ve Ay’ın Göreli Hareketleri ve Büyüklükleri",
            description: "5/D ve 5/A sınıfları ile atık malzemeler, strafor küreler ve LED aydınlatmalar kullanılarak Güneş-Dünya-Ay dönme ve dolanma modelleri yapıldı ve okul koridorunda sergilendi.",
            photos: [
                "assets/logo.jpg"
            ]
        },
        {
            id: "mw-2",
            title: "Hücre ve Organeller Mikroskop İnceleme Laboratuvarı",
            classes: ["7/A", "7/B"],
            grade: 7,
            date: "2026-09-22",
            category: "Laboratuvar & Deney",
            outcomeCode: "FB.7.2.1.1",
            outcomeTitle: "Bitki ve Hayvan Hücrelerinin Karşılaştırılması",
            description: "Soğan zarı (bitki) ve ağız içi epitel (hayvan) hücreleri metilen mavisi ve lügol damlatılarak ışık mikroskobunda 400x büyütmeyle incelendi, öğrencilerimiz çizimlerini tamamladı.",
            photos: [
                "assets/logo.jpg"
            ]
        }
    ],
    meetings: [
        {
            id: 'meet-1',
            title: '2026-2027 Sene Başı Öğretmenler Kurulu Toplantısı',
            type: 'Öğretmenler Kurulu',
            date: '2026-09-15',
            time: '14:30',
            location: 'Konferans Salonu',
            attendees: 'Tüm Öğretmenler & Okul İdaresi',
            agenda: '1. Açılış ve yoklama\n2. Türkiye Yüzyılı Maarif Modeli yeni müfredat ilkeleri\n3. 21 saatlik haftalık ders programı ve cuma kat nöbeti dağılımı\n4. Laboratuvar ve STEM etkinliklerinin planlanması',
            decisions: '5., 6., 7. sınıflarda Maarif Modeli etkinlik defterleri ve deney föyleri haftalık kontrol edilecek. Cuma günleri kat nöbeti düzenli tutulacak.',
            status: 'Tamamlandı'
        },
        {
            id: 'meet-2',
            title: 'Fen Bilimleri Dersi 1. Dönem Zümre Öğretmenler Kurulu',
            type: 'Zümre Öğretmenler Kurulu',
            date: '2026-09-22',
            time: '15:15',
            location: 'Fen Laboratuvarı',
            attendees: 'Fen Bilimleri Zümresi (Murat Kundakcı & Zümre Öğretmenleri)',
            agenda: '1. 37 haftalık Maarif Yıllık Planı ile Günlük Planların uyumu\n2. Laboratuvar mikroskop, dinamometre ve kimyasal deney malzemelerinin kullanımı\n3. 5/A, 5/D, 6/G, 7/A, 7/B sınıfları için ortak kazanım değerlendirme testleri\n4. TÜBİTAK 2204-B ve Bilim Fuarı projeleri',
            decisions: 'Haftalık deney föyleri ortak kullanılacak, her ünitede çıkış kartı ve süreç odaklı ölçme formları sisteme işlenecek.',
            status: 'Yapılacak'
        },
        {
            id: 'meet-3',
            title: '5/D Şubesi 1. Dönem Veli Bilgilendirme Toplantısı',
            type: 'Veli Toplantısı',
            date: '2026-10-04',
            time: '11:00',
            location: '5/D Sınıfı',
            attendees: '5/D Sınıfı Velileri & Murat Kundakcı (Şube Rehber Öğretmeni)',
            agenda: '1. Ortaokula ve yeni müfredata uyum süreci\n2. Düzenli ders çalışma ve ödev takip sistemi\n3. Sosyal ve duygusal gelişim, akran ilişkileri\n4. Veli-okul iş birliği ve iletişim kanalları',
            decisions: '',
            status: 'Yapılacak'
        },
        {
            id: 'meet-4',
            title: '5. ve 6. Sınıflar Şube Öğretmenler Kurulu (ŞÖK)',
            type: 'ŞÖK (Şube Öğretmenler Kurulu)',
            date: '2026-11-12',
            time: '15:30',
            location: 'Öğretmenler Odası',
            attendees: '5/D ve 6/G Şube Dersi Öğretmenleri, Rehberlik Servisi',
            agenda: '1. Şubelerin akademik başarı durumları\n2. Özel öğrenme gereksinimi olan ve BEP uygulanan öğrencilerin değerlendirilmesi\n3. Devamsızlık ve motivasyon takip tedbirleri',
            decisions: '',
            status: 'Yapılacak'
        }
    ],
    customSections: [
        {
            id: 'lab-inventory',
            title: '🧪 Laboratuvar & Deney Envanteri',
            icon: 'flask-conical',
            color: 'teal',
            visible: true,
            isSystem: false,
            badge: '',
            description: 'Fen laboratuvarı deney malzemeleri, kimyasal ve mikroskop stok takibi.',
            items: [
                { id: 'item-1', title: 'Işık Mikroskobu (4 Adet)', category: 'Cihaz', count: '4 Adet', status: 'Faal', note: 'Lam ve lamel setleri yenilendi.', date: '2026-09-10' },
                { id: 'item-2', title: 'Dinamometre Seti (1N, 5N, 10N)', category: 'Ölçüm', count: '10 Takım', status: 'Faal', note: 'Kuvvet ve enerji deneyleri için hazır.', date: '2026-09-11' }
            ]
        },
        {
            id: 'parent-meetings',
            title: '📞 Veli İletişim & Randevu Defteri',
            icon: 'phone-call',
            color: 'blue',
            visible: true,
            isSystem: false,
            badge: '',
            description: '5/D Şube Rehberliği ve diğer sınıfların veli görüşme notları ve randevuları.',
            items: [
                { id: 'parent-1', title: '5/D Ahmet Berat Velisi Görüşmesi', category: 'Akademik Takip', count: 'Görüşüldü', status: 'Tamamlandı', note: 'Ders içi katılım ve ödev disiplini hakkında bilgilendirme yapıldı.', date: '2026-09-12' }
            ]
        }
    ],
    dailyPlans: [
        {
            id: 'dp-1',
            date: '2026-09-11',
            day: 'Cuma',
            periodNo: 1,
            classId: '5/A',
            grade: 5,
            subject: 'Fen Bilimleri',
            unit: '1. Ünite: Güneş, Dünya ve Ay',
            topic: 'Güneş, Dünya ve Ay’ın Hareketleri ve Boyutları',
            outcomeCode: 'FB.5.1.4',
            outcomeDesc: 'Güneş, Dünya ve Ay’ın birbirlerine göre hareketlerini ve hacimsel büyüklüklerini temsil eden bilimsel model oluşturabilme',
            methods: 'Model Oluşturma, Deney & Gözlem, Soru-Cevap, Akran Öğrenmesi',
            materials: 'Farklı boyutlarda küreler, el feneri, model hamuru, etkinlik çalışma yaprağı',
            intro: 'Güneş ve Ay tutulmalarını hatırlatıcı soru-cevap ve merak uyandırıcı simülasyon videosu ile derse başlanır.',
            development: 'Öğrenciler 4 kişilik gruplara ayrılır. Güneş, Dünya ve Ay’ın dönme ve dolanma yönleri (saat yönünün tersi) modeller ve el feneriyle canlandırılır.',
            summary: 'Gruplar hazırladıkları modelleri sunar. Boyut ve uzaklık ilişkisi pekiştirilir.',
            evaluation: 'Ders sonu 3 soruluk çıkış kartı çözülür ve etkinlik defteri sayfa 15-18 ödevi verilir.',
            notes: '5/A sınıfı deney katılımı yüksek, modeller laboratuvar panosu için seçildi.'
        }
    ],
    classes: [
        { id: "5A", name: "5/A", grade: 5, studentCount: 30, advisor: "Ayşe Yılmaz" },
        { id: "5D", name: "5/D", grade: 5, studentCount: 30, advisor: "Murat Kundakcı" },
        { id: "6G", name: "6/G", grade: 6, studentCount: 30, advisor: "Mehmet Demir" },
        { id: "7A", name: "7/A", grade: 7, studentCount: 30, advisor: "Zeynep Kaya" },
        { id: "7B", name: "7/B", grade: 7, studentCount: 29, advisor: "Ahmet Çelik" }
    ],
    students: [
        // --- 5/A Sınıfı (30 Öğrenci) ---
        { id: "st_5a_44", name: "Yiğit Arslan", classId: "5A", no: 44, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_5a_88", name: "Ahmet Musab Duman", classId: "5A", no: 88, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_5a_139", name: "Ayaz Aydın", classId: "5A", no: 139, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_5a_170", name: "Azra Nisa Gökkaya", classId: "5A", no: 170, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_5a_215", name: "Birol Cebecioğlu", classId: "5A", no: 215, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_5a_298", name: "Çınar Pınarbaşı", classId: "5A", no: 298, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_5a_320", name: "Çağrıbey Balcı", classId: "5A", no: 320, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_5a_369", name: "Yağmur Yaren Yıldırım", classId: "5A", no: 369, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_5a_374", name: "Sahra Çınar", classId: "5A", no: 374, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_5a_379", name: "Hiranur Amine Erturak", classId: "5A", no: 379, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_5a_389", name: "Taha Çelik", classId: "5A", no: 389, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_5a_411", name: "Erol Yeter", classId: "5A", no: 411, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_5a_415", name: "Erva Sultan Çubukoğlu", classId: "5A", no: 415, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_5a_419", name: "Gamze Karakaş", classId: "5A", no: 419, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_5a_420", name: "Fatma Tuana Tirit", classId: "5A", no: 420, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_5a_518", name: "Tuna Yakın", classId: "5A", no: 518, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_5a_549", name: "Kayra Karabacak", classId: "5A", no: 549, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_5a_556", name: "Elifmeyra Özdemir", classId: "5A", no: 556, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_5a_570", name: "Zümra Kartal", classId: "5A", no: 570, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_5a_573", name: "Zeynep Sena Yıldız", classId: "5A", no: 573, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_5a_579", name: "Zeynep Kılıç", classId: "5A", no: 579, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_5a_608", name: "Buğlem Erva Gençer", classId: "5A", no: 608, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_5a_635", name: "Yusuf Bekiş", classId: "5A", no: 635, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_5a_646", name: "Belinay Ardıç", classId: "5A", no: 646, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_5a_647", name: "Erva Ardıç", classId: "5A", no: 647, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_5a_654", name: "Halil İbrahim Karabulut", classId: "5A", no: 654, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_5a_720", name: "Muhsin Kaya", classId: "5A", no: 720, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_5a_730", name: "Nisanur Çakmak", classId: "5A", no: 730, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_5a_733", name: "Ömer Gül", classId: "5A", no: 733, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_5a_756", name: "Berrenur Kübra Demirgil", classId: "5A", no: 756, avatar: "👩‍🎓", notes: "", tags: [] },
        // --- 5/D Sınıfı (30 Öğrenci) ---
        { id: "st_5d_67", name: "Ahmet Berat Kılıç", classId: "5D", no: 67, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_5d_89", name: "Ahmet Turan Avcı", classId: "5D", no: 89, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_5d_94", name: "Alper Ahıskalı", classId: "5D", no: 94, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_5d_156", name: "Azra Akgül", classId: "5D", no: 156, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_5d_203", name: "Buğlem Kırmalı", classId: "5D", no: 203, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_5d_333", name: "Şerife Kelek", classId: "5D", no: 333, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_5d_343", name: "Elif Hafsa Koç", classId: "5D", no: 343, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_5d_348", name: "Elif Neva Bozbek", classId: "5D", no: 348, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_5d_364", name: "Sıla Biter", classId: "5D", no: 364, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_5d_412", name: "Ertuğrul Bozbek", classId: "5D", no: 412, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_5d_418", name: "Eylül Şule Boyraz", classId: "5D", no: 418, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_5d_482", name: "Yekta Aras Korkmaz", classId: "5D", no: 482, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_5d_519", name: "Yusuf Erdem Çakmak", classId: "5D", no: 519, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_5d_558", name: "Ela Polat", classId: "5D", no: 558, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_5d_571", name: "Zümra Işık", classId: "5D", no: 571, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_5d_575", name: "Ömer Halis Yılmaz", classId: "5D", no: 575, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_5d_586", name: "Zeynep Çamcı", classId: "5D", no: 586, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_5d_605", name: "Erva Turan", classId: "5D", no: 605, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_5d_606", name: "Hira Turan", classId: "5D", no: 606, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_5d_625", name: "Ahmet Dönder", classId: "5D", no: 625, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_5d_670", name: "Hiranur Akgül", classId: "5D", no: 670, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_5d_674", name: "Kevser Irmak Göktürk", classId: "5D", no: 674, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_5d_677", name: "Mahmut Kağan Türkoğlu", classId: "5D", no: 677, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_5d_686", name: "Mehmet Ali Nergiz", classId: "5D", no: 686, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_5d_688", name: "Mehmet Gökhan Kuruçay", classId: "5D", no: 688, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_5d_694", name: "Muhammed Bilal Şahin", classId: "5D", no: 694, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_5d_698", name: "Muhammed Ali Çavdar", classId: "5D", no: 698, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_5d_715", name: "İlknur Karamercimek", classId: "5D", no: 715, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_5d_728", name: "Nisa Büyükyıldız", classId: "5D", no: 728, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_5d_731", name: "Ömer Ali Camcı", classId: "5D", no: 731, avatar: "👨‍🎓", notes: "", tags: [] },
        // --- 6/G Sınıfı (30 Öğrenci) ---
        { id: "st_6g_5", name: "Ahmet Efe Kara", classId: "6G", no: 5, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_6g_8", name: "Ali Erfırat", classId: "6G", no: 8, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_6g_14", name: "Asaf Hazırbulan", classId: "6G", no: 14, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_6g_23", name: "Beyza Duru Kip", classId: "6G", no: 23, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_6g_34", name: "Ebrar Kara", classId: "6G", no: 34, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_6g_37", name: "Ebubekir Karaçam", classId: "6G", no: 37, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_6g_43", name: "Egemen Kangal", classId: "6G", no: 43, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_6g_47", name: "Elif Naz Kara", classId: "6G", no: 47, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_6g_50", name: "Elif Sultan Küpeli", classId: "6G", no: 50, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_6g_52", name: "Elifnaz Çoşkun", classId: "6G", no: 52, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_6g_56", name: "Emirhan Arslan", classId: "6G", no: 56, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_6g_64", name: "Eslemnur Ataş", classId: "6G", no: 64, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_6g_90", name: "Hazal Biter", classId: "6G", no: 90, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_6g_263", name: "Sude Naz Karabulut", classId: "6G", no: 263, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_6g_368", name: "Mehmet Emir Korkmaz", classId: "6G", no: 368, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_6g_403", name: "Elif Nisa Şahin", classId: "6G", no: 403, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_6g_433", name: "Mira Arı", classId: "6G", no: 433, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_6g_451", name: "Muhammet Eymen Kaya", classId: "6G", no: 451, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_6g_468", name: "Nuh Emir Pınarbaşı", classId: "6G", no: 468, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_6g_480", name: "Rüya Ecem Çiçekliyurt", classId: "6G", no: 480, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_6g_488", name: "Selim Buğra Keser", classId: "6G", no: 488, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_6g_503", name: "Yağız Ramazan Yazıcı", classId: "6G", no: 503, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_6g_504", name: "Hasret Ataş", classId: "6G", no: 504, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_6g_505", name: "Yağmur Ada Karabulut", classId: "6G", no: 505, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_6g_520", name: "Muhammed Ali Keser", classId: "6G", no: 520, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_6g_522", name: "Yusuf Şahin", classId: "6G", no: 522, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_6g_527", name: "Zeynep Azra Aksak", classId: "6G", no: 527, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_6g_530", name: "Zeynep Gül", classId: "6G", no: 530, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_6g_539", name: "Berat Ayaz Sönmez", classId: "6G", no: 539, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_6g_543", name: "Tuğçe Çoşkun", classId: "6G", no: 543, avatar: "👩‍🎓", notes: "", tags: [] },
        // --- 7/A Sınıfı (30 Öğrenci) ---
        { id: "st_7a_105", name: "Ahmet Turan Parakaya", classId: "7A", no: 105, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_7a_110", name: "Alperen Efe Karlı", classId: "7A", no: 110, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_7a_118", name: "Belinay Yaprak Bulut", classId: "7A", no: 118, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_7a_129", name: "Busenur Esila Özdemir", classId: "7A", no: 129, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_7a_143", name: "Elif Şahin", classId: "7A", no: 143, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_7a_151", name: "Eslem Hazal Tutal", classId: "7A", no: 151, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_7a_163", name: "Fikri Erfırat", classId: "7A", no: 163, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_7a_171", name: "Hamza Eymen Yıldız", classId: "7A", no: 171, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_7a_175", name: "Hasan Şimşek", classId: "7A", no: 175, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_7a_179", name: "Hazel Mina Şimşek", classId: "7A", no: 179, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_7a_183", name: "Hira Büyükdeveci", classId: "7A", no: 183, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_7a_190", name: "Hüseyin Ecer", classId: "7A", no: 190, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_7a_338", name: "Şerife Naz Kayapınar", classId: "7A", no: 338, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_7a_531", name: "Zümra Duran", classId: "7A", no: 531, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_7a_610", name: "Mehmet Asaf Yeter", classId: "7A", no: 610, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_7a_639", name: "Özlem Demir", classId: "7A", no: 639, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_7a_641", name: "İkranur Çelik", classId: "7A", no: 641, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_7a_708", name: "Muhammed Emin Yıldız", classId: "7A", no: 708, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_7a_712", name: "Muhammed Mert Erdoğan", classId: "7A", no: 712, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_7a_725", name: "Muhammed Hamza Ayık", classId: "7A", no: 725, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_7a_727", name: "Muhammed Yusuf Koç", classId: "7A", no: 727, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_7a_762", name: "Muhammed Batuhan Bozbek", classId: "7A", no: 762, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_7a_815", name: "Oğuzhan Kandil", classId: "7A", no: 815, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_7a_831", name: "Sedat Şeker", classId: "7A", no: 831, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_7a_835", name: "Sümeyye Kısacık", classId: "7A", no: 835, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_7a_845", name: "Yağmur Çiftçi", classId: "7A", no: 845, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_7a_851", name: "Yusuf Aras Kuzu", classId: "7A", no: 851, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_7a_861", name: "Zeynep Ecrin Eliş", classId: "7A", no: 861, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_7a_865", name: "Yasin Taşçı", classId: "7A", no: 865, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_7a_992", name: "Reyyan Yılmaz", classId: "7A", no: 992, avatar: "👩‍🎓", notes: "", tags: [] },
        // --- 7/B Sınıfı (29 Öğrenci) ---
        { id: "st_7b_100", name: "Abdullah Emin Ortaklar", classId: "7B", no: 100, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_7b_103", name: "Ahmet Efe Uygur", classId: "7B", no: 103, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_7b_114", name: "Ayşenaz Karatepe", classId: "7B", no: 114, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_7b_121", name: "Berathan Ateş", classId: "7B", no: 121, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_7b_122", name: "Berkay Kelek", classId: "7B", no: 122, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_7b_125", name: "Berranur Çelik", classId: "7B", no: 125, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_7b_130", name: "Can Alperen Uğurlu", classId: "7B", no: 130, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_7b_135", name: "Ece Naz Şahin", classId: "7B", no: 135, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_7b_146", name: "Emir Çolak", classId: "7B", no: 146, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_7b_158", name: "Emirhan Topcu", classId: "7B", no: 158, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_7b_178", name: "Halil Efe Ateş", classId: "7B", no: 178, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_7b_184", name: "Hira Nur Gülten", classId: "7B", no: 184, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_7b_189", name: "Hiranur Yıkılkan", classId: "7B", no: 189, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_7b_307", name: "İbrahimcan Karabulut", classId: "7B", no: 307, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_7b_429", name: "Lale Turan", classId: "7B", no: 429, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_7b_636", name: "Berat Akay", classId: "7B", no: 636, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_7b_667", name: "Mehmet Enes Danış", classId: "7B", no: 667, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_7b_710", name: "Muhammed Enes Yerlikaya", classId: "7B", no: 710, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_7b_729", name: "Muhammet Ali Aslan", classId: "7B", no: 729, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_7b_744", name: "Mustafa Emin Yerlikaya", classId: "7B", no: 744, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_7b_770", name: "Nisanur Temizer", classId: "7B", no: 770, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_7b_832", name: "Selin Sakarya", classId: "7B", no: 832, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_7b_838", name: "Şeymanur Aydın", classId: "7B", no: 838, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_7b_847", name: "Yasin Şahin", classId: "7B", no: 847, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_7b_849", name: "Yiğitcan Şenol", classId: "7B", no: 849, avatar: "👨‍🎓", notes: "", tags: [] },
        { id: "st_7b_859", name: "Zehra Erol", classId: "7B", no: 859, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_7b_866", name: "Hümeyra Bulut", classId: "7B", no: 866, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_7b_880", name: "Ecrin Temel", classId: "7B", no: 880, avatar: "👩‍🎓", notes: "", tags: [] },
        { id: "st_7b_901", name: "Işıl Biçer", classId: "7B", no: 901, avatar: "👨‍🎓", notes: "", tags: [] },
    ],
    homeworkDays: [
        {
            date: "2026-09-11",
            classId: "7A",
            title: "Hücre ve Organeller Etkinlik Defteri (s. 18-22)",
            grades: {
                "s1": { score: "4", note: "Harika organel modelleri çizilmiş ★" },
                "s2": { score: "2", note: "Eksiksiz yapılmış" },
                "s3": { score: "1", note: "Son 2 sayfa eksik kalmış" },
                "s4_7a": { score: "4", note: "Kavram haritaları kusursuz ★" },
                "s5_7a": { score: "G", note: "Okula gelmedi (Raporlu)" }
            }
        },
        {
            date: "2026-09-11",
            classId: "5D",
            title: "Güneş'in Yapısı ve Katmanları Çizimi",
            grades: {
                "s1_5d": { score: "4", note: "Mükemmel katman çizimi ★" },
                "s2_5d": { score: "2", note: "Eksiksiz" },
                "s3_5d": { score: "2", note: "Tam" }
            }
        },
        {
            date: "2026-09-11",
            classId: "6G",
            title: "Güneş Sistemi Gezegen Sıralaması Tablosu",
            grades: {
                "s1_6g": { score: "4", note: "Çok başarılı gezegen modeli ★" },
                "s2_6g": { score: "2", note: "Tam" },
                "s3_6g": { score: "1", note: "Yarısı tamamlandı" }
            }
        }
    ],
    assignments: [],
    observations: [
        {
            id: "obs-1",
            date: "2026-09-08",
            studentId: "s1",
            studentName: "Ali Can",
            classId: "7A",
            category: "Etkinlik ve Laboratuvar Becerisi",
            rawNote: "Hücre organelleri konusunda grup arkadaşlarına rehberlik etti ve mikroskop incelemesini eksiksiz yaptı.",
            aiSummary: "Ali Can'ın uygulamalı ders süreçlerinde liderlik vasfı ve sorumluluk bilinci üst düzeydedir; akran öğrenmesini aktif şekilde desteklemektedir.",
            tags: ["🧪 Deney becerisi", "🤝 İş birliği", "⭐ Başarılı"],
            status: "Olumlu Gelişim"
        },
        {
            id: "obs-2",
            date: "2026-09-09",
            studentId: "s1_5d",
            studentName: "Ahmet Yağız",
            classId: "5D",
            category: "Akademik Gelişim & Takip",
            rawNote: "Güneş'in katmanları modelinde çok ilgili ve yaratıcı çözümler sundu.",
            aiSummary: "Öğrencinin fen bilimleri dersine ilgisi ve modelleme yeteneği gelişim göstermektedir.",
            tags: ["💡 Yaratıcı", "⭐ Başarılı"],
            status: "Üstün Başarı"
        }
    ],
    projectCalendar: [
        {
            id: "pcal-1",
            title: "TÜBİTAK 2204-B Ortaokul Araştırma Projeleri",
            category: "TÜBİTAK",
            targetProject: "Nefes Alan Sınıflar (CO2 Takip Sistemi)",
            startDate: "2026-09-15",
            deadline: "2026-11-20",
            status: "Devam Ediyor",
            priority: "Yüksek",
            notes: "Proje metni yazımı, veri analiz tabloları ve sistem onay başvurusu.",
            checkpoints: [
                { text: "Literatür taraması ve problem tespiti", done: true, date: "2026-09-30" },
                { text: "Deney ve veri toplama süreci", done: true, date: "2026-10-25" },
                { text: "Proje raporu sisteme yükleme", done: false, date: "2026-11-20" }
            ]
        },
        {
            id: "pcal-2",
            title: "eTwinning - Green STEM Explorers Uluslararası Proje",
            category: "eTwinning",
            targetProject: "Avrupa Okul Bahçeleri & İklim Eylemi",
            startDate: "2026-10-01",
            deadline: "2026-12-15",
            status: "Planlandı",
            priority: "Orta",
            notes: "TwinSpace ortak tanıtımları, öğrenci izin belgeleri ve 1. çevrimiçi toplantı.",
            checkpoints: [
                { text: "TwinSpace sayfalarının açılması ve ortak tanışması", done: true, date: "2026-10-15" },
                { text: "Ortak ürün / e-Dergi çalışması", done: false, date: "2026-11-30" },
                { text: "Ulusal Kalite Etiketi hazırlıkları", done: false, date: "2026-12-15" }
            ]
        }
    ],
    tasks: [
        {
            id: "task-1",
            title: "5/D Sınıfı Şube Rehberlik Uyum Formlarını Tamamla",
            category: "Rehberlik & Öğrenci",
            priority: "urgent",
            date: "2026-09-11",
            done: false
        },
        {
            id: "task-2",
            title: "Cuma Günü Kat & Laboratuvar Nöbet Görevi",
            category: "Nöbet",
            priority: "urgent",
            date: "2026-09-18",
            done: false
        },
        {
            id: "task-3",
            title: "7/A ve 7/B Hücre Mikroskop Deney Malzemelerini Hazırla",
            category: "Laboratuvar",
            priority: "important",
            date: "2026-09-14",
            done: false
        }
    ],
    lessonPeriods: [
        { periodNo: 1, time: "08:30 - 09:10", label: "1. Ders" },
        { periodNo: 2, time: "09:25 - 10:05", label: "2. Ders" },
        { periodNo: 3, time: "10:20 - 11:00", label: "3. Ders" },
        { periodNo: 4, time: "11:15 - 11:55", label: "4. Ders" },
        { periodNo: 5, time: "12:45 - 13:25", label: "5. Ders" },
        { periodNo: 6, time: "13:40 - 14:20", label: "6. Ders" },
        { periodNo: 7, time: "14:35 - 15:15", label: "7. Ders" }
    ],
    weeklySchedule: {
        "Pazartesi": [
            { periodNo: 1, classId: "7/B", subject: "Fen Bilimleri", topic: "Uzay Araştırmaları ve Uzay Teknolojileri", outcomeCode: "FB.7.1.1", outcomeDesc: "Uzay araştırmaları için geliştirilen teknolojileri karşılaştırabilme", room: "7/B Sınıfı" },
            { periodNo: 2, classId: "7/B", subject: "Fen Bilimleri", topic: "Uzay Gözlem Araçları ve Teleskop Modeli", outcomeCode: "FB.7.1.2", outcomeDesc: "Uzay gözlem araçları ile ilgili bilimsel model oluşturabilme", room: "7/B Sınıfı" },
            { periodNo: 3, classId: "Boş", subject: "Ders Yok", topic: "", outcomeCode: "-", outcomeDesc: "Bu saatte planlanmış dersiniz bulunmamaktadır (Boş Saat / Hazırlık).", room: "Öğretmenler Odası" },
            { periodNo: 4, classId: "7/A", subject: "Fen Bilimleri", topic: "Uzay Araştırmaları ve Uzay Teknolojileri", outcomeCode: "FB.7.1.1", outcomeDesc: "Uzay araştırmaları için geliştirilen teknolojileri karşılaştırabilme", room: "7/A Sınıfı" },
            { periodNo: 5, classId: "7/A", subject: "Fen Bilimleri", topic: "Uzay Gözlem Araçları ve Teleskop Modeli", outcomeCode: "FB.7.1.2", outcomeDesc: "Uzay gözlem araçları ile ilgili bilimsel model oluşturabilme", room: "7/A Sınıfı" },
            { periodNo: 6, classId: "6/G", subject: "Fen Bilimleri", topic: "Güneş Sistemi ve Gezegenlerin Nitelikleri", outcomeCode: "FB.6.1.1", outcomeDesc: "Güneş sistemindeki gezegenleri niteliklerine göre sınıflandırabilme", room: "6/G Sınıfı" },
            { periodNo: 7, classId: "6/G", subject: "Fen Bilimleri", topic: "Güneş Sistemi Boyut ve Uzaklık Modeli", outcomeCode: "FB.6.1.2", outcomeDesc: "Güneş sistemi ile ilgili bilimsel model oluşturabilme", room: "6/G Sınıfı" }
        ],
        "Salı": [
            { periodNo: 1, classId: "5/D", subject: "Fen Bilimleri", topic: "Güneş’in Yapısı ve Katmanları", outcomeCode: "FB.5.1.1", outcomeDesc: "Güneş’in yapısı ve dönme hareketi ile ilgili bilgi toplayabilme", room: "5/D Sınıfı" },
            { periodNo: 2, classId: "5/D", subject: "Fen Bilimleri", topic: "Güneş Lekeleri ve Dönme Hareketi", outcomeCode: "FB.5.1.1", outcomeDesc: "Güneş’in yapısı ve dönme hareketi ile ilgili bilgi toplayabilme (Model ve Gözlem)", room: "5/D Sınıfı" },
            { periodNo: 3, classId: "5/A", subject: "Fen Bilimleri", topic: "Güneş’in Yapısı ve Geometrik Modeli", outcomeCode: "FB.5.1.1", outcomeDesc: "Güneş’in yapısı ve dönme hareketi ile ilgili bilgi toplayabilme", room: "5/A Sınıfı" },
            { periodNo: 4, classId: "5/A", subject: "Fen Bilimleri", topic: "Ay’ın Özellikleri ve Yüzey Şekilleri", outcomeCode: "FB.5.1.2", outcomeDesc: "Ay’ın özellikleri, dönme ve dolanma hareketleri ile ilgili bilimsel çıkarım yapabilme", room: "5/A Sınıfı" },
            { periodNo: 5, classId: "Boş", subject: "Ders Yok", topic: "", outcomeCode: "-", outcomeDesc: "Bu saatte planlanmış dersiniz bulunmamaktadır (Boş Saat / Hazırlık).", room: "Öğretmenler Odası" },
            { periodNo: 6, classId: "Boş", subject: "Ders Yok", topic: "", outcomeCode: "-", outcomeDesc: "Bu saatte planlanmış dersiniz bulunmamaktadır (Boş Saat / Hazırlık).", room: "Öğretmenler Odası" },
            { periodNo: 7, classId: "Boş", subject: "Ders Yok", topic: "", outcomeCode: "-", outcomeDesc: "Bu saatte planlanmış dersiniz bulunmamaktadır (Boş Saat / Hazırlık).", room: "Öğretmenler Odası" }
        ],
        "Çarşamba": [
            { periodNo: 1, classId: "6/G", subject: "Fen Bilimleri", topic: "Güneş ve Ay Tutulması Dinamikleri", outcomeCode: "FB.6.1.3", outcomeDesc: "Güneş ve Ay tutulması ile ilgili bilimsel çıkarım yapabilme", room: "6/G Sınıfı" },
            { periodNo: 2, classId: "6/G", subject: "Fen Bilimleri", topic: "Tutulmaları Temsil Eden Model Oluşturma", outcomeCode: "FB.6.1.4", outcomeDesc: "Güneş ve Ay tutulması ile ilgili bilimsel model oluşturabilme", room: "6/G Sınıfı" },
            { periodNo: 3, classId: "Boş", subject: "Ders Yok", topic: "", outcomeCode: "-", outcomeDesc: "Bu saatte planlanmış dersiniz bulunmamaktadır (Boş Saat / Hazırlık).", room: "Öğretmenler Odası" },
            { periodNo: 4, classId: "5/D", subject: "Fen Bilimleri", topic: "Ay’ın Evreleri ve Dolanma Hareketi", outcomeCode: "FB.5.1.3", outcomeDesc: "Ay’ın evrelerini temsil eden bilimsel model oluşturabilme", room: "5/D Sınıfı" },
            { periodNo: 5, classId: "5/D", subject: "Fen Bilimleri", topic: "Güneş, Dünya ve Ay’ın Göreli Hareketleri", outcomeCode: "FB.5.1.4", outcomeDesc: "Güneş, Dünya ve Ay’ın birbirlerine göre hareketlerini ve hacimsel büyüklüklerini temsil eden bilimsel model oluşturabilme", room: "5/D Sınıfı" },
            { periodNo: 6, classId: "7/A", subject: "Fen Bilimleri", topic: "Uzay Kirliliği ve Çözüm Yolları", outcomeCode: "FB.7.1.3", outcomeDesc: "Uzay araştırmalarının yol açabileceği problemleri çözebilme", room: "7/A Sınıfı" },
            { periodNo: 7, classId: "7/A", subject: "Fen Bilimleri", topic: "Yıldızların Oluşumu ve Yaşam Döngüsü", outcomeCode: "FB.7.1.4", outcomeDesc: "Yıldızların yaşamını açıklayarak yapılandırabilme", room: "7/A Sınıfı" }
        ],
        "Perşembe": [
            { periodNo: 1, classId: "Boş", subject: "Ders Yok", topic: "", outcomeCode: "-", outcomeDesc: "Bu saatte planlanmış dersiniz bulunmamaktadır (Boş Gün / Ders Dışı Hazırlık).", room: "Öğretmenler Odası" },
            { periodNo: 2, classId: "Boş", subject: "Ders Yok", topic: "", outcomeCode: "-", outcomeDesc: "Bu saatte planlanmış dersiniz bulunmamaktadır (Boş Gün / Ders Dışı Hazırlık).", room: "Öğretmenler Odası" },
            { periodNo: 3, classId: "Boş", subject: "Ders Yok", topic: "", outcomeCode: "-", outcomeDesc: "Bu saatte planlanmış dersiniz bulunmamaktadır (Boş Gün / Ders Dışı Hazırlık).", room: "Öğretmenler Odası" },
            { periodNo: 4, classId: "Boş", subject: "Ders Yok", topic: "", outcomeCode: "-", outcomeDesc: "Bu saatte planlanmış dersiniz bulunmamaktadır (Boş Gün / Ders Dışı Hazırlık).", room: "Öğretmenler Odası" },
            { periodNo: 5, classId: "Boş", subject: "Ders Yok", topic: "", outcomeCode: "-", outcomeDesc: "Bu saatte planlanmış dersiniz bulunmamaktadır (Boş Gün / Ders Dışı Hazırlık).", room: "Öğretmenler Odası" },
            { periodNo: 6, classId: "Boş", subject: "Ders Yok", topic: "", outcomeCode: "-", outcomeDesc: "Bu saatte planlanmış dersiniz bulunmamaktadır (Boş Gün / Ders Dışı Hazırlık).", room: "Öğretmenler Odası" },
            { periodNo: 7, classId: "Boş", subject: "Ders Yok", topic: "", outcomeCode: "-", outcomeDesc: "Bu saatte planlanmış dersiniz bulunmamaktadır (Boş Gün / Ders Dışı Hazırlık).", room: "Öğretmenler Odası" }
        ],
        "Cuma": [
            { periodNo: 1, classId: "5/A", subject: "Fen Bilimleri", topic: "Güneş, Dünya ve Ay’ın Hareketleri", outcomeCode: "FB.5.1.4", outcomeDesc: "Güneş, Dünya ve Ay’ın birbirlerine göre hareketlerini ve hacimsel büyüklüklerini temsil eden bilimsel model oluşturabilme", room: "5/A Sınıfı" },
            { periodNo: 2, classId: "5/A", subject: "Fen Bilimleri", topic: "Güneş-Dünya-Ay Simülasyonu", outcomeCode: "FB.5.1.4", outcomeDesc: "Güneş, Dünya ve Ay’ın uzaydaki göreli hareketlerini etkileşimli model ve simülasyonla açıklayabilme", room: "5/A Sınıfı" },
            { periodNo: 3, classId: "Boş", subject: "Ders Yok", topic: "", outcomeCode: "-", outcomeDesc: "Bu saatte dersiniz bulunmamaktadır (🛡️ Cuma Kat & Teneffüs Nöbet Görevi).", room: "Kat Koridoru" },
            { periodNo: 4, classId: "Boş", subject: "Ders Yok", topic: "", outcomeCode: "-", outcomeDesc: "Bu saatte dersiniz bulunmamaktadır (🛡️ Cuma Kat & Teneffüs Nöbet Görevi).", room: "Kat Koridoru" },
            { periodNo: 5, classId: "7/B", subject: "Fen Bilimleri", topic: "Yıldızların Oluşumu ve Karadelikler", outcomeCode: "FB.7.1.4", outcomeDesc: "Yıldızların yaşamını açıklayarak yapılandırabilme", room: "7/B Sınıfı" },
            { periodNo: 6, classId: "7/B", subject: "Fen Bilimleri", topic: "Galaksiler ve Evrenin Yapısı", outcomeCode: "FB.7.1.5", outcomeDesc: "Yıldız, galaksi ve evren kavramlarını açıklayarak yapılandırabilme", room: "7/B Sınıfı" },
            { periodNo: 7, classId: "5/D", subject: "Rehberlik ve Yönlendirme", topic: "Sınıf Rehberliği, Uyum ve Verimli Çalışma", outcomeCode: "REHB.5.1", outcomeDesc: "5/D Şube Rehberliği: Okula uyum, akran ilişkileri, verimli ders çalışma teknikleri ve zaman yönetimi rehberlik oturumu.", room: "5/D Sınıfı" }
        ]
    }
};
