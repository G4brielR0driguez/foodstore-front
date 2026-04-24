from pypdf import PdfReader

reader = PdfReader('Parcial 1 programacion 4.pdf')
with open('pdf_content.txt', 'w', encoding='utf-8') as f:
    for page in reader.pages:
        f.write(page.extract_text() + '\n')
