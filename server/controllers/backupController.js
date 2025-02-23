const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const cron = require("node-cron");

const BACKUP_DIR = path.join(__dirname, "..", "backups");
const MONGO_URI = "mongodb://localhost:27017/your_database"; // Replace with your DB URI

// Ensure the backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR);
}

// ✅ 1. Backup Database Function
const backupDatabase = async () => {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}`);

        const dumpCommand = `mongodump --uri="${MONGO_URI}" --out="${backupPath}"`;

        exec(dumpCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Backup error: ${error.message}`);
                return;
            }
            if (stderr) console.error(`Backup stderr: ${stderr}`);
            console.log(`Backup completed successfully: ${stdout}`);
        });
    } catch (err) {
        console.error("Backup failed:", err);
    }
};

// ✅ 2. Restore Database
const restoreDatabase = async (req, res) => {
    try {
        const { backupFolder } = req.body;

        if (!backupFolder) {
            return res.status(400).json({ success: false, message: "Backup folder path is required" });
        }

        const restorePath = path.join(BACKUP_DIR, backupFolder);

        if (!fs.existsSync(restorePath)) {
            return res.status(404).json({ success: false, message: "Backup folder not found" });
        }

        const restoreCommand = `mongorestore --uri="${MONGO_URI}" "${restorePath}" --drop`;

        exec(restoreCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Restore error: ${error.message}`);
                return res.status(500).json({ success: false, message: "Restore failed", error: error.message });
            }
            if (stderr) console.error(`Restore stderr: ${stderr}`);
            console.log(`Restore completed: ${stdout}`);
            res.status(200).json({ success: true, message: "Restore successful" });
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
};

// ✅ 3. List All Backups
const listBackups = (req, res) => {
    console.log("inside list backup")
    try {
        const backups = fs.readdirSync(BACKUP_DIR).filter(file => fs.lstatSync(path.join(BACKUP_DIR, file)).isDirectory());
        res.status(200).json({ success: true, backups });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to list backups", error: err.message });
    }
};

// ✅ 4. Delete Specific Backup
const deleteBackup = (req, res) => {
    try {
        const { backupFolder } = req.body;
        const backupPath = path.join(BACKUP_DIR, backupFolder);

        if (!fs.existsSync(backupPath)) {
            return res.status(404).json({ success: false, message: "Backup folder not found" });
        }

        fs.rmSync(backupPath, { recursive: true, force: true });

        res.status(200).json({ success: true, message: "Backup deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to delete backup", error: err.message });
    }
};

// ✅ 5. Scheduled Daily Backup (Every day at 2 AM)
cron.schedule("0 2 * * *", () => {
    console.log("🔄 Running Scheduled Daily Backup at 2 AM...");
    backupDatabase();
}, {
    timezone: "Asia/Kolkata" // Change as per your timezone
});

module.exports = {
    backupDatabase,
    restoreDatabase,
    listBackups,
    deleteBackup
};
