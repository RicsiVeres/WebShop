import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Contact from '../pages/Contact';
import ViewProduct from '../pages/ViewProduct';
import Navbar from '../pages/Navbar';
import AuthenticationPage from '../pages/AuthenticationPage';
import SellerDashboard from '../pages/seller/SellerDashboard';
import CustomerSearch from '../pages/customer/pages/CustomerSearch';
import Products from '../components/Products';
import CustomerOrders from '../pages/customer/pages/CustomerOrders';
import CheckoutSteps from '../pages/customer/pages/CheckoutSteps';
import Profile from '../pages/customer/pages/Profile';
import Logout from '../pages/Logout';
import CheckoutAftermath from '../pages/customer/pages/CheckoutAftermath';
import ViewOrder from '../pages/customer/pages/ViewOrder';
import Favorites from "../pages/customer/pages/Favorites";
import Footer from "../pages/Footer";

const AppRoutes = ({ isLoggedIn, currentRole, productData }) => {
  return (
    <>
      {!isLoggedIn && currentRole === null && (
        <>
          <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Home" element={<Home />} />
              <Route path="*" element={<Navigate to="/" />} />
              <Route path="/Products" element={<Products productData={productData} />} />
              <Route path="/product/view/:id" element={<ViewProduct />} />
              <Route path="/Search" element={<CustomerSearch mode="Mobile" />} />
              <Route path="/ProductSearch" element={<CustomerSearch mode="Desktop" />} />
              <Route path="/Customerregister" element={<AuthenticationPage mode="Register" role="Customer" />} />
              <Route path="/Customerlogin" element={<AuthenticationPage mode="Login" role="Customer" />} />
              <Route path="/Sellerregister" element={<AuthenticationPage mode="Register" role="Seller" />} />
              <Route path="/Sellerlogin" element={<AuthenticationPage mode="Login" role="Seller" />} />
            </Routes>
          <Footer />
        </>
      )}

      {isLoggedIn && currentRole === 'Customer' && (
        <>
          <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Home" element={<Home />} />
              <Route path="/Contacts" element={<Contact />} />
              <Route path="*" element={<Navigate to="/" />} />
              <Route path="/Products" element={<Products productData={productData} />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/product/view/:id" element={<ViewProduct />} />
              <Route path="/Search" element={<CustomerSearch mode="Mobile" />} />
              <Route path="/ProductSearch" element={<CustomerSearch mode="Desktop" />} />
              <Route path="/Checkout" element={<CheckoutSteps />} />
              <Route path="/product/buy/:id" element={<CheckoutSteps />} />
              <Route path="/Aftermath" element={<CheckoutAftermath />} />
              <Route path="/Profile" element={<Profile />} />
              <Route path="/Orders" element={<CustomerOrders />} />
              <Route path="/order/view/:id" element={<ViewOrder />} />
              <Route path="/Logout" element={<Logout />} />
            </Routes>
          <Footer />
        </>
      )}

      {isLoggedIn && (currentRole === 'Seller' || currentRole === 'Shopcart') && <SellerDashboard />}
    </>
  );
};

export default AppRoutes;
