// Routes.jsx
import React from 'react'; // Ha React-ot használsz
import { Routes, Route, Navigate } from 'react-router-dom'; // Importáld a Routes és Route komponenseket
import Home from '../pages/Home';
import ViewProduct from '../pages/ViewProduct';
import Products from '../components/Products';
import CustomerSearch from '../pages/customer/pages/CustomerSearch';
import AuthenticationPage from '../pages/AuthenticationPage';
import CheckoutSteps from '../pages/customer/pages/CheckoutSteps';
import Profile from '../pages/customer/pages/Profile';
import CustomerOrders from '../pages/customer/pages/CustomerOrders';
import CheckoutAftermath from '../pages/customer/pages/CheckoutAftermath';
import ViewOrder from '../pages/customer/pages/ViewOrder';

const AppRoutes = ({ isLoggedIn, currentRole, productData }) => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Home" element={<Home />} />
      <Route path="*" element={<Navigate to="/" />} />

      <Route path="/Products" element={<Products productData={productData} />} />
      <Route path="/product/view/:id" element={<ViewProduct />} />
      <Route path="/Search" element={<CustomerSearch mode="Mobile" />} />
      <Route path="/ProductSearch" element={<CustomerSearch mode="Desktop" />} />

      {!isLoggedIn && currentRole === null && (
        <>
          <Route path="/Customerregister" element={<AuthenticationPage mode="Register" role="Customer" />} />
          <Route path="/Customerlogin" element={<AuthenticationPage mode="Login" role="Customer" />} />
          <Route path="/Sellerregister" element={<AuthenticationPage mode="Register" role="Seller" />} />
          <Route path="/Sellerlogin" element={<AuthenticationPage mode="Login" role="Seller" />} />
        </>
      )}

      {isLoggedIn && currentRole === "Customer" && (
        <>
          <Route path="/Checkout" element={<CheckoutSteps />} />
          <Route path="/product/buy/:id" element={<CheckoutSteps />} />
          <Route path="/Aftermath" element={<CheckoutAftermath />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Orders" element={<CustomerOrders />} />
          <Route path="/order/view/:id" element={<ViewOrder />} />
        </>
      )}
    </Routes>
  );
};

export default AppRoutes;
