// Rotalı Fenci - Başlangıç Veri Seti (Murat Kundakcı - 21 Derslik Resmi Program & Cuma Nöbeti)
window.InitialData = {
    teacher: {
        name: "Murat Kundakcı (Rotalı Fenci)",
        title: "Fen Bilimleri Öğretmeni & 5/D Şube Rehber Öğretmeni",
        school: "Şehit Öğretmen Ortaokulu",
        academicYear: "2026-2027",
        dutyDay: "Cuma",
        dutyArea: "2. Kat & Fen Laboratuvarı Nöbeti",
        totalLessons: 21,
        fenLessons: 20,
        rehberLessons: 1,
        freeLessons: 14
    },
    classes: [
        { id: "5A", name: "5/A", grade: 5, studentCount: 24, advisor: "Ayşe Yılmaz" },
        { id: "5D", name: "5/D", grade: 5, studentCount: 25, advisor: "Murat Kundakcı" },
        { id: "6G", name: "6/G", grade: 6, studentCount: 27, advisor: "Mehmet Demir" },
        { id: "7A", name: "7/A", grade: 7, studentCount: 28, advisor: "Zeynep Kaya" },
        { id: "7B", name: "7/B", grade: 7, studentCount: 26, advisor: "Ahmet Çelik" }
    ],
    students: [
        // 5/D (Rehberlik Sınıfı)
        { id: "s1_5d", name: "Ahmet Yağız", classId: "5D", no: 15, avatar: "👨‍🎓", notes: "Sınıf içi uyumu yüksek, fen deneylerine çok meraklı.", tags: ["⭐ Başarılı", "🧪 Deney becerisi"] },
        { id: "s2_5d", name: "Elif Sare", classId: "5D", no: 24, avatar: "👩‍🎓", notes: "Rehberlik etkinliklerinde aktif, ödevlerini aksatmaz.", tags: ["⭐ Başarılı", "🎯 Dikkat"] },
        { id: "s3_5d", name: "Mustafa Efe", classId: "5D", no: 32, avatar: "👨‍🎓", notes: "Grup çalışmalarında lider.", tags: ["🤝 İş birliği"] },
        
        // 5/A
        { id: "s7", name: "Kerem Aslan", classId: "5A", no: 42, avatar: "👨‍🎓", notes: "Güneş ve Ay modellerini sunarken çok başarılıydı.", tags: ["🗣️ İletişim", "⭐ Başarılı"] },
        { id: "s1_5a", name: "Azra Demir", classId: "5A", no: 48, avatar: "👩‍🎓", notes: "Etkinlik defterini eksiksiz tamamladı.", tags: ["⭐ Başarılı"] },
        { id: "s2_5a", name: "Batuhan Kurt", classId: "5A", no: 55, avatar: "👨‍🎓", notes: "Fen etkinliklerinde meraklı ve hevesli.", tags: ["🧪 Deney becerisi"] },

        // 6/G
        { id: "s1_6g", name: "Bora Şahin", classId: "6G", no: 81, avatar: "👨‍🎓", notes: "Gezegen modelleri ve tutulma simülasyonlarında çok başarılı.", tags: ["💡 Yaratıcı", "🧪 Deney becerisi"] },
        { id: "s2_6g", name: "Sude Naz", classId: "6G", no: 88, avatar: "👩‍🎓", notes: "Sistemler ünitesinde not tutma disiplini üst düzey.", tags: ["🎯 Dikkat", "⭐ Başarılı"] },
        { id: "s3_6g", name: "Eren Can", classId: "6G", no: 95, avatar: "👨‍🎓", notes: "Ders içi deneylerde aktif katılım gösteriyor.", tags: ["🧪 Deney becerisi"] },

        // 7/A
        { id: "s1", name: "Ali Can", classId: "7A", no: 104, avatar: "👨‍🎓", notes: "Etkinliklerde son derece aktif, grup liderliği güçlü.", tags: ["⭐ Başarılı", "🧪 Deney becerisi", "💡 Yaratıcı"] },
        { id: "s2", name: "Zeynep Beren", classId: "7A", no: 112, avatar: "👩‍🎓", notes: "Ders içi sorumluluk bilinci yüksek, ödevlerini aksatmaz.", tags: ["⭐ Başarılı", "🎯 Dikkat", "🤝 İş birliği"] },
        { id: "s3", name: "Efe Burak", classId: "7A", no: 145, avatar: "👨‍🎓", notes: "Uygulamalı çalışmalarda istekli fakat yazılı ödevlerde desteğe ihtiyacı var.", tags: ["🧪 Deney becerisi", "📚 Akademik destek"] },
        { id: "s4_7a", name: "Ceren Yılmaz", classId: "7A", no: 158, avatar: "👩‍🎓", notes: "Kavram haritaları ve laboratuvar çizimlerinde çok başarılı.", tags: ["⭐ Başarılı", "💡 Yaratıcı"] },
        { id: "s5_7a", name: "Baran Çetin", classId: "7A", no: 164, avatar: "👨‍🎓", notes: "Ödevlerini zamanında getiriyor.", tags: ["🎯 Dikkat"] },
        
        // 7/B
        { id: "s1_7b", name: "Derya Korkmaz", classId: "7B", no: 172, avatar: "👩‍🎓", notes: "Fen deneylerinde aktif katılım sağlıyor.", tags: ["🧪 Deney becerisi"] },
        { id: "s2_7b", name: "Kaan Öztürk", classId: "7B", no: 185, avatar: "👨‍🎓", notes: "Ödev takibi düzenli.", tags: ["⭐ Başarılı"] }
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
            { periodNo: 1, classId: "7/B", subject: "Fen Bilimleri", topic: "Uzay Araştırmaları ve Uzay Teknolojileri", outcomeCode: "FB.7.1.1", outcomeDesc: "Uzay araştırmaları için geliştirilen teknolojileri karşılaştırabilme", room: "Fen Laboratuvarı" },
            { periodNo: 2, classId: "7/B", subject: "Fen Bilimleri", topic: "Uzay Gözlem Araçları ve Teleskop Modeli", outcomeCode: "FB.7.1.2", outcomeDesc: "Uzay gözlem araçları ile ilgili bilimsel model oluşturabilme", room: "Fen Laboratuvarı" },
            { periodNo: 3, classId: "Boş", subject: "Ders Yok", topic: "", outcomeCode: "-", outcomeDesc: "Bu saatte planlanmış dersiniz bulunmamaktadır (Boş Saat / Hazırlık).", room: "Öğretmenler Odası" },
            { periodNo: 4, classId: "7/A", subject: "Fen Bilimleri", topic: "Uzay Araştırmaları ve Uzay Teknolojileri", outcomeCode: "FB.7.1.1", outcomeDesc: "Uzay araştırmaları için geliştirilen teknolojileri karşılaştırabilme", room: "Fen Laboratuvarı" },
            { periodNo: 5, classId: "7/A", subject: "Fen Bilimleri", topic: "Uzay Gözlem Araçları ve Teleskop Modeli", outcomeCode: "FB.7.1.2", outcomeDesc: "Uzay gözlem araçları ile ilgili bilimsel model oluşturabilme", room: "Fen Laboratuvarı" },
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
            { periodNo: 6, classId: "7/A", subject: "Fen Bilimleri", topic: "Uzay Kirliliği ve Çözüm Yolları", outcomeCode: "FB.7.1.3", outcomeDesc: "Uzay araştırmalarının yol açabileceği problemleri çözebilme", room: "Fen Laboratuvarı" },
            { periodNo: 7, classId: "7/A", subject: "Fen Bilimleri", topic: "Yıldızların Oluşumu ve Yaşam Döngüsü", outcomeCode: "FB.7.1.4", outcomeDesc: "Yıldızların yaşamını açıklayarak yapılandırabilme", room: "Fen Laboratuvarı" }
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
            { periodNo: 2, classId: "5/A", subject: "Fen Bilimleri", topic: "Güneş-Dünya-Ay Simülasyonu", outcomeCode: "FB.5.1.4", outcomeDesc: "Güneş, Dünya ve Ay’ın uzaydaki göreli hareketlerini etkileşimli model ve simülasyonla açıklayabilme", room: "Fen Laboratuvarı" },
            { periodNo: 3, classId: "Boş", subject: "Ders Yok", topic: "", outcomeCode: "-", outcomeDesc: "Bu saatte dersiniz bulunmamaktadır (🛡️ Cuma Kat & Teneffüs Nöbet Görevi).", room: "Kat Koridoru" },
            { periodNo: 4, classId: "Boş", subject: "Ders Yok", topic: "", outcomeCode: "-", outcomeDesc: "Bu saatte dersiniz bulunmamaktadır (🛡️ Cuma Kat & Teneffüs Nöbet Görevi).", room: "Kat Koridoru" },
            { periodNo: 5, classId: "7/B", subject: "Fen Bilimleri", topic: "Yıldızların Oluşumu ve Karadelikler", outcomeCode: "FB.7.1.4", outcomeDesc: "Yıldızların yaşamını açıklayarak yapılandırabilme", room: "Fen Laboratuvarı" },
            { periodNo: 6, classId: "7/B", subject: "Fen Bilimleri", topic: "Galaksiler ve Evrenin Yapısı", outcomeCode: "FB.7.1.5", outcomeDesc: "Yıldız, galaksi ve evren kavramlarını açıklayarak yapılandırabilme", room: "Fen Laboratuvarı" },
            { periodNo: 7, classId: "5/D", subject: "Rehberlik ve Yönlendirme", topic: "Sınıf Rehberliği, Uyum ve Verimli Çalışma", outcomeCode: "REHB.5.1", outcomeDesc: "5/D Şube Rehberliği: Okula uyum, akran ilişkileri, verimli ders çalışma teknikleri ve zaman yönetimi rehberlik oturumu.", room: "5/D Sınıfı" }
        ]
    }
};
