import { apiConnector } from "../apiconnector";
import { toast } from "react-hot-toast";
import { supplierEndPoints } from "../apis";
import { setSuppliers,setLoading } from "../../slice/supplierSlice";
import { deleteSupplier } from "../../slice/supplierSlice";
const {
    ADDITIONAL_DETAILS,
    BILLING_ADDRESS,
    UPDATE_BILLING_ADDRESS,
    UPDATE_ADDITIONAL_DETAILS,
    SHIPPING_ADDRESS,
    ADD_SUPPLIER,
    CREATE_SUPPLIER_ORDER,
    GET_ALL_SUPPLIERS,
    DELETE_SUPPLIER,
    GET_ALL_ORDER,
    DELETE_ORDER,
    GET_ORDER,
} = supplierEndPoints;


export const addSupplierService = (token, suppliers, billingAddress, shippingAddress, additionalDetails, formData, navigate) => {
    return async (dispatch) => {
      console.log("Inside add supplier service");
  
      const toastId = toast.loading("Loading...");  // Show loading toast
      dispatch(setLoading(true));
  
      try {
        // Step 1: Call backend API for billing address
        const billingResponse = await apiConnector("POST", BILLING_ADDRESS, billingAddress, {
          Authorization: `Bearer ${token}`,
        });
  
        console.log("After billing address", billingResponse);
  
        if (!billingResponse?.data?.address?._id) {
          throw new Error("Failed to create billing address");
        }
  
        const billingAddressId = billingResponse.data.address._id;
        console.log("Billing address created with ID:", billingAddressId);
  
        // Step 2: Call backend API for shipping address
        const shippingResponse = await apiConnector("POST", SHIPPING_ADDRESS, shippingAddress, {
          Authorization: `Bearer ${token}`,
        });
  
        if (!shippingResponse?.data?.address?._id) {
          throw new Error("Failed to create shipping address");
        }
  
        const shippingAddressId = shippingResponse.data.address._id;
        console.log("Shipping address created with ID:", shippingAddressId);
  
        // Step 3: Call backend API for additional details
        const additionalDetailsResponse = await apiConnector("POST", ADDITIONAL_DETAILS, additionalDetails, {
          Authorization: `Bearer ${token}`,
        });
  
        if (!additionalDetailsResponse?.data?.additionalDetails?._id) {
          throw new Error("Failed to create additional details");
        }
  
        const additionalDetailsId = additionalDetailsResponse.data.additionalDetails._id;
        console.log("Additional details created with ID:", additionalDetailsId);
  
        // Step 4: Call backend API to add the supplier using the collected IDs
        const supplierResponse = await apiConnector("POST", ADD_SUPPLIER, {
          billingAddress: billingAddressId,
          shippingAddress: shippingAddressId,
          additionalDetails: additionalDetailsId,
        }, {
          Authorization: `Bearer ${token}`,
        });
  
        if (!supplierResponse?.data?.supplier) {
          throw new Error("Failed to add supplier");
        }
  
        console.log("Supplier created successfully:", supplierResponse.data.supplier);
  
        // Step 5: Dispatch the supplier data to the store if there are suppliers
        if (suppliers.length > 0) {
          dispatch(setSuppliers([...suppliers, supplierResponse.data.supplier]));
        }
  
        // Show success toast and navigate to manage suppliers page
        toast.success("Supplier added successfully");
        navigate("/supplier/manage-supplier");
  
      } catch (error) {
        console.error("Error adding supplier:", error);
        toast.error("Failed to add supplier");
      } finally {
        dispatch(setLoading(false));
        toast.dismiss(toastId);  // Dismiss the loading toast
      }
    };
  };

  export const updateSupplierService = (token, supplierId, formData) => {
    return async (dispatch, getState) => {
      const toastId = toast.loading("Updating supplier...");
  
      try {
        const { billingAddress, shippingAddress, additionalDetails } = formData;
  
        console.log("Updating Supplier with data:");
        console.log("Billing Address:", billingAddress);
        console.log("Shipping Address:", shippingAddress);
        console.log("Additional Details:", additionalDetails);
  
        // ✅ Step 1: Update Billing Address
        const billingResponse = await apiConnector(
          "PUT",
          `${UPDATE_BILLING_ADDRESS}/${billingAddress._id}`,
          billingAddress,
          { Authorization: `Bearer ${token}` }
        );
  
        if (!billingResponse?.data?.address?._id) {
          throw new Error("Failed to update billing address");
        }
        console.log("Billing address updated:", billingResponse.data.address);
  
        // ✅ Step 2: Update Shipping Address
        const shippingResponse = await apiConnector(
          "PUT",
          `${UPDATE_BILLING_ADDRESS}/${shippingAddress._id}`,
          shippingAddress,
          { Authorization: `Bearer ${token}` }
        );
  
        if (!shippingResponse?.data?.address?._id) {
          throw new Error("Failed to update shipping address");
        }
        console.log("Shipping address updated:", shippingResponse.data.address);
  
        // ✅ Step 3: Update Additional Details
        const additionalDetailsResponse = await apiConnector(
          "PUT",
          `${UPDATE_ADDITIONAL_DETAILS}/${additionalDetails._id}`,
          additionalDetails,
          { Authorization: `Bearer ${token}` }
        );
  
        if (!additionalDetailsResponse?.data?.additionalDetails?._id) {
          throw new Error("Failed to update additional details");
        }
        console.log("Additional details updated:", additionalDetailsResponse.data.additionalDetails);
  
        // ✅ Step 4: Update Redux Store (Skip updating supplier ID)
        const { suppliers } = getState().supplier;
        const updatedSuppliers = suppliers.map((supplier) =>
          supplier._id === supplierId
            ? {
                ...supplier,
                billingAddress: billingResponse.data.address,
                shippingAddress: shippingResponse.data.address,
                additionalDetails: additionalDetailsResponse.data.additionalDetails,
              }
            : supplier
        );
        dispatch(setSuppliers(updatedSuppliers));
  
        toast.success("Supplier updated successfully");
      } catch (error) {
        console.error("Error updating supplier:", error);
        toast.error("Failed to update supplier");
      } finally {
        toast.dismiss(toastId);
      }
    };
  };
  

  export const createSupplierOrderService = (token, supplierOrderData, navigate) => {
    return async (dispatch) => {
      dispatch(setLoading(true)); // Set loading state
      try {
        // Make the API call to create a supplier order
        const response = await apiConnector("POST", CREATE_SUPPLIER_ORDER, supplierOrderData, {
          Authorization: `Bearer ${token}`,
        });
  
        console.log("Supplier order response", response);
  
        // Check if the response has the expected data
        if (!response?.data?.supplierOrder) {
          throw new Error("Failed to create supplier order");
        }
  
        console.log("Supplier order created successfully:", response.data.supplierOrder);
        toast.success("Supplier order created successfully");
        navigate(`/supplier/viewOrder/${response.data.supplierOrder._id}`);
  
        // Return the created supplier order for further use (e.g., navigation)
        return response.data.supplierOrder;
      } catch (error) {
        console.error("Error creating supplier order:", error);
        toast.error("Failed to create supplier order");
      } finally {
        dispatch(setLoading(false)); // Reset loading state
      }
    };
  };
  
  

