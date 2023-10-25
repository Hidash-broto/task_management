import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddTask from './pages/AddTask';
import ListingPage from './pages/ListingPage';
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
    <Toaster position="top-center" />
      <BrowserRouter>
        <Routes>
        <Route
            path='/'
            element={<ListingPage/>}
        />
        <Route
            path='/addTask'
            element={<AddTask/>}
        />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
