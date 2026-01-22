const fs = require('fs');
const path = require('path');

console.log('🧹 Cleaning up conflicting Socket.IO routes...\n');

const filesToDelete = [
  'pages/api/socket.ts',
  'pages/api/socket.js',
  'pages/api/socket.ts.DELETE',
];

const foldersToDelete = [
  'app/api/socket',
];

// Delete files
filesToDelete.forEach(file => {
  const filePath = path.join(__dirname, file);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✅ Deleted file: ${file}`);
    } else {
      console.log(`⏭️  File doesn't exist: ${file}`);
    }
  } catch (error) {
    console.log(`❌ Error deleting ${file}:`, error.message);
  }
});

// Delete folders
foldersToDelete.forEach(folder => {
  const folderPath = path.join(__dirname, folder);
  try {
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true });
      console.log(`✅ Deleted folder: ${folder}`);
    } else {
      console.log(`⏭️  Folder doesn't exist: ${folder}`);
    }
  } catch (error) {
    console.log(`❌ Error deleting ${folder}:`, error.message);
  }
});

console.log('\n✨ Cleanup complete! Now run: npm run dev');
