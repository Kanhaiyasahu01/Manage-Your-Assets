const express = require("express");
const router = express.Router();
const backupController = require("../controllers/backupController");


const {
    backupDatabase,
    restoreDatabase,
    deleteBackup,
    listBackups,
} = require("../controllers/backupController")

// 🔄 Manual Trigger for Backup
router.get("/backup", (req, res) => {
    backupController.backupDatabase();
    res.status(200).json({ success: true, message: "Manual Backup Triggered" });
});

// ♻️ Restore from a Backup
router.post("/restore", restoreDatabase);

// 📋 List All Backups
router.get("/backups", listBackups);

// ❌ Delete a Backup
router.delete("/delete",deleteBackup);

module.exports = router;
