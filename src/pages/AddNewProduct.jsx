import React, { useState } from "react";
import { fetchWarehousesService, getAllCategoriesService } from "../services/operations/warehouse";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { addNewProduct } from "../services/operations/warehouse";
export const AddNewProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const { token } = useSelector((state) => state.auth)
  const {warehouses} = useSelector((state)=> state.warehouse);
  const [allCategories,setAllCategories]= useState([]);

    useEffect(() => {
      if (token) {
        getAllCategoriesService(token, setAllCategories);
      }
    }, [token]);
    console.log(allCategories);

  const [formData, setFormData] = useState({
    warehouseId: "",
    name: "",
    code: "",
    category: "",
    subCategory: "",
    retailPrice: "",
    purchaseOrderPrice: "",
    stockUnit: "",
    alertQuantity: "",
    tax: "",
    discount: "",
    measuringUnit: "",
    description: "",
    validTo: "",
  });

  useEffect(()=>{
    if(warehouses.length === 0)
      dispatch(fetchWarehousesService(token));
  },[warehouses, dispatch, token])



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addNewProduct(formData,navigate,token));
    console.log(formData);
  };

  return (
    <div className="container mx-auto p-6 w-full rounded-lg shadow-2xl bg-white">
        {/* make it a card */}
      <div className="shadow-md p-4">      
        <h2 className="text-2xl font-bold mb-4">Add New Product to Warehouse</h2>
      </div>

 {/* rest will be same , just change the input field design to make it more osm */}
      <form onSubmit={handleSubmit} className="space-y-6 mt-3">
        <div className="flex flex-row w-full items-center gap-3">
          {/* Product Name */}
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Product Code */}
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-1" htmlFor="code">
              Product Code
            </label>
            <input
              type="text"
              name="code"
              id="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter product code"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-row justify-between items-center gap-3">
          {/* Category */}
          <div className="w-1/2">
  <label className="block text-sm font-medium mb-1" htmlFor="category">
    Category
  </label>
  <select
    name="category"
    id="category"
    value={formData.category}
    onChange={handleChange}
    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="" disabled>Select a category</option>
    {allCategories.map((item) => (
      <option key={item._id} value={item.category}>
        {item.category}
      </option>
    ))}
  </select>
</div>



          {/* Subcategory */}
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-1" htmlFor="subCategory">
              Subcategory
            </label>
            <input
              type="text"
              name="subCategory"
              id="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              placeholder="Enter subcategory"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {/* Warehouse Dropdown */}
          <div className="flex flex-row items-center gap-2">
            <div className="w-1/3 flex justify-center items-center">
              <label className="block text-sm font-medium mb-1" htmlFor="warehouseId">
                Select Warehouse
              </label>
            </div>
            <div className="w-2/3">
              <select
                name="warehouseId"
                id="warehouseId"
                value={formData.warehouseId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>
                  Select a warehouse
                </option>
                {warehouses.map((warehouse) => (
                  <option key={warehouse._id} value={warehouse._id} >
                    {warehouse.name}
                  </option>
                ))}
              </select>
            </div>
          </div>


          {/* Retail Price */}
          <div className="flex flex-row items-center gap-2">
            <div className="w-1/3 flex justify-center items-center">
              <label className="block text-sm font-medium mb-1" htmlFor="retailPrice">
                Retail Price
              </label>
            </div>
            <div className="w-2/3">
              <input
                type="number"
                name="retailPrice"
                id="retailPrice"
                value={formData.retailPrice}
                onChange={handleChange}
                placeholder="Enter retail price"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Purchase Order Price */}
          <div className="flex flex-row items-center gap-2">
            <div className="w-1/3 flex justify-center items-center">
              <label className="block text-sm font-medium mb-1" htmlFor="purchaseOrderPrice">
                Purchase Order Price
              </label>
            </div>
            <div className="w-2/3">
              <input
                type="number"
                name="purchaseOrderPrice"
                id="purchaseOrderPrice"
                value={formData.purchaseOrderPrice}
                onChange={handleChange}
                placeholder="Enter purchase order price"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-between items-center gap-3">
          {/* Stock Unit */}
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-1" htmlFor="stockUnit">
              Stock Unit
            </label>
            <input
              type="text"
              name="stockUnit"
              id="stockUnit"
              value={formData.stockUnit}
              onChange={handleChange}
              placeholder="Enter stock unit"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Alert Quantity */}
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-1" htmlFor="alertQuantity">
              Alert Quantity
            </label>
            <input
              type="number"
              name="alertQuantity"
              id="alertQuantity"
              value={formData.alertQuantity}
              onChange={handleChange}
              placeholder="Enter alert quantity"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-row justify-between items-center gap-3">
          {/* Tax */}
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-1" htmlFor="tax">
              Tax (%)
            </label>
            <input
              type="number"
              name="tax"
              id="tax"
              value={formData.tax}
              onChange={handleChange}
              placeholder="Enter tax percentage"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Discount */}
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-1" htmlFor="discount">
              Discount (%)
            </label>
            <input
              type="number"
              name="discount"
              id="discount"
              value={formData.discount}
              onChange={handleChange}
              placeholder="Enter discount percentage"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {/* Measuring Unit */}
          <div className="flex flex-row items-center gap-2">
            <div className="w-1/3 flex justify-center items-center">
              <label className="block text-sm font-medium mb-1" htmlFor="measuringUnit">
                Measuring Unit
              </label>
            </div>
            <div className="w-2/3">
              <input
                type="text"
                name="measuringUnit"
                id="measuringUnit"
                value={formData.measuringUnit}
                onChange={handleChange}
                placeholder="Enter measuring unit"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-row items-center gap-2">
            <div className="w-1/3 flex justify-center items-center">
              <label className="block text-sm font-medium mb-1" htmlFor="description">
                Description
              </label>
            </div>
            <div className="w-2/3">
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
              ></textarea>
            </div>
          </div>

          {/* Valid To */}
          <div className="flex flex-row items-center gap-2">
            <div className="w-1/3 flex justify-center items-center">
              <label className="block text-sm font-medium mb-1" htmlFor="validTo">
                Valid To
              </label>
            </div>
            <div className="w-2/3">
              <input
                type="date"
                name="validTo"
                id="validTo"
                value={formData.validTo}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};
