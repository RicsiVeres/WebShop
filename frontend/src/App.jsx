import { BrowserRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './pages/Navbar';
import AppRoutes from './Router/routes'; 
import { useEffect } from 'react';
import { getProducts } from './redux/userHandle';
import { isTokenValid } from './redux/userSlice';
import SellerDashboard from './pages/seller/SellerDashboard';

const App = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, currentToken, currentRole, productData } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(getProducts());

    if (currentToken) {
      dispatch(isTokenValid());
    }
  }, [dispatch, currentToken]);

  return (
    <BrowserRouter>
      {(!isLoggedIn && currentRole === null) && <Navbar />}
      {isLoggedIn && currentRole === "Customer" && <Navbar />}
      
      <AppRoutes isLoggedIn={isLoggedIn} currentRole={currentRole} productData={productData} />

      {(isLoggedIn && (currentRole === "Seller" || currentRole === "Shopcart")) && (
        <SellerDashboard />
      )}
    </BrowserRouter>
  );
};

export default App;
