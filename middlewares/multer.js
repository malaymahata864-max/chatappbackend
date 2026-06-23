const multer = require("multer");

// Export a factory function so routes can call multer().single('image')
const storage = () => multer({ dest: "uploads/" });

module.exports = storage;