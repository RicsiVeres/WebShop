import { BrowserRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getProducts } from './redux/userHandle';
import { isTokenValid } from './redux/userSlice';
import AppRoutes from './Routes/AppRoutes';

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
      <AppRoutes isLoggedIn={isLoggedIn} currentRole={currentRole} productData={productData} />
    </BrowserRouter>
  );
};

export default App;
