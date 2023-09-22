document.addEventListener('DOMContentLoaded', function() {
    const pdfInput = document.getElementById('pdfInput');
    const analyzeButton = document.getElementById('analyzeButton');
    const result = document.getElementById('result');
    const loading = document.getElementById('loading');

    analyzeButton.addEventListener('click', async function() {
        const file = pdfInput.files[0];
        if (file) {
            try {
                // Show loading animation
                loading.style.display = 'block';
                
                const pdfText = await extractTextFromPDF(file);
                const letterCount = countLetters(pdfText);
                const ntins = calculateTins(letterCount);
                displayResult(ntins);

                // Hide loading animation
                loading.style.display = 'none';
            } catch (error) {
                alert('Error analyzing PDF: ' + error.message);
                // Hide loading animation on error
                loading.style.display = 'none';
            }
        } else {
            alert('Please select a PDF file.');
        }
    });

    async function extractTextFromPDF(file) {
        const arrayBuffer = await readFileAsArrayBuffer(file);
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        const textContent = [];
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const pageText = await page.getTextContent();
            pageText.items.forEach(item => {
                textContent.push(item.str);
            });
        }
        return textContent.join('\n');
    }

    function countLetters(text) {
        const letterCount = {};
        text = text.toLowerCase();
        for (const char of text) {
            if (/[a-z]/.test(char)) {
                if (letterCount[char]) {
                    letterCount[char]++;
                } else {
                    letterCount[char] = 1;
                }
            }
        }
        return letterCount;
    }

    function calculateTins(letterCount) {
        const d = {
            'a': 2.28,
            'b': 2.37,
            'c': 2.45,
            'd': 2.2,
            'e': 2.71,
            'f': 2.62,
            'g': 2.37,
            'h': 2.2,
            'i': 2.37,
            'j': 2.54,
            'k': 3.3,
            'l': 2.71,
            'm': 2.28,
            'n': 2.12,
            'o': 37.3,
            'p': 2.96,
            'q': 2.2,
            'r': 3.13,
            's': 2.54,
            't': 2.62,
            'u': 2.37,
            'v': 2.12,
            'w': 2.62,
            'x': 2.37,
            'y': 2.2,
            'z': 3.05
        };
        const pc = 1182;

        let ntins = 0;
        for (const k in letterCount) {
            if (d.hasOwnProperty(k)) {
                const bags = letterCount[k] / ((d[k] / 100) * pc);
                ntins = Math.max(ntins, bags);
            }
        }

        return ntins;
    }

    function displayResult(ntins) {
        result.innerHTML = `<h3>${ntins} tins of spagghetios</h3>`;
    }

    function readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsArrayBuffer(file);
        });
    }
});
