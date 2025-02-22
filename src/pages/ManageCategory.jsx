import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllCategoriesService, deleteCategoryService } from '../services/operations/warehouse';
import { ConfirmationModal } from '../components/common/ConfirmationModel';
import ExportCSVButton from '../components/common/ExportCSVButton'; // ✅ Import Export CSV Button

export const ManageCategory = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      getAllCategoriesService(token, setAllCategories);
    }
  }, [token]);

  const handleEdit = (category) => {
    navigate(`/stock/category/${category._id}`, { state: { category } });
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategoryService(token, categoryToDelete._id)
        .then(() => {
          getAllCategoriesService(token, setAllCategories);
          setIsModalOpen(false);
        })
        .catch((error) => {
          console.error("Error deleting category:", error);
          setIsModalOpen(false);
        });
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
  };

  // ✅ Format Categories for CSV Export
  const formattedCategories = allCategories.map((category, index) => ({
    'S/N': index + 1,
    'Category Name': category.category,
  }));

  const csvHeaders = ['S/N', 'Category Name'];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-center text-blue-600">Category Management</h1>

        {/* ✅ Export to CSV Button */}
        <ExportCSVButton data={formattedCategories} filename="categories.csv" headers={csvHeaders} />
      </div>

      <div className="space-y-4 mt-4">
        <div className="flex justify-between items-center p-4 bg-blue-600 font-semibold rounded-lg text-white text-lg border-b">
          <div className="flex-1 text-center">Sr No</div>
          <div className="flex-1 text-center">Category Name</div>
          <div className="flex-1 text-center">Action</div>
        </div>

        {Array.isArray(allCategories) && allCategories.length > 0 ? (
          allCategories.map((category, index) => (
            <div key={category._id} className="flex justify-between items-center p-4 rounded-lg shadow-md bg-white">
              <div className="flex-1 text-center">{index + 1}</div>
              <div className="flex-1 text-center">{category.category}</div>
              <div className="flex-1 text-center">
                <button
                  className="bg-blue-500 text-white py-1 px-3 rounded-lg"
                  onClick={() => handleEdit(category)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-400 text-white py-1 px-3 rounded-lg ml-2"
                  onClick={() => handleDeleteClick(category)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">No categories available.</div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete this category?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};