//   fetchSupplierService
export const fetchSuppliersService = (token) => {
    return async (dispatch) => {
      const toastId = toast.loading("Loading supplier service...")

      try {
        const response = await apiConnector("GET", GET_ALL_SUPPLIERS, null, {
          Authorization: `Bearer ${token}`,
        }); // Replace GET_ALL_SUPPLIERS with your actual API endpoint for fetching suppliers
        
        if(response?.data?.success)
        {
          if(response.data.suppliers.length > 0)
            dispatch(setSuppliers(response.data.suppliers));
          else
            toast.error("Supplier doest not exists , please create")
        }
          
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        toast.error("Failed to fetch suppliers");
      } finally {
        toast.dismiss(toastId);
      }
    };
  };
  

  export const deleteSupplierService = (token, id) => {
    return async (dispatch) => {
      console.log("Deleting supplier ID:", id);
      dispatch(setLoading(true));
  
      try {
        const response = await apiConnector("DELETE", DELETE_SUPPLIER, { id }, {
          Authorization: `Bearer ${token}`,
        });
        console.log("Deleted supplier Data:", response);
  
        // Check if deletion was successful
        if (!response?.data?.success) {
          throw new Error("Unable to delete supplier");
        }
  
        // Show success toast
        toast.success("Supplier deleted successfully");
  
        // Dispatch success action with only the ID
        dispatch(deleteSupplier(id)); // Dispatch the delete action for supplier
  
      } catch (error) {
        console.error("Error deleting supplier:", error);
        toast.error("Failed to delete supplier");
      } finally {
        dispatch(setLoading(false));
      }
    };
  };
  
  export const fetchAllSupplierOrdersService = (token, setSupplierOrders) => {
    return async (dispatch) => {
      dispatch(setLoading(true));
      try {
        const response = await apiConnector("GET", GET_ALL_ORDER, null, {
          Authorization: `Bearer ${token}`,
        });
        console.log("Fetched Supplier Orders Data:", response);
  
        // Check if the response has the expected data
        if (!response?.data?.allSupplierOrders) {
          throw new Error("Failed to get all supplier orders");
        }
  
        // Set the fetched supplier order data
        setSupplierOrders(response.data.allSupplierOrders);
        toast.success("Supplier orders fetched successfully");
      } catch (err) {
        console.error("Error fetching supplier orders:", err);
        toast.error("Failed to fetch supplier orders");
      } finally {
        dispatch(setLoading(false)); // Ensure loading state is reset
      }
    };
  };
  

  export const deleteSupplierOrderByIdService = (token, formData) => {
    return async (dispatch) => {
      dispatch(setLoading(true)); // Start loading
  
      try {
        const response = await apiConnector("DELETE", DELETE_ORDER, formData, {
          Authorization: `Bearer ${token}`,
        });
        console.log("Deleted Supplier Order Data:", response);
  
        // Check if the response has the expected data
        if (!response?.data?.deletedOrder) {
          throw new Error("Failed to delete the supplier order");
        }
  
        toast.success("Supplier order deleted successfully");
      } catch (error) {
        console.error("Error deleting supplier order:", error);
        toast.error("Failed to delete supplier order"); // Show error toast
      } finally {
        dispatch(setLoading(false)); // Reset loading state
      }
    };
  };
  

  export const fetchOrderById = (token,id,setOrderDetails)=>{
    return async(dispatch)=>{
      dispatch(setLoading(true));
      console.log("id",id)
      try {
        const response = await apiConnector("GET", `${GET_ORDER}/${id}`, null, {
          Authorization: `Bearer ${token}`,
        });
        console.log("Order details fetched", response);
  
        // Check if the response has the expected data
        if (!response?.data?.orderDetails) {
          throw new Error("Failed to delete the supplier order");
        }
        setOrderDetails(response.data.orderDetails);
  
        toast.success("Supplier order deleted successfully");
      } catch (error) {
        console.error("Error deleting supplier order:", error);
        toast.error("Failed to delete supplier order"); // Show error toast
      } finally {
        toast.dismiss(toastId);
      }
    }
  }