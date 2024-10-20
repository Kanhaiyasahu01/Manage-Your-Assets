import {combineReducers} from "@reduxjs/toolkit";

import authReducer from "../slice/authSlice"
import profileReducer from "../slice/profileSlice";
import warehouseReducer from "../slice/warehouse";
import clientReducer from "../slice/clientSlice";
import supplierReducer from "../slice/supplierSlice";
import accountsReducer  from "../slice/accountSlice";
import transactionReducer from "../slice/transactionSlice"
const rootReducer  = combineReducers({
    auth: authReducer,
    profile:profileReducer,
    warehouse:warehouseReducer,
    client:clientReducer,
    supplier:supplierReducer,
    account:accountsReducer,
    transaction:transactionReducer,
})

export default rootReducer