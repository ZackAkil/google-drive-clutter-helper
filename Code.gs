function run(){
analyzeFolder('FOLDER_ID');
}

function analyzeFolder(folderId) {
  // Spreadsheet setup
  var sheet = SpreadsheetApp.getActiveSheet();
  sheet.clear(); // Clear existing data (optional)

  sheet.appendRow(["File Type", "Count", "Total Size (MB)"]);

  // Folder and file access
  var folder = null
  if (folderId)
    folder = DriveApp.getFolderById(folderId);
  else
    folder = DriveApp.getRootFolder()

  var files = folder.getFiles();

  // Data collection
  var fileTypes = {};
  var totalSize = 0;
  while (files.hasNext()) {
    var file = files.next();
    var type = file.getMimeType();
    if (!fileTypes[type]) {
      fileTypes[type] = { count: 0, size: 0 };
    }
    fileTypes[type].count++;
    fileTypes[type].size += file.getSize();
    totalSize += file.getSize();
  }

  // Convert bytes to megabytes and write data to spreadsheet
  const conversionFactor = 1024 * 1024; // 1024 bytes/KB * 1024 KB/MB
  for (var type in fileTypes) {
    var data = [
      type,
      fileTypes[type].count,
      fileTypes[type].size / conversionFactor,
    ];
    sheet.appendRow(data);
  }

  sheet.appendRow(["Total", "", totalSize / conversionFactor]); // Add total row
}

