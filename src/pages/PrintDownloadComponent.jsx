import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { PrintQuotation } from './PrintQuotation';

const PrintDownloadComponent = () => {
  const componentRef = useRef(null);  // Initialize the reference

  // Function to print the component
  const handlePrint = () => {
    const printContent = componentRef.current.cloneNode(true); // Clone the component content
    const printWindow = window.open('', '', 'width=800,height=600'); // Open a new print window

    if (printWindow) {
      // Function to handle image loading and ensure print happens after images are loaded
      const waitForImagesToLoad = (content, callback) => {
        const images = content.querySelectorAll('img');
        let loadedImagesCount = 0;
        const totalImages = images.length;

        if (totalImages === 0) {
          callback();
          return;  // If no images, trigger print immediately
        }

        images.forEach((img) => {
          img.onload = () => {
            loadedImagesCount++;
            if (loadedImagesCount === totalImages) {
              callback();  // Trigger the callback once all images are loaded
            }
          };
          img.onerror = () => {
            loadedImagesCount++;
            if (loadedImagesCount === totalImages) {
              callback();  // Continue even if an image fails to load
            }
          };
        });
      };

      // Inject the content into the print window and wait for images to load
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Quotation</title>
            <style>
              @media print {
                body {
                  font-family: Arial, sans-serif;
                }
                img {
                  max-width: 100%;
                  height: auto;
                }
              }
              table, th, td {
                border: 1px solid black;
                border-collapse: collapse;
                padding: 10px;
              }
            </style>
          </head>
          <body>
            <div>${componentRef.current.innerHTML}</div>  <!-- Include all content -->
          </body>
        </html>
      `);

      // Wait for images to load before triggering the print dialog
      waitForImagesToLoad(printWindow.document, () => {
        printWindow.document.close();  // Close the document stream
        printWindow.focus();           // Focus on the new window
        printWindow.print();           // Trigger the print dialog
        printWindow.close();           // Close the print window after printing
      });
    } else {
      console.error('Failed to open print window.');
    }
  };

  // Function to download the component as PDF
  const handleDownloadPdf = () => {
    const element = componentRef.current;
    const opt = {
      filename: 'quotation.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },  // Ensure high-quality rendering with CORS enabled for images
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },  // Adjusted for A4 paper
    };

    if (element) {
      html2pdf().from(element).set(opt).save(); // Save the PDF
    }
  };

  return (
    <div >
<div className="bg-gradient-to-r from-blue-500 to-blue-400 shadow-lg rounded-lg p-6 mb-4 max-w-3xl w-full mx-auto">
  <div className="flex justify-evenly">
    <button 
      onClick={handlePrint} 
      className="bg-white hover:bg-gray-100 text-blue-500 font-bold py-3 px-6 rounded-lg shadow transition duration-200 ease-in-out transform hover:scale-105"
    >
      Print
    </button>
    <button 
      onClick={handleDownloadPdf} 
      className="bg-white hover:bg-gray-100 text-green-500 font-bold py-3 px-6 rounded-lg shadow transition duration-200 ease-in-out transform hover:scale-105"
    >
      Download PDF
    </button>
  </div>
</div>
      <PrintQuotation ref={componentRef} />
    </div>
  );
};

export default PrintDownloadComponent;