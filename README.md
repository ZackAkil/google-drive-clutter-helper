## Google Drive Clutter Helper with Google Apps Script

This Google Apps Script helps you analyze a folder in your Google Drive and summarize the file types, count, and total size in a Google Sheet. This can be helpful for identifying potential clutter and optimizing your storage usage.

**Important Note:**

* This script currently analyzes the contents of the specified folder only. It does **not** explore subfolders within the chosen folder. 

If you need to analyze files across subfolders, you'll need to modify the script to handle recursion. This would involve iterating through subfolders and applying the analysis logic to each one. 

###  How to Use

**1. Create a New Google Sheet:**

* Open your Google Drive and click "New" > "Google Sheet."

**2. Add the Apps Script:**

* Go to **Extensions** > **Apps Script**.
* This will open the script editor window. You can delete any default code that might be present.

**3. Copy and Paste the Script:**

* Copy the entire code snippet provided below and paste it into the script editor window.

```javascript
function run(){
  // Example usage (replace 'FOLDER_ID' with your actual folder ID)
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
```

**4. Save the Script:**

* Click **File** > **Save**. Give your script a descriptive name (e.g., "GoogleDriveClutterHelper").

**5. Run the Script (Optional):**

* The provided code includes a function called `run` that demonstrates how to analyze a specific folder using its ID.  You can replace `'FOLDER_ID'` with the actual ID of the folder you want to analyze. 
* **Important:**  Folder IDs can be found in the URL of the folder in your Google Drive. 
* To run the script with a specific folder ID, go back to the **Script editor** and click the **Run** button (triangle icon) and select the `run` function.

**6. Analyze a Different Folder:**

* By default, the script analyzes your root Google Drive folder. 
* If you want to analyze a specific folder, you'll need to modify the script. 
* Find the line:

```javascript
  analyzeFolder('FOLDER_ID');
```

* Replace the folder ID with the ID of the folder you want to analyze.

**7. Understanding the Results:**

* The script will populate your Google Sheet with a breakdown of file types, their count, and total size in megabytes.
* This information can help you identify areas for potential cleanup or reorganization of your Google Drive.

**Note:**

* This script requires basic Google Apps Script knowledge for customization, such as modifying the folder ID.
