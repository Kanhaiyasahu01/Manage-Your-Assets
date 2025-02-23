import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { backupEndPoints } from '../services/apis'; // Import your endpoints


const BackupManager = () => {
  const [backups, setBackups] = useState([]);

  useEffect(() => {
    fetchBackups();
  }, []);

  // ✅ Fetch All Backups
  const fetchBackups = async () => {
    console.log("calling backup")
    try {
      const response = await axios.get(backupEndPoints.BACKUPS_LIST);
      setBackups(response.data.backups);
      toast.success("Backups fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch backups");
      console.error("Error:", error);
    }
  };

  // ✅ Trigger Backup
  const triggerBackup = async () => {
    try {
      await axios.get(backupEndPoints.BACKUP);
      toast.success("Backup created successfully");
      fetchBackups(); // Refresh backup list
    } catch (error) {
      toast.error("Failed to create backup");
      console.error("Error:", error);
    }
  };

  // ✅ Restore Backup
  const restoreBackup = async (backupFolder) => {
    try {
      await axios.post(backupEndPoints.RESTORE_BACKUP, { backupFolder });
      toast.success("Database restored successfully");
    } catch (error) {
      toast.error("Restore failed");
      console.error("Error:", error);
    }
  };

  // ✅ Delete Backup
  const deleteBackup = async (backupFolder) => {
    try {
      await axios.delete(backupEndPoints.DELETE_BACKUP, { data: { backupFolder } });
      toast.success("Backup deleted");
      fetchBackups(); // Refresh backup list
    } catch (error) {
      toast.error("Failed to delete backup");
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-100 rounded-lg shadow-lg">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-3xl font-bold text-center mb-4">Database Backup Manager</h2>

      <div className="text-center mb-6">
        <button
          onClick={triggerBackup}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
        >
          📁 Trigger Backup
        </button>
      </div>

      <h3 className="text-2xl font-semibold mb-4">Available Backups:</h3>
      {backups.length > 0 ? (
        <ul className="space-y-4">
          {backups.map((backup, index) => (
            <li key={index} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
              <span className="font-medium">{backup}</span>
              <div className="space-x-2">
                <button
                  onClick={() => restoreBackup(backup)}
                  className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                >
                  🔄 Restore
                </button>
                <button
                  onClick={() => deleteBackup(backup)}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                >
                  🗑️ Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-600">No backups found.</p>
      )}
    </div>
  );
};

export default BackupManager;
