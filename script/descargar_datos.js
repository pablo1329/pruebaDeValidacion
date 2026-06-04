function exportTableToExcel(tableID, filename = '') {
  var tableHTML = document.getElementById(tableID).outerHTML;
  var blob = new Blob([
    new Uint8Array([0xEF, 0xBB, 0xBF]), // UTF-8 BOM
    tableHTML
  ], {
    type: "application/vnd.ms-excel;charset=utf-8"
  });

  // Create download link element
  var downloadLink = document.createElement("a");

  document.body.appendChild(downloadLink);

  // Create a link to the file
  downloadLink.href = URL.createObjectURL(blob);

  // Specify file name
  filename = filename ? filename + '.xls' : 'excel_data.xls';

  // Setting the file name
  downloadLink.download = filename;

  //triggering the function
  downloadLink.click();
}