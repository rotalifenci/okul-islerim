// Rotalı Fenci - Yazdırma, PDF, Word ve Dışa Aktarma Yardımcısı
window.Exporter = {
    // Belirli bir HTML elementini veya içeriği yazdır
    printContent(title, htmlContent) {
        const printWindow = window.open('', '_blank', 'width=900,height=700');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="tr">
            <head>
                <meta charset="UTF-8">
                <title>${title} - Rotalı Fenci</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                    @media print {
                        @page { margin: 1.5cm; size: A4 portrait; }
                        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        .no-print { display: none !important; }
                    }
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; }
                    .cert-border { border: 8px double #4f46e5; }
                </style>
            </head>
            <body class="p-6 bg-white text-slate-900">
                <div class="max-w-4xl mx-auto">
                    <div class="flex justify-between items-center mb-6 pb-4 border-b border-slate-200 no-print">
                        <span class="font-bold text-indigo-600 text-lg">🚀 Rotalı Fenci — Çıktı Önizleme</span>
                        <button onclick="window.print()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg shadow">
                            🖨️ Sayfayı Yazdır / PDF Kaydet
                        </button>
                    </div>
                    <div>${htmlContent}</div>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
    },

    // Word (.doc) Dosyası Olarak İndir
    exportToWord(title, htmlContent) {
        const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' ` +
            `xmlns:w='urn:schemas-microsoft-com:office:word' ` +
            `xmlns='http://www.w3.org/TR/REC-html40'>` +
            `<head><meta charset='utf-8'><title>${title}</title>` +
            `<style>body{font-family:Arial, sans-serif; line-height:1.5; font-size:11pt;} table{border-collapse:collapse; width:100%;} th, td{border:1px solid #ccc; padding:6px;} h1{color:#312e81;} h2{color:#4338ca;}</style>` +
            `</head><body><h2>${title}</h2><hr/>`;
        const footer = `</body></html>`;
        const sourceHTML = header + htmlContent + footer;
        
        const blob = new Blob(['\ufeff' + sourceHTML], {
            type: 'application/msword'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.doc`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    // Tek Dosya Bağımsız İnteraktif HTML İndir (Web Materyali)
    downloadStandaloneHtml(title, interactiveCode) {
        const blob = new Blob([interactiveCode], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    // Metni Panoya Kopyala
    copyToClipboard(text, notifyFn) {
        navigator.clipboard.writeText(text).then(() => {
            if (notifyFn) notifyFn("Metin panoya başarıyla kopyalandı! 📋");
        }).catch(() => {
            alert("Kopyalama başarısız oldu!");
        });
    }
};
