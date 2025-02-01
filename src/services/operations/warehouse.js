import { apiConnector } from "../apiconnector";
import { warehouseEndpoints } from "../apis";
import {toast} from "react-hot-toast";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { addWarehouse, setLoading, updateWarehouseProducts,deleteProductStore, addProductToWarehouse } from "../../slice/warehouse"; // Import actions



import { setWarehouses ,updateWarehouse,deleteWarehouse} from "../../slice/warehouse"; // Import actions


const {
    ADD_WAREHOUSE,
    GET_WAREHOUSES,
    ADD_NEW_PRODUCT,
    UPDATE_WAREHOUSE,
    DELETE_WAREHOUSE,
    UPDATE_PRODUCT,
    DELETE_PRODUCT,

    ADD_CATEGORY,
    UPDATE_CATEGORY,
    DELETE_CATEGORY,
    GET_ALL_CATEGORY,

} = warehouseEndpoints

// ok 
export const addWarehouseService = (formData, navigate,token,warehouses) => {
  return async (dispatch) => {
    const toastId = toast.loading("Creating Warehouse..."); 
    dispatch(setLoading(true)); 

    try {
      // API call to add the warehouse
      const response = await apiConnector("POST", ADD_WAREHOUSE, formData,{
        Authorization: `Bearer ${token}`
    }); 
      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // Dispatch the addWarehouse action to update the Redux store
      if(warehouses.length> 0)
          dispatch(addWarehouse(response.data.warehouse));

      // Show success message
      toast.success("Warehouse created successfully");

      // Navigate to manage-warehouse page
      navigate("/stock/manage-warehouse");
    } catch (error) {
      console.error("Warehouse creation error:", error);
      toast.error("Failed to create warehouse");
    } finally {
      // Stop loading
      dispatch(setLoading(false));
      // Dismiss the loading toast
      toast.dismiss(toastId);
    }
  };
};




// services/warehouseService.js

export const fetchWarehousesService = (token) => {
  return async (dispatch) => {

    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET",GET_WAREHOUSES,null,{
        Authorization: `Bearer ${token}`

    }); // Replace with your API call
    console.log(response)
    console.log("AFter response")
      dispatch(setWarehouses(response.data.warehouses)); // Set fetched warehouses in store
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      toast.error("Failed to fetch warehouses");
    } finally {
      dispatch(setLoading(false));
    }
  };
};


export const addNewProduct = (formData,navigate,token) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST",ADD_NEW_PRODUCT,formData,{
        Authorization: `Bearer ${token}`
    }); 


    // i am confused here
    if(response.data.success)
    {
      toast.success("Product added successfully");
      console.log(response.data.product);

      const newProduct = {
        warehouseId:formData.warehouseId,
        newProduct:response.data.product
      }
      console.log(newProduct);
      console.log("form",formData);
      dispatch(addProductToWarehouse(newProduct));
      navigate('/stock/manage-product');
    }
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      toast.error("Failed to fetch warehouses");
    } finally {
      dispatch(setLoading(false));
    }
  };
};



// update warehouse.
// update warehouse service
export const updateWarehouseService = (token, formData) => {
  return async (dispatch) => {
    dispatch(setLoading(true)); // Indicate loading state

    try {
      const response = await apiConnector(
        'PUT',
        UPDATE_WAREHOUSE,
        formData,
        { Authorization: `Bearer ${token}` } // Set the authorization header with the token
      );

      console.log("response", response);
      // Check if the response is successful
      if (response?.data?.success) {
        // Update the warehouse state with the returned warehouse ID and data
        dispatch(
          updateWarehouse({
            id: response.data?.warehouse_id, // Send the warehouse ID
            data: formData, // Send the updated data
          })
        );
        toast.success("Warehouse updated successfully!");
      } else {
        throw new Error("Failed to update warehouse");
      }
    } catch (error) {
      console.error("Error updating warehouse:", error);
      toast.error("Failed to update warehouse");
    } finally {
      dispatch(setLoading(false)); // End loading state
    }
  };
};



