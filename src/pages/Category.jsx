import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCategoryService, updateCategoryService } from "../services/operations/warehouse";
import { useParams, useLocation } from "react-router-dom"; // Import useLocation

export const Category = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { id } = useParams();
  const { state } = useLocation(); // Access the passed category state
  const category = state?.category; // Get the category object if available

  // State to hold form data
  const [formData, setFormData] = useState({
    category: "",
    description: "",
  });

  // Set initial form data if updating an existing category
  useEffect(() => {
    if (category) {
      setFormData({
        category: category.category,
        description: category.description,
      });
    }
  }, [category]); // Trigger whenever the category changes

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Form Submission for Create/Update
  const handleSubmit = (e) => {
    e.preventDefault();
    if (category) {
      // If updating, call updateCategoryService
      dispatch(updateCategoryService(token, category._id, formData));
    } else {
      // If creating, call createCategoryService
      dispatch(createCategoryService(token, formData));
    }
  };

  return (
    <div className="flex justify-center p-6">
      <div className="w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">{category ? "Update Category" : "Create Category"}</h2>
        <form onSubmit={handleSubmit}>
          {/* Category Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Category Name</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded-md"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded-md"
              rows="3"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            {category ? "Update Category" : "Create Category"}
          </button>
        </form>
      </div>
    </div>
  );
};
