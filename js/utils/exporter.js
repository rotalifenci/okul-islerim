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
    
    // Excel (.xls) Dosyası Olarak Dışa Aktar (Stilli & Türkçe Karakter Destekli)
    exportHtmlTableToExcel(filename, title, headers, rows) {
        let tableHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>${title}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        <style>
            th { background-color: #dc2626; color: #ffffff; font-weight: bold; border: 1px solid #999; padding: 8px; font-family: Segoe UI, Arial, sans-serif; font-size: 11pt; text-align: left; }
            td { border: 1px solid #ccc; padding: 6px; font-family: Segoe UI, Arial, sans-serif; font-size: 10pt; }
            h2 { font-family: Segoe UI, Arial, sans-serif; color: #1e293b; margin-bottom: 10px; }
        </style></head><body>
        <h2>${title}</h2>
        <table border="1"><thead><tr>`;
        headers.forEach(h => { tableHtml += `<th>${h}</th>`; });
        tableHtml += `</tr></thead><tbody>`;
        rows.forEach(r => {
            tableHtml += `<tr>`;
            r.forEach(c => { tableHtml += `<td>${c !== undefined && c !== null ? c : ''}</td>`; });
            tableHtml += `</tr>`;
        });
        tableHtml += `</tbody></table></body></html>`;

        const blob = new Blob(['\ufeff' + tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const cleanName = filename.toLowerCase().replace(/[^a-z0-9_]/gi, '_');
        a.download = cleanName.endsWith('.xls') ? cleanName : `${cleanName}.xls`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    // CSV Formatında İndir
    exportToCSV(filename, headers, rows) {
        let csvContent = '\ufeff';
        csvContent += headers.map(h => `"${(h || '').toString().replace(/"/g, '""')}"`).join(';') + '\r\n';
        rows.forEach(row => {
            csvContent += row.map(cell => `"${(cell !== undefined && cell !== null ? cell : '').toString().replace(/"/g, '""')}"`).join(';') + '\r\n';
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const cleanName = filename.toLowerCase().replace(/[^a-z0-9_]/gi, '_');
        a.download = cleanName.endsWith('.csv') ? cleanName : `${cleanName}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    copyToClipboard(text, notifyFn) {
        navigator.clipboard.writeText(text).then(() => {
            if (notifyFn) notifyFn("Metin panoya başarıyla kopyalandı! 📋");
        }).catch(() => {
            alert("Kopyalama başarısız oldu!");
        });
    }
};
