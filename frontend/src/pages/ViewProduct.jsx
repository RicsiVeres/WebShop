import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/userSlice';
import styled from 'styled-components';
import { BasicButton } from '../utils/buttonStyles';
import { getProductDetails, updateStuff } from '../redux/userHandle';
import { Avatar, Card, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { generateRandomColor, timeAgo } from '../utils/helperFunctions';
import { MoreVert } from '@mui/icons-material';

const ViewProduct = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const productID = params.id;


    const { currentUser, currentRole, productDetails, loading, responseDetails } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getProductDetails(productID));
    }, [productID, dispatch]);


    const [anchorElMenu, setAnchorElMenu] = useState(null);

    const handleOpenMenu = (event) => {
        setAnchorElMenu(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorElMenu(null);
    };

    const deleteHandler = (reviewId) => {
        const fields = { reviewId };

        dispatch(updateStuff(fields, productID, "deleteProductReview"));
    };

    const reviewer = currentUser && currentUser._id

    return (
        <>
            {loading ?
                <div>Betöltés...</div>
                :
                <>
                    {
                        responseDetails ?
                            <div>Nincs ilyen termékünk!</div>
                            :
                            <>
                                <ProductContainer>
                                    <ProductImage src={productDetails && productDetails.productImage} alt={productDetails && productDetails.productName} />
                                    <ProductInfo>
                                        <ProductName>{productDetails && productDetails.productName}</ProductName>
                                        <PriceContainer>
                                            <PriceCost>{productDetails && productDetails.price && productDetails.price.cost}ft</PriceCost>
                                            <PriceMrp>{productDetails && productDetails.price && productDetails.price.mrp}ft</PriceMrp>
                                            <PriceDiscount>{productDetails && productDetails.price && productDetails.price.discountPercent}% off</PriceDiscount>
                                        </PriceContainer>
                                        <Description>{productDetails && productDetails.description}</Description>
                                        <ProductDetails>
                                            <p>Kategória: {productDetails && productDetails.category}</p>
                                            <p>Alkategória: {productDetails && productDetails.subcategory}</p>
                                        </ProductDetails>
                                            {currentRole != "Customer" ? <h2>Hogy a kosaraba helyezd jelentkezz be!</h2> : 
                                                <ButtonContainer>
                                                    <BasicButton
                                                         onClick={() => dispatch(addToCart(productDetails))}
                                                    >
                                                        Kosárba
                                                    </BasicButton>
                                                </ButtonContainer> }
                                    </ProductInfo>
                                </ProductContainer>
                                {
                                    currentRole === "Customer" &&
                                    <>
                                        
                                    </>
                                }
                                <ReviewWritingContainer>
                                    <Typography variant="h4">Vélemények</Typography>
                                </ReviewWritingContainer>

                                {productDetails.reviews && productDetails.reviews.length > 0 ? (
                                    <ReviewContainer>
                                        {productDetails.reviews.map((review, index) => (
                                            <ReviewCard key={index}>
                                                <ReviewCardDivision>
                                                    <Avatar sx={{ width: "60px", height: "60px", marginRight: "1rem", backgroundColor: generateRandomColor(review._id) }}>
                                                        {String(review.reviewer.name).charAt(0)}
                                                    </Avatar>
                                                    <ReviewDetails>
                                                        <Typography variant="h6">{review.reviewer.name}</Typography>
                                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>

                                                            <Typography variant="body2">
                                                                {timeAgo(review.date)}
                                                            </Typography>
                                                        </div>
                                                        <Typography variant="subtitle1">Értékelés: {review.rating}</Typography>
                                                        <Typography variant="body1">{review.comment}</Typography>
                                                    </ReviewDetails>
                                                    {review.reviewer._id === reviewer &&
                                                        <>
                                                            <IconButton onClick={handleOpenMenu} sx={{ width: "4rem", color: 'inherit', p: 0 }}>
                                                                <MoreVert sx={{ fontSize: "2rem" }} />
                                                            </IconButton>
                                                            <Menu
                                                                id="menu-appbar"
                                                                anchorEl={anchorElMenu}
                                                                anchorOrigin={{
                                                                    vertical: 'bottom',
                                                                    horizontal: 'left',
                                                                }}
                                                                keepMounted
                                                                transformOrigin={{
                                                                    vertical: 'top',
                                                                    horizontal: 'left',
                                                                }}
                                                                open={Boolean(anchorElMenu)}
                                                                onClose={handleCloseMenu}
                                                                onClick={handleCloseMenu}
                                                            >
                                                                <MenuItem onClick={() => {
                                                                    handleCloseMenu()
                                                                }}>
                                                                    <Typography textAlign="center">Edit</Typography>
                                                                </MenuItem>
                                                                <MenuItem onClick={() => {
                                                                    deleteHandler(review._id)
                                                                    handleCloseMenu()
                                                                }}>
                                                                    <Typography textAlign="center">Delete</Typography>
                                                                </MenuItem>
                                                            </Menu>
                                                        </>
                                                    }
                                                </ReviewCardDivision>
                                            </ReviewCard>
                                        ))}
                                    </ReviewContainer>
                                )
                                    :
                                    <ReviewWritingContainer>
                                        <Typography variant="h6">Még nincs megjegyzés, rendeld meh és írj róla vélemyént elsőként!</Typography>
                                    </ReviewWritingContainer>
                                }
                            </>
                    }
                </>
            }
        </>
    );
};

