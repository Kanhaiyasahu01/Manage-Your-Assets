import { apiConnector } from "../apiconnector";
import { toast } from "react-hot-toast";
import { setClients, setLoading } from "../../slice/clientSlice";
import { clientEndPoints } from "../apis"
import { deleteClient } from "../../slice/clientSlice";
import { addQuotationToMarketingUserService } from "./marketing";
const {
    ADD_CLIENT,
    ADDITIONAL_DETAILS,
    UPDATE_ADDITIONAL_DETAILS,
    BILLING_ADDRESS,
    UPDATE_BILLING_ADDRESS,
    SHIPPING_ADDRESS,
    GET_ALL_CLIENTS,
    CREATE_QUOTATION,
    GET_QUOTATION,
    CREATE_ORDER,
    GET_ORDER,
    GET_ALL_ORDER,
    GET_ALL_QUOTATION,
    DELETE_ORDER_ID,
    DELETE_CLIENT
} = clientEndPoints




// Add Client Service
export const addClientService = (token, clients, billingAddress, shippingAddress, additionalDetails,formData) => {
  return async (dispatch) => {
    console.log("inside add client service")
    const toastId = toast.loading("Loading...");

    try {
      // Step 1: Call backend API for billing address
      const billingResponse = await apiConnector("POST",BILLING_ADDRESS, billingAddress, {
        Authorization: `Bearer ${token}`,
      });
      console.log("after billing address",billingResponse)

      if (!billingResponse?.data?.address?._id) {
        throw new Error("Failed to create billing address");
      }
      const billingAddressId = billingResponse.data.address._id;
      console.log("Billing address created with ID:", billingAddressId);

      // Step 2: Call backend API for shipping address
      const shippingResponse = await apiConnector("POST", SHIPPING_ADDRESS, shippingAddress , {
        Authorization: `Bearer ${token}`,
      });

      if (!shippingResponse?.data?.address?._id) {
        throw new Error("Failed to create shipping address");
      }
      const shippingAddressId = shippingResponse.data.address._id;
      console.log("Shipping address created with ID:", shippingAddressId);

      // Step 3: Call backend API for additional details
      const additionalDetailsResponse = await apiConnector("POST", ADDITIONAL_DETAILS, additionalDetails , {
        Authorization: `Bearer ${token}`,
      });


      if (!additionalDetailsResponse?.data?.additionalDetails?._id) {
        throw new Error("Failed to create additional details");
      }
      const additionalDetailsId = additionalDetailsResponse.data.additionalDetails._id;
      console.log("Additional details created with ID:", additionalDetailsId);

      // Step 4: Call backend API to add the client using the collected IDs
      const clientResponse = await apiConnector("POST", ADD_CLIENT,{
        billingAddress: billingAddressId,
        shippingAddress: shippingAddressId,
        additionalDetails: additionalDetailsId,
      }, {
        Authorization: `Bearer ${token}`,
      });

      if (!clientResponse?.data?.client) {
        throw new Error("Failed to add client");
      }
      console.log("Client created successfully:", clientResponse.data.client);

      // Step 5: Dispatch the client data to the store if there are clients
      if (clients.length > 0) {
        dispatch(setClients([...clients, clientResponse.data.client]));
      }

      toast.success("Client added successfully");

    } catch (error) {
      console.error("Error adding client:", error);
      toast.error("Failed to add client");
      console.log(error.message)
    } finally {
      // dispatch(setLoading(false));
      toast.dismiss(toastId)
    }
  };
};

export const updateClientService = (token, clientId, formData) => {
  return async (dispatch, getState) => {
    const toastId = toast.loading("Updating client...");

    try {
      const { billingAddress, shippingAddress, additionalDetails } = formData;

      console.log("printing details");
      console.log(billingAddress,shippingAddress,additionalDetails);
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

      // ✅ Step 4: Update Redux Store (Skip updating client ID)
      const { clients } = getState().client;
      const updatedClients = clients.map((client) =>
        client._id === clientId
          ? {
              ...client,
              billingAddress: billingResponse.data.address,
              shippingAddress: shippingResponse.data.address,
              additionalDetails: additionalDetailsResponse.data.additionalDetails,
            }
          : client
      );
      dispatch(setClients(updatedClients));

      toast.success("Client updated successfully");
    } catch (error) {
      console.error("Error updating client:", error);
      toast.error("Failed to update client");
    } finally {
      toast.dismiss(toastId);
    }
  };
};



