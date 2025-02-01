import { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import Navbar from './components/common/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Route,Routes } from 'react-router-dom';
import OpenRoute from './components/core/Auth/OpenRoute';
import { Login } from './components/core/Auth/Login';
import { Signup } from './components/core/Auth/Signup';
import { VerifyEmail } from './components/core/Auth/VerifyEmail';
import { MyProfile } from './pages/MyProfile';
import { DashboardView } from './pages/DashboardView';
import { AddWarehouse } from './pages/AddWarehouse';
import { ManageWarehouse } from './pages/ManageWarehouse';
import { AddNewProduct } from './pages/AddNewProduct';
import { ManageNewProduct } from './pages/ManageNewProduct';
import { AddClient } from './pages/AddClient';
import { ManageClient } from './pages/ManageClient';
import { NewInvoice } from './pages/NewInvoice';
import { ManageInvoice } from './pages/ManageInvoice';
import { Quotation } from './pages/Quotation';
import { ManageQuotation } from './pages/ManageQuotation';
import PrintDownloadComponent from './pages/PrintDownloadComponent';
import { PrintOrder } from './pages/PrintOrder';
import TermsForm from './pages/TermsForm';
import { AddSupplier } from './pages/AddSupplier';
import { ManageSupplier } from './pages/ManageSupplier';
import { SupplierOrder } from './pages/SupplierOrder';
import { ManageAccounts } from './pages/ManageAccounts';
import { Transaction } from './pages/Transaction';
import { ManageTransaction } from './pages/ManageTransaction';
import { Accounts } from './pages/Accounts';
import { UpdateProduct } from './components/manage product/UpdateProduct';
import { ManageInvoice1 } from './pages/ManageInvoice1';
import { ManageSupplierOrder } from './pages/ManageSupplierOrder';
import { ViewSupplierOrder } from './pages/ViewSupplerOrder';
import { AccountDetail } from './components/accounts/AccountDetail';
import { Enquiry } from './pages/Enquiry';
import { ManageEnquiry } from './pages/ManageEnquiry';
import { Settings } from './pages/Settings';
import { EnquiryDetails } from './pages/EnquiryDetails';
import { UpdateEnquiry } from './pages/UpdateEnquiry';
import { Landing } from './pages/Landing';
import { ForgetPassword } from './components/profile/ForgetPassword';
import UpdatePassword from './components/profile/UpdatePassword';
import PrivateRoute from './components/core/Auth/PrivateRoute';
import NotFound from './components/common/NotFound';
import { ViewMarketingQuotations } from './pages/ViewMarketingQuotations';
import { ROLE } from './utils/constant';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Category } from './pages/Category';
import { ManageCategory } from './pages/ManageCategory';
function App() {

  const {user} = useSelector((state)=>state.profile);
  const navigate = useNavigate();


  return (
    <div className='w-full h-screen min-h-screen flex flex-col font-roboto'>
      <Navbar/>
      <Routes>
          <Route
              path="signup"
              element={
                <OpenRoute>
                  <Signup />
                </OpenRoute>
              }
            />
          <Route
              path="login"
              element={
                <OpenRoute>
                  <Login />
                </OpenRoute>
              }
          />
          <Route
              path="forgot-password"
              element={
                <OpenRoute>
                  <ForgetPassword />
                </OpenRoute>
              }
          />
          <Route
              path="/"
              element={
                <OpenRoute>
                  <Landing />
                </OpenRoute>
              }
          />
          <Route
              path="update-password/:id"
              element={
                <OpenRoute>
                  <UpdatePassword />
                </OpenRoute>
              }
          />
           <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />  

        <Route 
            element={
              <PrivateRoute>
                  <Dashboard />
              </PrivateRoute>
            }
          >
        <Route path="dashboard/my-profile" element={<Settings />} />
        <Route path="/settings/setting" index element={<Settings />} />

        {/* for admin role */}
        {
          user?.role === ROLE.ADMIN && (
            <>
        {/* <Route path="dashboard/my-profile" element={<DashboardView />} /> */}
        <Route path="dashboard/view" element={<DashboardView />} />
        <Route path="term/create" element={<TermsForm />} />
        <Route path="/accounts/accounts" element={<Accounts />} />    
        <Route path="/accounts/manage-accounts" element={<ManageAccounts />} />    
        <Route path="/accounts/transaction" element={<Transaction />} />    
        <Route path="/accounts/manage-transaction" element={<ManageTransaction />} />
        <Route path="/accounts/:id" element={<AccountDetail />} />
        <Route path="crm/add-client" element={<AddClient />} />
        <Route path="crm/manage-client" element={<ManageClient />} />
            </>
            )
        }

       
        {
         ( user?.role === ROLE.ADMIN || user?.role === ROLE.SALES) &&(
            <>
         {/* for sales role */}
            <Route path="sales/new-invoice" element={<NewInvoice />} />
            <Route path="sales/quotation" element={<Quotation />} />        
            <Route path="sales/manage-invoice" element={<ManageInvoice1 />} />        
            <Route path="sales/manage-quotation" element={<ManageQuotation />} />        
            <Route path="/sales/viewOrder/:id" element={<PrintOrder />} />  
            <Route path="/sales/new-enquiry" element={<Enquiry />} />    
            <Route path="/sales/manage-enquiry" element={<ManageEnquiry />} />    
            <Route path="/sales/enquiries/view/:id" element={<EnquiryDetails />} />    
            <Route path="/sales/enquiries/update/:id" element={<UpdateEnquiry />} />
            </>
            )
        }
       
       {
        (user?.role === ROLE.ADMIN || user?.role === ROLE.SALES || user?.role === ROLE.MARKETING) && (
          <Route path="sales/view/:id" element={<PrintDownloadComponent />} />   
        )
       }


        {
          (user?.role === ROLE.ADMIN || user?.role === ROLE.STOCK) && (
            <>
     {/* for stock role */}
        <Route path="/supplier/new-supplier" element={<AddSupplier />} />        
        <Route path="/supplier/manage-supplier" element={<ManageSupplier />} />        
        <Route path="/supplier/new-order" element={<SupplierOrder />} />    
        <Route path="/supplier/manage-order" element={<ManageSupplierOrder />} />    
        <Route path="/supplier/viewOrder/:orderId" element={<ViewSupplierOrder />} /> 

        <Route path="stock/add-warehouse" element={<AddWarehouse />} />
        <Route path="stock/manage-warehouse" element={<ManageWarehouse />} />
        <Route path="stock/add-product" element={<AddNewProduct />} />
        <Route path="stock/manage-product" element={<ManageNewProduct />} />
        <Route path="/stock/update-product/:id" element={<UpdateProduct />} />

        <Route path="/stock/category/:id?" element={<Category/>} />  
        <Route path="/stock/manage-category" element={<ManageCategory />} />

        
            </>
            )
        }

        {/* Marketing roles */}
        <Route path="/marketing/quotation" element={<ViewMarketingQuotations />} />  


        </Route>

        {/* Default route for unmatched paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
