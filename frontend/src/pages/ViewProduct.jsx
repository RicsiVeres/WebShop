import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {addToCart, removeFromCart} from '../redux/userSlice';
import styled from 'styled-components';
import { getProductDetails, updateStuff } from '../redux/userHandle';
import {Alert, Avatar, Card, IconButton, Menu, MenuItem, Rating, Typography} from '@mui/material';
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

    const reviewer = currentUser && currentUser._id;

    const handleBuyNow = () => {
        if (currentRole === "Customer") {
            dispatch(addToCart(productDetails));
        } else {
            <Alert severity="success" color="warning">
                Először be kell jelentkezned!
            </Alert>
        }
    };


    const [PickQuantityCounterx, setPickQuantityCounterx] = useState(1);

    return (
        <>
            {loading ? (
                <div>Betöltés...</div>
            ) : (
                <>
                    {responseDetails ? (
                        <div>Nincs ilyen termékünk!</div>
                    ) : (
                        <>
                            <ProductContainer>
                                <ProductImage src={productDetails?.productImage} alt={productDetails?.productName} />
                                <ProductInfo>
                                    <ProductName>{productDetails?.productName}</ProductName>
                                    <ProductRating>
                                        <Rating name="half-rating" defaultValue={3.5} precision={0.5} /> (
                                        {productDetails.reviews ? productDetails.reviews.length : 0} Reviews) |{" "}
                                        <InStock quantity={productDetails?.quantity}> Raktáron</InStock>
                                    </ProductRating>
                                    <PriceCost>$ {productDetails?.price?.cost}</PriceCost>
                                    <Description>{productDetails?.description}</Description>
                                    <hr style={{ border: '1px solid gray', width: '100%' }} />
                                    <PickQuantity>
                                        <Button
                                            style={{ color: '#333'}}
                                            onClick={() => {
                                                if (PickQuantityCounterx > 1) {
                                                    setPickQuantityCounterx(PickQuantityCounterx - 1);
                                                }
                                            }}
                                        >
                                            -
                                        </Button>
                                        <PickQuantityCounter>{PickQuantityCounterx}</PickQuantityCounter>
                                            <Button
                                                style={{ background: '#DB4444'}}
                                                onClick={() => {
                                                    if (PickQuantityCounterx < 11) {
                                                        setPickQuantityCounterx(PickQuantityCounterx + 1);
                                                    }
                                                }}
                                            >
                                                +
                                            </Button>
                                            <Button style={{
                                                background: '#DB4444',
                                                marginLeft: "16px",
                                                fontSize:'1rem',
                                                padding: '.8rem 1.5rem'
                                            }}
                                               onClick={handleBuyNow}>
                                                Buy Now
                                            </Button>
                                    </PickQuantity>
                                    <ProductDetails>
                                        <p>Kategória: {productDetails?.category}</p>
                                        <p>Alkategória: {productDetails?.subcategory}</p>
                                    </ProductDetails>
                                </ProductInfo>
                            </ProductContainer>

                            <ReviewWritingContainer>
                                <Typography variant="h4">Vélemények</Typography>
                            </ReviewWritingContainer>

                            {productDetails?.reviews && productDetails?.reviews.length > 0 ? (
                                <ReviewContainer>
                                    {productDetails.reviews.map((review, index) => (
                                        <ReviewCard key={index}>
                                            <ReviewCardDivision>
                                                <Avatar
                                                    sx={{
                                                        width: '60px',
                                                        height: '60px',
                                                        marginRight: '1rem',
                                                        backgroundColor: generateRandomColor(review._id),
                                                    }}
                                                >
                                                    {String(review.reviewer.name).charAt(0)}
                                                </Avatar>
                                                <ReviewDetails>
                                                    <Typography variant="h6">{review.reviewer.name}</Typography>
                                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                                                        <Typography variant="body2">{timeAgo(review.date)}</Typography>
                                                    </div>
                                                    <Typography variant="subtitle1">Értékelés: {review.rating}</Typography>
                                                    <Typography variant="body1">{review.comment || "Nincs megjegyzés"}</Typography>
                                                </ReviewDetails>
                                                {review.reviewer._id === reviewer && (
                                                    <>
                                                        <IconButton onClick={handleOpenMenu} sx={{ width: '4rem', color: 'inherit', p: 0 }}>
                                                            <MoreVert sx={{ fontSize: '2rem' }} />
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
                                                            <MenuItem onClick={() => handleCloseMenu()}>
                                                                <Typography textAlign="center">Edit</Typography>
                                                            </MenuItem>
                                                            <MenuItem onClick={() => {
                                                                deleteHandler(review._id);
                                                                handleCloseMenu();
                                                            }}>
                                                                <Typography textAlign="center">Delete</Typography>
                                                            </MenuItem>
                                                        </Menu>
                                                    </>
                                                )}
                                            </ReviewCardDivision>
                                        </ReviewCard>
                                    ))}
                                </ReviewContainer>
                            ) : (
                                <ReviewWritingContainer>
                                    <Typography variant="h6">
                                        Még nincs megjegyzés, rendeld meg és írj róla véleményt elsőként!
                                    </Typography>
                                </ReviewWritingContainer>
                            )}
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default ViewProduct;

// Styled Components
const ProductContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 20px;
    justify-content: center;
    align-items: center;
    background-color: #f9f9f9;
    padding: 40px;
    border-radius: 12px;

    @media (min-width: 768px) {
        flex-direction: row;
    }
`;


const ProductImage = styled.img`
    max-width: 35vw;
    border-radius: 8px;
    margin-bottom: 20px;
`;

const ProductInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    margin-left: 2.5rem;
`;

const ProductRating = styled.div`
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #666;
`;

const InStock = styled.p`
    color: ${props => (props.quantity > 1 ? '#0db45d' : 'orange')};
`;

const ProductName = styled.h1`
    font-size: 24px;
    color: #333;
    font-weight: 600;
`;

const PriceCost = styled.h3`
    font-size: 24px;
    font-weight: 400;
    color: #222;
`;

const Description = styled.p`
    font-size: 16px;
    color: #555;
    line-height: 1.4;
`;

const ProductDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: #666;
    font-size: 14px;
`;

const PickQuantity = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const PickQuantityCounter = styled.div`
    width: 75px;
    display: flex;
    justify-content: center;
    padding: .8rem;
    border: 1px solid #ccc;

`;

const ReviewWritingContainer = styled.div`
    margin: 60px 0;
    text-align: center;
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
const Button = styled.button`
    && {
        background-color: #ffffff;
        border: 1px solid gray;
        color: #fff;
        padding: 10px 20px;
        border: 1px solid #c8c8c8;
        cursor: pointer;
        font-size: 24px;
        padding: .5rem 1rem;
    }
`;