export const fetchClientsService = (token) => {
  return async (dispatch) => {
    const toastId = toast.loading("Loading client service...")
    try {
      const response = await apiConnector("GET", GET_ALL_CLIENTS, null, {
        Authorization: `Bearer ${token}`,
      }); // Replace GET_CLIENTS with your API endpoint for fetching clients
      if(response.data.success)
        if(response.data.clients.length > 0){
          dispatch(setClients(response.data.clients)); // Set fetched clients in the store
        }
        else{
          toast.error("No client exists");
        }
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Failed to fetch clients");
    } finally {
      toast.dismiss(toastId);
    }
  };
};


export const createQuotationService = (token, clientOrderData,navigate,marketingUserId) => {
  return async (dispatch) => {
    dispatch(setLoading(true)); // Set loading state
    try {
      // Make the API call to create a quotation
      const response = await apiConnector("POST", CREATE_QUOTATION, clientOrderData, {
        Authorization: `Bearer ${token}`,
      });
      console.log("Print response",response);
      
      // Check if the response has the expected data
      if (!response?.data?.quotation) {
        throw new Error("Failed to create quotation");
      }

      console.log("inside create quotation");
      const formData = {
        userId:marketingUserId,
        quotationId:response?.data?.quotation?._id
      }
      console.log("formdata",formData);
      await dispatch(addQuotationToMarketingUserService(token,formData));

      console.log("Quotation created successfully:", response.data.quotation);

      toast.success("Quotation created successfully");
      navigate(`/sales/view/${response.data.quotation._id}`);
      // Navigate to another route to display the obtained data (assuming you have a way to navigate)
      // You can use a navigation library like react-router-dom
      return response.data.quotation; // Return the created quotation for further use (e.g., navigation)
    } catch (error) {
      console.error("Error creating quotation:", error);
      toast.error("Failed to create quotation");
    } finally {
      dispatch(setLoading(false)); // Reset loading state
    }
  };
};


// i am thinking to use it for order also
export const fetchQuotationService = (token, id, setQuotationData) => {
  return async (dispatch) => {
    dispatch(setLoading(true)); 
    try {
      // Make the API call to get the quotation data
      const response = await apiConnector("GET", `${GET_QUOTATION}/${id}`, null, {
        Authorization: `Bearer ${token}`,
      });
      console.log("Fetched Quotation Data:", response);

      // Check if the response has the expected data
      if (!response?.data?.quotation) {
        throw new Error("Failed to get quotation");
      }

      // Set the fetched quotation data
      setQuotationData(response.data.quotation);
      toast.success("Quotation fetched successfully");
    } catch (error) {
      console.error("Error fetching quotation:", error);
      toast.error("Failed to fetch quotation");
    } finally {
      dispatch(setLoading(false)); // Reset loading state
    }
  };
};


export const createOrderService = (token, clientOrderData,navigate) =>{
  return async(dispatch)=>{
    dispatch(setLoading(true)); // Set loading state
    try {
      // Make the API call to create a quotation
      const response = await apiConnector("POST", CREATE_ORDER, clientOrderData, {
        Authorization: `Bearer ${token}`,
      });
      console.log("Print order response",response);
      // Check if the response has the expected data
      if (!response?.data?.clientOrder) {
        throw new Error("Failed to create quotation");
        
      }

      console.log("Invoice created successfully:", response.data.clientOrder);
      toast.success("Invoice created successfully");
      navigate(`/sales/viewOrder/${response.data.clientOrder._id}`);
      // Navigate to another route to display the obtained data (assuming you have a way to navigate)
      // You can use a navigation library like react-router-dom
      return response.data.clientOrder; // Return the created quotation for further use (e.g., navigation)
    } catch (error) {
      console.error("Error creating quotation:", error);
      toast.error("Failed to create quotation");
    } finally {
      dispatch(setLoading(false)); // Reset loading state
    }
  }
}

