import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { Rating } from "@mui/material";
import React, { useState, useEffect } from "react";
import { addToFavorit, removeFromFavorit } from "../../../redux/userSlice";
import { useDispatch } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";

const ProductCard = ({ product, favoritcard }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const reviews = product.reviews || [];
    const [favorits, setFavorits] = useState(
        JSON.parse(localStorage.getItem('favorits')) || []  // Ha nem található semmi a localStorage-ban, üres tömb lesz
    );


    // Load favorites from localStorage
    useEffect(() => {
        const storedFavorits = JSON.parse(localStorage.getItem('favorits')) || [];
        setFavorits(storedFavorits);
    }, []);

    const discount = Math.round(
        ((product.price.mrp - product.price.cost) / product.price.mrp) * 100
    );

    const getAvgRating = (reviews) => {
        if (!reviews.length) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return sum / reviews.length;
    };

    const handleRemoveFavorite = (itemId) => {
        // Ellenőrizd, hogy az itemId létezik és helyes
        console.log('Törlésre kerülő elem ID-ja:', itemId);

        // Törlés a kedvencekből
        const updatedFavorits = (favorits || []).filter(item => item._id !== itemId);

        // Debug: nézd meg, hogy frissült-e a kedvencek tömbje
        console.log('Frissített kedvencek:', updatedFavorits);

        // Frissítés az állapotban
        setFavorits([...updatedFavorits]);

        // Frissítés a localStorage-ban is
        localStorage.setItem('favorits', JSON.stringify(updatedFavorits));
    };




    const handleAddToFavorites = () => {
        const updatedFavorits = [...favorits, product];
        setFavorits(updatedFavorits);
        localStorage.setItem('favorits', JSON.stringify(updatedFavorits));
        dispatch(addToFavorit(product)); // dispatch the action to update the Redux store
    };

    return (
        <Card
            sx={{
                position: 'relative',
                borderRadius: 0,
                overflow: 'hidden',
                boxShadow: 3,
                marginLeft: 1,
                marginRight: 1,
            }}
        >
            {/* Image Section */}
            <Box sx={{ position: 'relative', pt: '100%' }}>
                <Box
                    component="img"
                    src={product.productImage}
                    alt={product.productName}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />

                {/* Icons */}
                <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                    <Stack spacing={1}>
                        {favoritcard ? (
                            <IconButton
                                color="error"
                                size="large"
                                sx={{ backgroundColor: 'white' }}
                                onClick={() => handleRemoveFavorite(product._id)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        ) : (
                            <>
                                <IconButton
                                    color="error"
                                    size="large"
                                    sx={{ backgroundColor: 'white' }}
                                    onClick={handleAddToFavorites}
                                >
                                    <FavoriteBorderIcon />
                                </IconButton>
                                <IconButton
                                    color="default"
                                    size="large"
                                    sx={{ backgroundColor: 'white' }}
                                    onClick={() => navigate('/order/view/' + product._id)}
                                >
                                    <VisibilityIcon />
                                </IconButton>
                            </>
                        )}
                    </Stack>
                </Box>

                {/* Discount */}
                {discount > 0 && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 10,
                            left: 10,
                            backgroundColor: 'error.main',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: 1,
                            fontSize: 16,
                            fontWeight: '400',
                        }}
                    >
                        -{discount}%
                    </Box>
                )}

                {/* New */}
                {product.new && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 40,
                            left: 10,
                            backgroundColor: 'rgb(0, 255, 102)',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: 1,
                            fontSize: 16,
                            fontWeight: '400',
                        }}
                    >
                        New
                    </Box>
                )}
            </Box>

            {/* Product Details */}
            <Stack spacing={1} sx={{ p: 2 }}>
                {/* Product Name */}
                <Typography
                    variant="subtitle1"
                    noWrap
                    onClick={() => navigate('/order/view/' + product._id)}
                    sx={{
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        ':hover': { color: 'primary.main' },
                    }}
                >
                    {product.productName}
                </Typography>

                {/* Pricing */}
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography
                        variant="subtitle1"
                        sx={{ color: 'error.main', fontWeight: 'bold' }}
                    >
                        ${product.price.cost}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'text.disabled',
                            textDecoration: 'line-through',
                        }}
                    >
                        ${product.price.mrp}
                    </Typography>
                </Stack>

                {/* Rating */}
                <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Rating
                        readOnly
                        name="half-rating"
                        value={getAvgRating(reviews)}
                        precision={0.5}
                    />
                    <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                    >
                        ({reviews.length})
                    </Typography>
                </Stack>
            </Stack>
        </Card>
    );
};

ProductCard.propTypes = {
    product: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        productName: PropTypes.string.isRequired,
        productImage: PropTypes.string.isRequired,
        price: PropTypes.shape({
            mrp: PropTypes.number.isRequired,
            cost: PropTypes.number.isRequired,
        }).isRequired,
        reviews: PropTypes.arrayOf(
            PropTypes.shape({
                rating: PropTypes.number.isRequired,
            })
        ),
        new: PropTypes.bool,
    }).isRequired,
    favoritcard: PropTypes.bool.isRequired,
};

export default ProductCard;
