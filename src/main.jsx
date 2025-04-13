import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import rootReducer from "./reducer";
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'

const store = configureStore({
  reducer:rootReducer,
});


createRoot(document.getElementById('root')).render(
  <StrictMode>
  <Provider store={store}>
  <BrowserRouter>
        <App />
        <Toaster/>
  </BrowserRouter>
  </Provider>
  </StrictMode>,
)
