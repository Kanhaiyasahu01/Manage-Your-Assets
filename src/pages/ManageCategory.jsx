import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { getAllCategoriesService, deleteCategoryService } from '../services/operations/warehouse';
import { ConfirmationModal } from '../components/common/ConfirmationModel'; // Ensure this import is correct

export const ManageCategory = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [categoryToDelete, setCategoryToDelete] = useState(null); // Category to delete
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    if (token) {
      // Call the service to fetch categories when the component mounts
      getAllCategoriesService(token, setAllCategories);
    }
  }, [token]); // Fetch categories whenever the token changes

  const handleEdit = (category) => {
    // Navigate to the edit category route and pass the category object as state
    navigate(`/stock/category/${category._id}`, { state: { category } });
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category); // Set the category to delete
    setIsModalOpen(true); // Open the modal
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      // Call delete category service with category ID
      deleteCategoryService(token, categoryToDelete._id)
        .then(() => {
          // After successful deletion, fetch updated categories
          getAllCategoriesService(token, setAllCategories);
          setIsModalOpen(false); // Close the modal after deletion
        })
        .catch((error) => {
          console.error("Error deleting category:", error);
          setIsModalOpen(false); // Close modal in case of an error
        });
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false); // Close modal if canceled
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-blue-600">Category Management</h1>
      <div className="space-y-4 mt-4">
        <div className="flex justify-between items-center p-4 bg-blue-600 font-semibold rounded-lg text-white text-lg border-b">
          <div className="flex-1 text-center">Sr No</div>
          <div className="flex-1 text-center">Category Name</div>
          <div className="flex-1 text-center">Action</div>
        </div>
        {Array.isArray(allCategories) && allCategories.length > 0 ? (
          allCategories.map((category, index) => (
            <div key={category._id} className="flex justify-between items-center p-4  rounded-lg shadow-md bg-white ">
              <div className="flex-1 text-center">{index + 1}</div>
              <div className="flex-1 text-center">{category.category}</div>
              <div className="flex-1 text-center">
                <button
                  className="bg-blue-500 text-white py-1 px-3 rounded-lg"
                  onClick={() => handleEdit(category)} // Pass the whole category object
                >
                  Edit
                </button>
                <button
                  className="bg-red-400 text-white py-1 px-3 rounded-lg ml-2"
                  onClick={() => handleDeleteClick(category)} // Trigger delete modal
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
