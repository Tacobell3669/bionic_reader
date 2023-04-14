// Load the PDF file using pdf.js
const pdfData = await fetch('input.pdf').then((res) => res.arrayBuffer());
const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

// Iterate through each page in the PDF
for (let i = 1; i <= pdf.numPages; i++) {
  const page = await pdf.getPage(i);

  // Get the text content of the page
  const textContent = await page.getTextContent();

  // Capitalize the first letter of each word in the text content
  const modifiedTextContent = textContent.items
    .map((item) => ({
      ...item,
      str: item.str.replace(/\b\w/g, (match) => match.toUpperCase()),
    }))
    .reduce((acc, item) => acc + item.str, '');

  // Create a new canvas element to render the modified text
  const viewport = page.getViewport({ scale: 1 });
  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  // Render the modified text to the canvas
  const canvasContext = canvas.getContext('2d');
  await page.render({
    canvasContext,
    viewport,
    textContent: pdfjsLib.getTextContent(modifiedTextContent),
  }).promise;

  // Convert the canvas to a new PDF page
  const newPage = await pdfjsLib.createPage(canvas);
  const newPageViewport = newPage.getViewport({ scale: 1 });

  // Create a new PDF document and add the new page
  const newPdf = await pdfjsLib.getDocument({}).promise;
  const newPdfPage = await newPdf.createPage(newPageViewport);
  await newPdfPage.drawPage(newPage);
  await newPdf.addPage(newPdfPage);

  // Save the new PDF file to disk
  const newPdfData = await newPdf.saveDocument();
  const blob = new Blob([newPdfData], { type: 'application/pdf' });
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = 'modified.pdf';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
