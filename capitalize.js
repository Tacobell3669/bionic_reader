// Get the file input element from the HTML DOM
const fileInput = document.querySelector('input[type="file"]');

// Add an event listener to the file input element to handle file selection
fileInput.addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
  const file = event.target.files[0];
  
  // Create a new FileReader object
  const reader = new FileReader();
  
  // Add an event listener to the FileReader object to handle file reading
  reader.addEventListener('load', handleFileRead);
  
  // Read the file as text
  reader.readAsText(file);
}

function handleFileRead(event) {
  const text = event.target.result;
  
  // Capitalize the first letter of every word in the text
  const capitalizedText = text.replace(/\b\w/g, (match) => match.toUpperCase());
  
  // Create a new Blob object from the capitalized text
  const blob = new Blob([capitalizedText], { type: 'text/plain' });
  
  // Create a new anchor element to download the modified file
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = 'modified.txt';
  
  // Simulate a click on the download link to trigger file download
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
