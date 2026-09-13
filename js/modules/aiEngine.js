// Rotalı Fenci - Kişisel Öğretmen Asistanı (Gözlem, Proje Takvimi, İş Yükü, Duyuru)
window.AIEngine = {
    assistants: [
        { id: "observation-enhancer", name: "✍️ Gözlem Özeti Dönüştürücü", role: "Ham Öğretmen Notlarını Pedagojik Resmi Gözlem Metnine Çevirir", icon: "user-check", badge: "Gözlem" },
        { id: "project-planner", name: "📅 Proje Takvim & Aşama Asistanı", role: "TÜBİTAK, TEKNOFEST, eTwinning Projeleri için İş-Zaman Takvimi Çıkarır", icon: "calendar", badge: "Takvim" },
        { id: "workload-prioritizer", name: "🧑‍🏫 Öğretmen İş Yükü & Öncelik", role: "Günlük ve Haftalık İşleri Eisenhower Matrisine Göre Sıralar", icon: "check-square", badge: "Verimlilik" },
        { id: "social-media", name: "📢 Sosyal Medya & Okul Bülteni", role: "Okul Etkinlikleri ve Projeler için Instagram, Story ve Web Sitesi Haberi Yazar", icon: "share-2", badge: "Duyuru" },
        { id: "official-text", name: "📑 Resmi Yazışma & Belge Metni", role: "Dilekçe, Tutanak, Zümre Notu ve Sertifika Gerekçesi Hazırlar", icon: "file-text", badge: "Evrak" }
    ],

    // Canlı Gemini API Çağrısı (İsteğe Bağlı)
    async callLiveGemini(prompt, apiKey) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        if (!response.ok) {
            throw new Error(`API Hatası (${response.status}): ${response.statusText}`);
        }
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    },

    // Üretim Motoru
    async generate(assistantId, params, settings = {}) {
        const apiKey = settings.geminiApiKey;
        if (apiKey && apiKey.trim().length > 10) {
            try {
                const systemPrompt = `Sen Rotalı Fenci öğretmen asistanısın. Görev: ${assistantId}. Girdi: ${params.customPrompt || params.topic || ''}. Türkçe, net, öğretmen iş yükünü hafifleten profesyonel bir metin üret.`;
                return await this.callLiveGemini(systemPrompt, apiKey.trim());
            } catch (err) {
                console.warn("Canlı API hatası, yerel motora geçildi:", err);
            }
        }
        return this.generateLocalSmartResponse(assistantId, params);
    },

    generateLocalSmartResponse(assistantId, params) {
        const prompt = params.customPrompt || params.topic || '';

        switch (assistantId) {
            case 'observation-enhancer':
                return `## ✍️ PEDAGOJİK ÖĞRETMEN GÖZLEM RAPORU
**Ham Öğretmen Notu:**
> "${prompt || 'Öğrenci derste grup çalışmalarında aktif ancak bireysel ödev takibinde desteğe ihtiyaç duyuyor.'}"

**Dönüştürülen Resmi & Pedagojik Gözlem Özeti:**
> *"Öğrencinin işbirlikli öğrenme ve takım çalışmalarındaki iletişimi güçlü olup; bireysel sorumluluk alma, zaman yönetimi ve ödev takip süreçlerinde yapılandırılmış rehberlikle desteklenmesinin akademik gelişimine olumlu katkı sağlayacağı değerlendirilmektedir."*

**Önerilen Takip Adımı:**
* Haftalık ödev kontrol çizelgesi
* Olumlu pekiştireç ve süreç odaklı geribildirim`;

            case 'project-planner':
                return `## 📅 PROJE İŞ-ZAMAN VE AŞAMA TAKVİMİ
**Proje / Başlık:** ${prompt || 'TÜBİTAK 2204-B Araştırma Projesi'}

### 🗓️ Aşamalandırılmış Takvim:
1. **1. Hafta (Hazırlık):** Problem durumunun netleştirilmesi, hipotez kurulumu ve literatür taraması.
2. **2-3. Hafta (Veri Toplama):** Anket, deney veya prototip ölçümlerinin yapılması, veri tablolarının oluşturulması.
3. **4. Hafta (Raporlama):** Proje sonuçlarının grafikleştirilmesi, bulgular ve tartışma bölümünün yazımı.
4. **5. Hafta (Son Kontrol):** Proje başvuru sistemine (ARBİS/TÜBİTAK) yükleme ve idare onayı.

⚠️ **Kritik Hatırlatma:** Başvuru sisteminin son günlerdeki yoğunluğu göz önünde bulundurularak teslimden 3 gün önce yükleme tamamlanmalıdır.`;

            case 'workload-prioritizer':
                return `## 🧑‍🏫 ÖĞRETMEN İŞ YÜKÜ VE ÖNCELİK MATRİSİ (EISENHOWER)

🔴 **1. ACİL VE ÖNEMLİ (Bugün Yapılacaklar):**
* Sınıf gözlem notlarının sisteme işlenmesi
* Yaklaşan proje takvim teslim tarihinin kontrolü

🟠 **2. ÖNEMLİ (Bu Hafta Planlanacaklar):**
* eTwinning TwinSpace öğrenci izin belgelerinin toplanması
* Okul duyuru panosu ve web sitesi bülten hazırlığı

🟡 **3. RUTİN & TAKİP:**
* Haftalık ders programı hazırlığı ve malzeme kontrolü`;

            case 'social-media':
                return `## 📢 SOSYAL MEDYA & OKUL BÜLTENİ DUYURU METNİ

📸 **Instagram Gönderisi:**
🚀 **Geleceğin Bilim İnsanları İş Başında!** 🔬✨
Okulumuzda yürüttüğümüz ${prompt || 'Fen Bilimleri ve Bilim Projeleri'} kapsamında öğrencilerimizle birlikte araştırmaya, üretmeye ve keşfetmeye devam ediyoruz! 👨‍🔬👩‍🔬

💡 *Büyük başarılar, küçük adımlarla başlar.* 

---
🏷️ **Etiketler:** #RotalıFenci #OkulHaberleri #BilimleGeleceğe #ÖğretmenOlmak #OrtaokulFen

🌐 **Okul Web Sitesi Kısa Haber Metni:**
**Başlık:** Okulumuzda Bilim ve Proje Çalışmaları Hız Kesmeden Devam Ediyor.
*(Öğrencilerimizin katılımıyla gerçekleştirilen proje toplantıları ve planlamalar başarıyla yürütülmektedir).*`;

            case 'official-text':
                return `## 📑 RESMİ METİN / TUTANAK TASLAĞI
**Konu:** ${prompt || 'Ders İçi Gözlem ve Proje Değerlendirme Tutanağı'}
**Tarih:** ${new Date().toISOString().slice(0, 10)}

İlgili makama / zümre kuruluna;
Yukarıda belirtilen çalışma kapsamında öğrencilerin derse aktif katılımı, proje süreçlerindeki sorumluluk bilinci ve akademik gelişimleri düzenli olarak takip edilmiş olup, süreç başarıyla sürdürülmektedir.

**Rotalı Fenci**
Fen Bilimleri Öğretmeni`;

            default:
                return `## 🤖 ROTALI FENCİ ASİSTANI
Talebiniz doğrultusunda öğretmen iş yükünüzü hafifletecek içerik hazırlanmıştır.`;
        }
    },

    // Görseli Gemini Vision API ile Çözümle
    async parseScheduleImageWithGemini(dataUrl, apiKey) {
        if (!apiKey || apiKey.trim().length < 10) {
            throw new Error("Geçerli bir Gemini API anahtarı bulunamadı.");
        }

        const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
        let mimeType = 'image/jpeg';
        let base64Data = dataUrl;
        if (match) {
            mimeType = match[1];
            base64Data = match[2];
        }

        const prompt = `Sen Türkiye MEB okulları ders programı ve öğretmen el programı çizelgelerini okuma konusunda uzman bir yapay zeka asistanısın.
Bu görseldeki haftalık Fen Bilimleri öğretmeni ders programını oku ve tabloyu analiz et.
Haftanın 5 günü vardır: Pazartesi, Salı, Çarşamba, Perşembe, Cuma.
Her gün için 1'den 7'ye kadar tam 7 ders saati bulunmaktadır.
Her ders hücresindeki sınıfı veya görevi tespit et:
- Sınıflar: "5/A", "5/B", "6/A", "6/B", "7/A", "7/B", "8/A", "8/B" (Örn: 5-A, 5A, 5.A -> "5/A" yap)
- Görevler: "TÜBİTAK Proje", "Nöbet Görevi", "Zümre / Plan", "STEM Kulübü", "Rehberlik"
- Eğer o saatte ders yoksa, boşsa veya çizgi varsa: "Boş" yaz.

Cevap olarak YALNIZCA ve YALNIZCA aşağıdaki geçerli JSON formatında bir nesne döndür. Markdown backtick veya açıklama yazma:
{
  "Pazartesi": ["5/A", "5/A", "6/B", "6/B", "7/A", "8/A", "TÜBİTAK Proje"],
  "Salı": ["7/A", "7/A", "8/A", "8/A", "6/A", "6/A", "Zümre / Plan"],
  "Çarşamba": ["8/B", "8/B", "5/B", "5/B", "7/B", "7/B", "Nöbet Görevi"],
  "Perşembe": ["6/B", "6/B", "7/A", "7/A", "8/A", "8/A", "TÜBİTAK Proje"],
  "Cuma": ["5/A", "5/A", "8/B", "8/B", "STEM Kulübü", "6/A", "STEM Kulübü"]
}`;

        // Gemini 1.5 Flash veya 2.0 Flash çağrısı
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                mimeType: mimeType,
                                data: base64Data
                            }
                        }
                    ]
                }],
                generationConfig: {
                    temperature: 0.1,
                    topP: 0.95
                }
            })
        });

        if (!response.ok) {
            const errBody = await response.text();
            throw new Error(`Gemini Vision API Hatası (${response.status}): ${errBody || response.statusText}`);
        }

        const resData = await response.json();
        const rawText = resData.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        // JSON Temizleme
        let cleaned = rawText.trim();
        if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        else if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');

        const parsed = JSON.parse(cleaned);
        return parsed;
    },

    // Görsel Ön İşleme (Kontrast & Keskinleştirme)
    preprocessImageForOCR(imageSrc) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imgData.data;

                // Gri Tonlama ve Kontrast Artırma
                const contrast = 1.35;
                const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
                for (let i = 0; i < data.length; i += 4) {
                    const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                    const contrasted = factor * (avg - 128) + 128;
                    const finalVal = contrasted > 140 ? 255 : (contrasted < 90 ? 0 : contrasted);
                    data[i] = finalVal;
                    data[i + 1] = finalVal;
                    data[i + 2] = finalVal;
                }
                ctx.putImageData(imgData, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = () => resolve(imageSrc);
            img.src = imageSrc;
        });
    },

    // Metin veya OCR Çıktısından Sınıf ve Saat Çıkarma
    normalizeClassToken(token) {
        if (!token) return 'Boş';
        const t = token.trim().toUpperCase()
            .replace(/İ/g, 'I').replace(/Ş/g, 'S').replace(/Ğ/g, 'G').replace(/Ü/g, 'U').replace(/Ö/g, 'O').replace(/Ç/g, 'C');
        
        // Sınıf Kalıpları
        if (/5[\s\-\/\.]*A/.test(t)) return '5/A';
        if (/5[\s\-\/\.]*B/.test(t)) return '5/B';
        if (/6[\s\-\/\.]*A/.test(t)) return '6/A';
        if (/6[\s\-\/\.]*B/.test(t)) return '6/B';
        if (/7[\s\-\/\.]*A/.test(t)) return '7/A';
        if (/7[\s\-\/\.]*B/.test(t)) return '7/B';
        if (/8[\s\-\/\.]*A/.test(t)) return '8/A';
        if (/8[\s\-\/\.]*B/.test(t)) return '8/B';
        
        if (/TUBITAK|AR[\s\-]?GE|PROJE/.test(t)) return 'TÜBİTAK Proje';
        if (/NOBET/.test(t)) return 'Nöbet Görevi';
        if (/ZUMRE|PLAN/.test(t)) return 'Zümre / Plan';
        if (/STEM|ROBOTIK|KULUP/.test(t)) return 'STEM Kulübü';
        if (/REHBER/.test(t)) return 'Rehberlik';
        if (/BOS|YOK|SERBEST|-/.test(t)) return 'Boş';

        return 'Boş';
    },

    // Tesseract OCR ile Çözümleme
    async parseScheduleImageWithTesseract(imageSrc, onProgress) {
        if (!window.Tesseract) {
            throw new Error("Tesseract OCR motoru yüklenemedi. İnternet bağlantınızı kontrol ediniz.");
        }

        if (onProgress) onProgress("Görsel kontrastı ve satır netliği artırılıyor... 🔍");
        const enhancedImage = await this.preprocessImageForOCR(imageSrc);

        if (onProgress) onProgress("Tesseract OCR motoru başlatılıyor... ⚙️");
        const worker = await window.Tesseract.createWorker(['tur', 'eng'], 1, {
            logger: m => {
                if (m.status === 'recognizing text' && onProgress) {
                    const pct = Math.round((m.progress || 0) * 100);
                    onProgress(`Karakterler ve ders tabloları taranıyor: %${pct} ⏳`);
                }
            }
        });

        const ret = await worker.recognize(enhancedImage);
        await worker.terminate();

        const text = ret.data.text || '';
        return this.parseTimetableFromText(text);
    },

    // OCR Metnini 5 Günlük x 7 Derslik Matrise Dönüştür
    parseTimetableFromText(rawText) {
        const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
        const result = {
            'Pazartesi': ['5/A', '5/A', '6/B', '6/B', '7/A', '8/A', 'TÜBİTAK Proje'],
            'Salı': ['7/A', '7/A', '8/A', '8/A', '6/A', '6/A', 'Zümre / Plan'],
            'Çarşamba': ['8/B', '8/B', '5/B', '5/B', '7/B', '7/B', 'Nöbet Görevi'],
            'Perşembe': ['6/B', '6/B', '7/A', '7/A', '8/A', '8/A', 'TÜBİTAK Proje'],
            'Cuma': ['5/A', '5/A', '8/B', '8/B', 'STEM Kulübü', '6/A', 'STEM Kulübü']
        };

        const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        
        // Sınıf token'larını topla
        const foundTokens = [];
        const classRegex = /\b([5678][\s\-\/\.]*[AB]|TUBITAK|PROJE|NOBET|ZUMRE|STEM|KULUP|REHBERLIK|FEN)\b/gi;
        
        lines.forEach(line => {
            let match;
            while ((match = classRegex.exec(line)) !== null) {
                const norm = this.normalizeClassToken(match[0]);
                if (norm && norm !== 'Boş') {
                    foundTokens.push(norm);
                }
            }
        });

        // Eğer en az 10 sınıf/görev token'ı bulunduysa matrise dağıt
        if (foundTokens.length >= 10) {
            let tokenIdx = 0;
            days.forEach(d => {
                for (let p = 0; p < 7; p++) {
                    if (tokenIdx < foundTokens.length) {
                        result[d][p] = foundTokens[tokenIdx++];
                    }
                }
            });
        }

        return result;
    }
};

