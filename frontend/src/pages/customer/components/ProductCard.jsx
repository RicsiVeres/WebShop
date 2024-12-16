import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import { useNavigate } from 'react-router-dom';
import {Rating} from "@mui/material";
import React from "react";

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const discount = Math.round(
        ((product.price.mrp - product.price.cost) / product.price.mrp) * 100
    );
    const getavgRating = (reviews) => {
        if (!reviews || reviews.length === 0) {
            return 0; // Ha nincs értékelés, az átlag 0
        }
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return sum / reviews.length;
    };

    return (
        <Card sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
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
                        <IconButton color="error" size="large" sx={{ backgroundColor: 'white' }}>
                            <FavoriteBorderIcon />
                        </IconButton>
                        <IconButton color="default" size="large" sx={{ backgroundColor: 'white' }}>
                            <VisibilityIcon />
                        </IconButton>
                    </Stack>
                </Box>
                <Box sx={{ position: 'absolute', top: 10, left: 10 }}>
                    <Stack spacing={1}>
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
                    </Stack>
                </Box>
                <Box sx={{ position: 'absolute', top: 8, left: 10 }}>
                    <Stack spacing={1}>
                        {/* New */}
                        {product.new && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 10,
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
                    </Stack>
                </Box>

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
                    <Typography variant="subtitle1" sx={{ color: 'error.main', fontWeight: 'bold' }}>
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

                {/* New Rating */}
                <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Rating readOnly={true} name="half-rating" defaultValue={getavgRating(product.reviews)} precision={0.5}  />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        ({product.reviews.length})
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
    }),
};

export default ProductCard;
