import React, { useState } from 'react';
import { Container, Grid, Pagination } from '@mui/material';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/userSlice';
import { BasicButton } from '../utils/buttonStyles';
import { useNavigate } from 'react-router-dom';
import Popup from './Popup';
import { addStuff } from '../redux/userHandle';
import ProductCard from "../pages/customer/components/ProductCard";

const Products = ({ productData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const itemsPerPage = 9;

  const { currentRole, responseSearch } = useSelector(state => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = productData.slice(indexOfFirstItem, indexOfLastItem);


  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (responseSearch) {
    return <div>Termék nem található</div>;
  }

  return (
      <>
        <ProductGrid container spacing={4} sx={{ maxWidth: "1024px", display: "flex", margin: "5% auto" }}>
          {currentItems.map((data, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={index} onClick={() => navigate("/product/view/" + data._id)} sx={{ cursor: "pointer" }}>
                <ProductCard product={data} favoritcard={false} />
              </Grid>
          ))}
        </ProductGrid>

        <Container sx={{ mt: 10, mb: 10, display: "flex", justifyContent: 'center', alignItems: "center" }}>
          <Pagination
              count={Math.ceil(productData.length / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="secondary"
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          />
        </Container>

        <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
      </>
  );
};

export default Products;

const ProductGrid = styled(Grid)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
`;
