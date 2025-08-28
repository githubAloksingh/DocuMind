// src/lib/textExtraction.ts
import * as pdfjsLib from "pdfjs-dist";
import Tesseract from "tesseract.js";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * Extract text from a PDF file. If a page has no selectable text, render it to canvas and OCR it.
 */
export async function extractTextFromPDF(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);

      // Try extracting selectable text first
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(" ").trim();

      if (pageText.length > 40) {
        fullText += pageText + "\n\n";
        if (onProgress) onProgress(Math.round((i / pdf.numPages) * 100));
        continue;
      }

      // Otherwise, fallback to OCR by rendering the page
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not create canvas context");
      await page.render({ canvasContext: ctx, viewport }).promise;

      const { data: { text } } = await Tesseract.recognize(canvas, "eng", {
        logger: (info) => {
          if (info.status === "recognizing text" && onProgress) {
            const base = ((i - 1) / pdf.numPages) * 100;
            const pct = base + info.progress * (100 / pdf.numPages);
            onProgress(Math.min(100, Math.round(pct)));
          }
        }
      });

      fullText += text.trim() + "\n\n";
      if (onProgress) onProgress(Math.round((i / pdf.numPages) * 100));
    }

    return fullText.trim();
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF. Please ensure the file is not corrupted.");
  }
}

/**
 * Extract text from an image file using Tesseract.js v6
 */
export async function extractTextFromImage(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    const { data: { text } } = await Tesseract.recognize(file, "eng", {
      logger: (info) => {
        if (info.status === "recognizing text" && onProgress) {
          onProgress(Math.round(info.progress * 100));
        }
      }
    });
    return text.trim();
  } catch (error) {
    console.error("Error performing OCR:", error);
    throw new Error("Failed to extract text from image. Please try a clearer image.");
  }
}

/**
 * Generic entry point
 */
export async function extractText(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  const mime = file.type || "";
  if (mime === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    return extractTextFromPDF(file, onProgress);
  } else if (mime.startsWith("image/")) {
    return extractTextFromImage(file, onProgress);
  } else if (mime.startsWith("text/")) {
    const txt = await file.text();
    if (onProgress) onProgress(100);
    return txt;
  } else {
    throw new Error("Unsupported file type. Please upload a PDF or image file.");
  }
}