export const fetchOrderService = (token, id, setOrderData) => {
  return async (dispatch) => {
    dispatch(setLoading(true)); 
    try {
      // Make the API call to get the quotation data
      const response = await apiConnector("GET", `${GET_ORDER}/${id}`, null, {
        Authorization: `Bearer ${token}`,
      });
      console.log("Fetched Quotation Data:", response);

      // Check if the response has the expected data
      if (!response?.data?.clientOrder) {
        throw new Error("Failed to get quotation");
      }

      // Set the fetched quotation data
      setOrderData(response.data.clientOrder);
      toast.success("Quotation fetched successfully");
    } catch (error) {
      console.error("Error fetching quotation:", error);
      toast.error("Failed to fetch quotation");
    } finally {
      dispatch(setLoading(false)); // Reset loading state
    }
  };
};


export const fetchAllOrdersService = (token,setOrders) =>{
  return async(dispatch)=>{
    dispatch(setLoading(true));
    try{
      const response = await apiConnector("GET", GET_ALL_ORDER, null, {
        Authorization: `Bearer ${token}`,
      });
      console.log("Fetched Orders Data:", response);

      // Check if the response has the expected data
      if (!response?.data?.allOrders) {
        throw new Error("Failed to get all orders");
      }

      // Set the fetched quotation data
      setOrders(response.data.allOrders);
      toast.success("orders fetched successfully");
    }catch(err){
      console.log(err);
      console.log("error occured while fetching order")
    }
  }
}


export const deleteOrderByIdService = (token, formData) => {
  return async (dispatch) => {
    dispatch(setLoading(true)); // Start loading
    
    try {
      const response = await apiConnector("DELETE", DELETE_ORDER_ID, formData, {
        Authorization: `Bearer ${token}`,
      });
      console.log("Deleted Orders Data:", response);

      // Check if the response has the expected data
      if (!response?.data?.deletedOrder) {
        throw new Error("Failed to delete the order");
      }

      // Optionally, you might want to return the deleted order ID or other data
      // return response.data.deletedOrder;

      toast.success("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order"); // Show error toast
    } finally {
      dispatch(setLoading(false)); // Reset loading state
    }
  };
};


export const fetchAllQuotationsService = (token, setQuotations) => {
  return async (dispatch) => {
    dispatch(setLoading(true)); // Start loading
    try {
      const response = await apiConnector("GET", GET_ALL_QUOTATION, null, {
        Authorization: `Bearer ${token}`,
      });
      console.log("Fetched Quotations Data:", response);

      // Check if the response has the expected data
      if (!response?.data?.allQuotation) {
        throw new Error("Failed to get all quotations");
      }

      // Set the fetched quotation data
      setQuotations(response.data.allQuotation);
      toast.success("Quotations fetched successfully");
    } catch (error) {
      console.error("Error fetching quotations:", error);
      toast.error("Failed to fetch quotations"); // Show error toast
    } finally {
      dispatch(setLoading(false)); // Reset loading state
    }
  };
};



export const deleteQuotationByIdService = (token, formData) => {
  return async (dispatch) => {
    dispatch(setLoading(true)); // Start loading

    try {
      const response = await apiConnector("DELETE", DELETE_QUOTATION_ID, formData, {
        Authorization: `Bearer ${token}`,
      });
      console.log("Deleted Quotation Data:", response);

      // Check if the response has the expected data
      if (!response?.data?.deletedQuotation) {
        throw new Error("Failed to delete the quotation");
      }


      toast.success("Quotation deleted successfully");
    } catch (error) {
      console.error("Error deleting quotation:", error);
      toast.error("Failed to delete quotation"); // Show error toast
    } finally {
      dispatch(setLoading(false)); // Reset loading state
    }
  };
};

export const deleteClientService = (token, id) => {
  return async (dispatch) => {
    console.log(id);
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("DELETE", DELETE_CLIENT, { id }, {
        Authorization: `Bearer ${token}`,
      });
      console.log("Deleted client Data:", response);

      // Check if deletion was successful
      if (!response?.data?.success) {
        throw new Error("Unable to delete client");
      }

      // Show success toast
      toast.success("Client deleted successfully");

      // Dispatch success action with only the ID
      dispatch(deleteClient(id));

    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Failed to delete client");
    } finally {
      dispatch(setLoading(false));
    }
  };
};

