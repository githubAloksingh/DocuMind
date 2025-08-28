import * as pdfjsLib from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

async function extractTextFromPDFWithOCR(file: File, onProgress?: (progress: number) => void): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 }); // increase resolution
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport }).promise;
    const dataUrl = canvas.toDataURL();

    const ocrText = await extractTextFromImage(
      dataURLtoFile(dataUrl, `page-${i}.png`),
      onProgress
    );
    fullText += ocrText + '\n\n';

    if (onProgress) {
      onProgress((i / pdf.numPages) * 100);
    }
  }

  return fullText.trim();
}

// helper to convert DataURL -> File
function dataURLtoFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}


export async function extractTextFromPDF(file: File, onProgress?: (progress: number) => void): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n\n';
      
      if (onProgress) {
        onProgress((i / pdf.numPages) * 100);
      }
    }

    return fullText.trim();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF. Please ensure the file is not corrupted.');
  }
}

export async function extractTextFromImage(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    const worker = await createWorker({
      logger: (info) => {
        if (info.status === 'recognizing text' && onProgress) {
          onProgress(info.progress * 100);
        }
      },
    });

    await worker.load();                    // <--- missing in your code
    await worker.loadLanguage('eng');
    await worker.reinitialize('eng');

    // Safer to use blob URL
    const imageUrl = URL.createObjectURL(file);

    const {
      data: { text },
    } = await worker.recognize(imageUrl);

    await worker.terminate();
    URL.revokeObjectURL(imageUrl);

    return text.trim();
  } catch (error) {
    console.error('Error performing OCR:', error);
    throw new Error('Failed to extract text from image. Please try a clearer image.');
  }
}


export async function extractText(file: File, onProgress?: (progress: number) => void): Promise<string> {
  if (file.type === 'application/pdf') {
    const text = await extractTextFromPDF(file, onProgress);
    if (text.trim().length > 0) {
      return text; // real text PDF
    } else {
      // fallback: render PDF pages to images and OCR them
      return await extractTextFromPDFWithOCR(file, onProgress);
    }
  } else if (file.type.startsWith('image/')) {
    return extractTextFromImage(file, onProgress); // Tesseract OCR
  } else {
    throw new Error('Unsupported file type. Please upload a PDF or image file.');
  }
}
