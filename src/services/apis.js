const BASE_URL = import.meta.env.VITE_BASE_URL;

// AUTH ENDPOINTS
// AUTH ENDPOINTS
export const endpoints = {
    SENDOTP_API: `${BASE_URL}/auth/sendotp`,
    SIGNUP_API: `${BASE_URL}/auth/signup`,
    LOGIN_API: `${BASE_URL}/auth/login`,
    RESETPASSTOKEN_API:`${BASE_URL}/auth/reset-password-token`,
    RESET_PASSWORD_API:`${BASE_URL}/auth/reset-password`,
    UPDATE_PROFILE:`${BASE_URL}/auth/update-profile`
};


export const warehouseEndpoints={
    ADD_WAREHOUSE:`${BASE_URL}/warehouse/create`,
    GET_WAREHOUSES:`${BASE_URL}/warehouse/all`,
    ADD_NEW_PRODUCT:`${BASE_URL}/warehouse/add-product`,
    UPDATE_WAREHOUSE:`${BASE_URL}/warehouse/update`,
    DELETE_WAREHOUSE:`${BASE_URL}/warehouse/delete`,
    UPDATE_PRODUCT:`${BASE_URL}/warehouse/update-product`,
    DELETE_PRODUCT:`${BASE_URL}/warehouse/delete-product`,

    ADD_CATEGORY:`${BASE_URL}/warehouse/add-category`,
    UPDATE_CATEGORY:`${BASE_URL}/warehouse/update-category`,
    DELETE_CATEGORY:`${BASE_URL}/warehouse/delete-category`,
    GET_ALL_CATEGORY:`${BASE_URL}/warehouse/get-all-categories`,
}


export const clientEndPoints = {
    BILLING_ADDRESS:`${BASE_URL}/supplier/address/create`,
    UPDATE_BILLING_ADDRESS:`${BASE_URL}/supplier/address/update`,
    SHIPPING_ADDRESS:`${BASE_URL}/supplier/address/create`,
    ADDITIONAL_DETAILS:`${BASE_URL}/supplier/additional-details/create`,
    UPDATE_ADDITIONAL_DETAILS:`${BASE_URL}/supplier/additional-details/update`,
    ADD_CLIENT:`${BASE_URL}/client/create`,
    GET_ALL_CLIENTS:`${BASE_URL}/client/get-all-clients`,
    CREATE_QUOTATION:`${BASE_URL}/client/create-quotation`,
    GET_QUOTATION:`${BASE_URL}/client/get-client-order`,
    CREATE_ORDER:`${BASE_URL}/client/create-client-order`,
    GET_ORDER:`${BASE_URL}/client/get-client-invoice`,
    GET_ALL_ORDER:`${BASE_URL}/client/get-all-orders`,
    GET_ALL_QUOTATION:`${BASE_URL}/client/get-all-quotation`,
    DELETE_ORDER_ID:`${BASE_URL}/client/delete-order`,
    DELETE_QUOTATION_ID:`${BASE_URL}/client/delete-order`,
    DELETE_CLIENT:`${BASE_URL}/client/delete-client`,
}

export const termsEndPoints = {
    CREATE:`${BASE_URL}/terms/create-terms`,
    GET:`${BASE_URL}/terms/terms/get`,
    UPDATE:`${BASE_URL}/terms/terms`,
    DELETE:`${BASE_URL}/terms/terms`,
    CREATE_CUSTOM_TERM:`${BASE_URL}/Terms/create-or-update`,
    GET_CUSTOM_TERM:`${BASE_URL}/Terms/get-all-custom-terms`

}


export const supplierEndPoints = {
    BILLING_ADDRESS:`${BASE_URL}/supplier/address/create`,
    UPDATE_BILLING_ADDRESS:`${BASE_URL}/supplier/address/update`,
    SHIPPING_ADDRESS:`${BASE_URL}/supplier/address/create`,
    ADDITIONAL_DETAILS:`${BASE_URL}/supplier/additional-details/create`,
    UPDATE_ADDITIONAL_DETAILS:`${BASE_URL}/supplier/additional-details/update`,
    ADD_SUPPLIER:`${BASE_URL}/supplier/create`,
    CREATE_SUPPLIER_ORDER:`${BASE_URL}/supplier/create-supplier-order`,
    GET_ALL_SUPPLIERS:`${BASE_URL}/supplier/get-all-suppliers`,
    DELETE_SUPPLIER :`${BASE_URL}/supplier/delete-supplier`,
    GET_ALL_ORDER:`${BASE_URL}/supplier/get-all-orders`,
    DELETE_ORDER:`${BASE_URL}/supplier/delete-order`,
    GET_ORDER:`${BASE_URL}/supplier/get-order-details`,
}

export const accountsEndPoints={
    CREATE:`${BASE_URL}/account/create`,
    UPDATE:`${BASE_URL}/account/update`, 
    GET_ACCOUNT:`${BASE_URL}/account/get-account`,
    GET_ALL_ACCOUNT:`${BASE_URL}/account/get-all-accounts`,
    CREATE_TRANSACTION:`${BASE_URL}/account/create-transaction`,
    DELETE_ACCOUNT:`${BASE_URL}/account/delete`,
    CLIENT_TRANSACTION:`${BASE_URL}/account/client-transactions`,
    SUPPLIER_TRANSACTION:`${BASE_URL}/account/supplier-transactions`,
    DELETE_CLIENT_TRANSACTION:`${BASE_URL}/account/delete-client-transaction`,
    DELETE_SUPPLIER_TRANSACTION:`${BASE_URL}/account/delete-supplier-transaction`,

}


export const enquiryEndPoints = {
    CREATE:`${BASE_URL}/enquiry/create`,
    GET_ALL_ENQUIRIES:`${BASE_URL}/enquiry/all-enqueries`,
    GET_ENQUIRY:`${BASE_URL}/enquiry/get-enquiry`,
    UPDATE:`${BASE_URL}/enquiry/update`,
}


export const marketingEndPoints = {
    ADD_QUOTATION:`${BASE_URL}/marketing/add-quotation`,
    GET_MARKETING_USERS:`${BASE_URL}/marketing/get-users`,
    GET_MARKETING_QUOTATION:`${BASE_URL}/marketing/get-all-quotations`,
}

