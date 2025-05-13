'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Toaster() {
  return (
    <ToastContainer 
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
    />
  );
}