export const deleteWarehouseService = (token, warehouseId) => {
  return async (dispatch) => {
    dispatch(setLoading(true)); // Indicate loading state

    try {
      const response = await apiConnector(
        'DELETE',
        DELETE_WAREHOUSE,
        { id: warehouseId }, // Pass the warehouse ID directly here
        { Authorization: `Bearer ${token}` } // Set the authorization header with the token
      );

      console.log("Response:", response);
      // Check if the response is successful
      if (response?.data?.success) {
        // Update the state by dispatching the deleteWarehouse action
        dispatch(deleteWarehouse(warehouseId)); // Dispatch the warehouse ID directly
        toast.success("Warehouse deleted successfully!");
      } else {
        throw new Error("Failed to delete warehouse");
      }
    } catch (error) {
      console.error("Error deleting warehouse:", error);
      toast.error("Failed to delete warehouse");
    } finally {
      dispatch(setLoading(false)); // End loading state
    }
  };
};


export const updateProducts = (token,productDetails,warehouseId,navigate) =>{
  return async (dispatch)=>{
    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
        'PUT',
        UPDATE_PRODUCT,
        productDetails, // Pass the warehouse ID directly here
        { Authorization: `Bearer ${token}` } // Set the authorization header with the token
      );

      console.log("Response:", response);
      // Check if the response is successful
      if (response?.data?.success) {
        // Update the state by dispatching the deleteWarehouse action
        // dispatch update warehoues here
        const payloadData = {
          warehouseId:warehouseId,
          newProduct:response?.data?.product,
        } 
        console.log("print payload data",payloadData);

        dispatch(updateWarehouseProducts(payloadData));
        toast.success("Product updated successfully!");
        navigate("/stock/manage-product");
      } else {
        throw new Error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      dispatch(setLoading(false)); // End loading state
    }
  }
}


export const deleteProduct = (productIdToDelete, token, warehouseId) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    const formData = {
      productId: productIdToDelete,
      warehouseId,
    };
    
    console.log("Form data before deletion:", formData); // Log form data

    try {
      const response = await apiConnector(
        'DELETE',
        DELETE_PRODUCT,
        formData, 
        { Authorization: `Bearer ${token}` }
      );

      console.log("API Response:", response); // Log API response

      if (response?.data?.success) {
        // Dispatch the action to update the store
        dispatch(deleteProductStore(formData));
        console.log("Product deletion dispatched to store:", formData); // Log data sent to store

        toast.success("Product deleted successfully!");
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      dispatch(setLoading(false)); // End loading state
    }
  };
};


export const createCategoryService = async (token, formData) => {
  const toastId = toast.loading("Creating Category...");
  console.log("inside front end create category")
  try {
    // API call to create category
    const response = await apiConnector("POST", ADD_CATEGORY, formData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    // Show success message
    toast.success("Category created successfully");
    return response.data.category; // Return the newly created category
  } catch (error) {
    console.error("Category creation error:", error);
    toast.error("Failed to create category");
    return null;
  } finally {
    toast.dismiss(toastId);
  }
};


export const getAllCategoriesService = async (token, setAllCategories) => {
  const toastId = toast.loading("Fetching Categories...");
  console.log("inside f get all category");
  try {
    // API call to get all categories
    const response = await apiConnector("GET", GET_ALL_CATEGORY, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    console.log(response);
    // Update the state with the categories data
    setAllCategories(response.data.data);

    // Show success message
    toast.success("Categories fetched successfully");

  } catch (error) {
    console.error("Error fetching categories:", error);
    toast.error("Failed to fetch categories");
  } finally {
    toast.dismiss(toastId);
  }
};

export const updateCategoryService = async (token, categoryId, formData) => {
  const toastId = toast.loading("Updating Category...");
  console.log("inside front end update category");

  try {
    // API call to update the category
    const response = await apiConnector("PUT", `${UPDATE_CATEGORY}/${categoryId}`, formData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    console.log(response);
    // Show success message
    toast.success("Category updated successfully");
    return response.data.category; // Return the updated category
  } catch (error) {
    console.error("Category update error:", error);
    toast.error("Failed to update category");
    return null;
  } finally {
    toast.dismiss(toastId);
  }
};



export const deleteCategoryService = async (token, categoryId) => {
  const toastId = toast.loading("Deleting Category...");
  console.log("inside front end delete category");

  try {
    // API call to delete the category
    const response = await apiConnector("DELETE", `${DELETE_CATEGORY}/${categoryId}`, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    console.log(response);
    // Show success message
    toast.success("Category deleted successfully");
    return response.data; // Return response data if necessary
  } catch (error) {
    console.error("Category delete error:", error);
    toast.error("Failed to delete category");
    return null;
  } finally {
    toast.dismiss(toastId);
  }
};