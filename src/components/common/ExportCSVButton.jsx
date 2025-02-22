import React from 'react';

const ExportCSVButton = ({ data, filename = 'export.csv', headers }) => {
  const exportToCSV = () => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }

    // Prepare CSV content
    const csvHeaders = headers ? headers.join(',') : Object.keys(data[0]).join(',');
    const csvRows = data.map(row =>
      Object.values(row).map(value => `"${value}"`).join(',')
    );

    const csvContent = [csvHeaders, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={exportToCSV}
      className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
    >
      Export to CSV
    </button>
  );
};

export default ExportCSVButton;