export default ViewProduct;
const ProductContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 20px;
    justify-content: center;
    align-items: center;
    background-color: #f9f9f9; /* Világos szürke háttér */
    padding: 40px;
    border-radius: 12px; /* Finoman lekerekített sarkok */
    @media (min-width: 768px) {
        flex-direction: row;
    }
`;

const ProductImage = styled.img`
    max-width: 350px; /* Nagyobb, de még mindig arányos kép */
    border-radius: 8px; /* Finomabb lekerekítés */
    margin-bottom: 20px;
`;

const ProductInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* Balra igazított szöveg a jobb olvashatóságért */
    gap: 2rem; /* Kicsit több térköz a különböző elemek között */
    margin-left: 2.5rem;
`;

const ProductName = styled.h1`
    font-size: 28px;
    color: #333; /* Sötétebb szöveg a jobb kontraszt érdekében */
    margin-bottom: 10px;
    font-weight: 600;
`;

const PriceContainer = styled.div`
    display: flex;
    gap: 16px;
    align-items: center;
    background-color: #ffffff; /* Fehér háttér a tiszta megjelenéshez */
    padding: 15px;
    border-radius: 8px; /* Finom lekerekítés */
    border: 1px solid #e0e0e0; /* Világos szürke keret */
`;

const PriceMrp = styled.p`
    font-size: 14px;
    color: #b0b0b0;
    text-decoration: line-through;
`;

const PriceCost = styled.h3`
    font-size: 24px;
    color: #222; /* Erősebb szín a fő árhoz */
`;

const PriceDiscount = styled.p`
    font-size: 14px;
    color: #43a047; /* Zöld szín a kedvezményhez */
    font-weight: bold;
`;

const Description = styled.p`
    font-size: 16px;
    color: #555; /* Szürke a hosszabb szöveghez */
    line-height: 1.6; /* Kellemesebb olvasási élmény */
    margin-top: 16px;
`;

const ProductDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: #666;
    font-size: 14px;
`;

const ButtonContainer = styled.div`
    margin-top: 20px;
    display: flex;
    justify-content: flex-start; /* Bal oldalon elhelyezkedő gomb */
`;


const ReviewWritingContainer = styled.div`
    margin: 60px 0;
    text-align: center; /* Középre igazított szöveg */
`;

const ReviewContainer = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1rem;
`;

const ReviewCard = styled(Card)`
  && {
    background-color: #fafafa;
    border: 1px solid #e0e0e0;
    margin-bottom: 16px;
    padding: 16px;
    border-radius: 10px;
  }
`;

const ReviewCardDivision = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ReviewDetails = styled.div`
  flex: 1;
  color: #444;
`;

