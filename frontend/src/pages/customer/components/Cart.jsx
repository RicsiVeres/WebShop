import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Container, Divider, Grid, IconButton, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import styled from 'styled-components';
import emptyCart from "../../../assets/cartimg.png";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { addToCart, removeAllFromCart, removeFromCart } from '../../../redux/userSlice';
import { useNavigate } from 'react-router-dom';

const Cart = ({ setIsCartOpen }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);
    const cartDetails = currentUser.cartDetails;

    const totalQuantity = cartDetails.reduce((total, item) => total + item.quantity, 0);
    const totalOGPrice = cartDetails.reduce((total, item) => total + (item.quantity * item.price.mrp), 0);
    const totalNewPrice = cartDetails.reduce((total, item) => total + (item.quantity * item.price.cost), 0);

    const priceContainerRef = useRef(null);
    const firstCartItemRef = useRef(null);

    const handleScrollToBottom = () => {
        if (priceContainerRef.current) {
            priceContainerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleScrollToTop = () => {
        if (firstCartItemRef.current) {
            firstCartItemRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Handle change of quantity (can decrease down to 1)
    const handleQuantityChange = (item, newQuantity) => {
        if (newQuantity > 0) {
            // If quantity is increased, add to the cart
            if (newQuantity > item.quantity) {
                dispatch(addToCart({ ...item, quantity: 1 }));
            } else if (newQuantity < item.quantity) {
                // If quantity is decreased, remove one item from the cart
                dispatch(removeFromCart(item));
            }
        } else {
            // If the quantity is 0 or less, remove the item from the cart
            dispatch(removeFromCart(item));
        }
    };

    return (
        <StyledContainer>
            <TopContainer>
                <Button onClick={() => setIsCartOpen(false)} sx={{color:"#DB4444", border:"1px solid #DB4444"}}>
                    <KeyboardDoubleArrowLeftIcon /> Vissza
                </Button>
            </TopContainer>
            {cartDetails.length === 0 ? (
                <CartImage src={emptyCart} />
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Termék</TableCell>
                                    <TableCell>Ár</TableCell>
                                    <TableCell>Mennyiség</TableCell>
                                    <TableCell>Végösszeg</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cartDetails.map((data, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Grid container alignItems="center" spacing={2}>
                                                <Grid item>
                                                    <ProductImage src={data.productImage} alt={data.productName} />
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="body1">{data.productName}</Typography>
                                                </Grid>
                                            </Grid>
                                        </TableCell>
                                        <TableCell>{data.price.mrp} Ft</TableCell>
                                        <TableCell>
                                            {/* Quantity Control using MUI IconButton */}
                                            <QuantityControl>
                                                <IconButton 
                                                    onClick={() => handleQuantityChange(data, data.quantity - 1)} 
                                                    disabled={data.quantity <= 0}  // Disable the minus button when quantity is 1
                                                >
                                                    <RemoveIcon />
                                                </IconButton>
                                                <Typography variant="body1">{data.quantity}</Typography>
                                                <IconButton 
                                                    onClick={() => handleQuantityChange(data, data.quantity + 1)}
                                                >
                                                    <AddIcon />
                                                </IconButton>
                                            </QuantityControl>
                                        </TableCell>
                                        <TableCell>{data.price.cost * data.quantity} Ft</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <StyledSummaryBox ref={priceContainerRef}>
                        <SummaryTitle>Összegzés</SummaryTitle>
                        <Divider />
                        <SummaryRow>
                            <Typography variant="body1">Teljes Össz.:</Typography>
                            <Typography variant="body1">{totalOGPrice} Ft</Typography>
                        </SummaryRow>
                        <SummaryRow>
                            <Typography variant="body1">Szállítás:</Typography>
                            <Typography variant="body1">0 Ft</Typography> {/* Ha van szállítási költség, itt beállíthatod */}
                        </SummaryRow>
                        <SummaryRow>
                            <Typography variant="body1">Kedvezmény:</Typography>
                            <Typography variant="body1">{totalOGPrice - totalNewPrice} Ft</Typography>
                        </SummaryRow>
                        <SummaryRow>
                            <Divider />
                        </SummaryRow>
                        <SummaryRow>
                            <Typography variant="body1" style={{ fontWeight: 'bold' }}>Teljes összeg:</Typography>
                            <Typography variant="body1" style={{ fontWeight: 'bold' }}>{totalNewPrice} Ft</Typography>
                        </SummaryRow>
                        <Divider />
                        <OrderButton
                            variant="contained"
                            onClick={() => navigate("/Checkout")}
                            sx={{backgroundColor:"#DB4444", maxWidth:"12rem", display:"flex", alignItems:"end"}}
                        >
                            Megrendelés
                        </OrderButton>
                    </StyledSummaryBox>
                </>
            )}
        </StyledContainer>
    );
};

const StyledContainer = styled(Container)`
  padding: 16px;
  background-color:  #F5F5F5;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #FFFFFF;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StyledSummaryBox = styled(Paper)`
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
  background-color: #363738;
  margin: 1rem 8%;
`;

const SummaryTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #363738;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  padding: 4px 0;
  font-size: 1rem;
`;

const OrderButton = styled(Button)`
  background-color: #DB4444;
  color: white;
  width: 100%;
  padding: 12px;
  margin-top: 16px;
  &:hover {
    background-color: #E07575;
  }
`;

const ActionButton = styled(Button)`
  background-color: #DB4444;
  color: white;
  width: 48%;
  padding: 12px;
  margin-top: 16px;
  &:hover {
    background-color: #E07575;
  }
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
`;

const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const CartImage = styled.img`
  width: 100%;
  border-radius: 8px;
  object-fit: cover;
`;

export default Cart;
