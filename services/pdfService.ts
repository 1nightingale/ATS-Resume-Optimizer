// By loading pdf.js via a <script> tag, it attaches itself to the window object.
// We declare its expected shape on the global window object for TypeScript.
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

export const extractTextFromPdf = async (file: File): Promise<string> => {
    // Check if the pdf.js library has been loaded into the global scope.
    if (typeof window.pdfjsLib === 'undefined') {
        console.error("pdf.js library is not loaded. Ensure the script tag in index.html is correct.");
        throw new Error("PDF processing library failed to load. Please check your internet connection or try refreshing the page.");
    }
    
    const pdfjsLib = window.pdfjsLib;
    // Using an older, stable version from a different CDN to maximize compatibility.
    const pdfjsVersion = '2.16.105';
    
    // The worker is essential for parsing and must be loaded from the same source as the main library.
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    
    // The getDocument method expects an object with the data.
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        // textContent.items is an array of TextItem objects which have a 'str' property.
        const pageText = textContent.items.map((item: any) => ('str' in item ? item.str : '')).join(' ');
        fullText += pageText + '\n';
    }
    return fullText.trim();
};