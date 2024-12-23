import { Divider, Box, Typography, Button, styled } from '@mui/material';

import { Link, useNavigate } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import "react-multi-carousel/lib/styles.css";
import "./style/pages.css";
import ProductCard from "./customer/components/ProductCard";

const Slide = ({ products, title, slidecategory, favoritcard }) => {
    const navigate = useNavigate()

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      };

    return (
        <Component>
            <Deal sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 20, height: 40, bgcolor: '#DB4444', borderRadius: 1, marginRight: 1 }} />
                <DealText sx={{color:'#DB4444', fontWeight:'500'}}>{slidecategory}</DealText>
            </Deal>
            <Deal sx={{ display: 'flex', alignItems: 'center' }}>
                <DealText>{title}</DealText>

                <ViewAllButton
                    variant="contained"
                    onClick={() => { navigate("/Products") }}
                >
                    View All
                </ViewAllButton>
            </Deal>

            <Divider />
            <Box sx={{ maxWidth: '1100px', margin: '0 auto' }}>
                <Carousel
                    swipeable={false}
                    draggable={false}
                    responsive={responsive}
                    centerMode={true}
                    infinite={true}
                    autoPlay={true}
                    autoPlaySpeed={10000}
                    keyBoardControl={true}
                    showDots={false}
                    containerClass="carousel-container"
                    dotListClass="custom-dot-list-style"
                    itemClass="carousel-item-padding-40-px"
                >
                    {
                        products.map((product, index) => (
                            <Link key={index} to={`/product/view/${product._id}`} >
                                <ProductCard key={index} product={product} favoritcard={favoritcard}  />
                            </Link>
                        ))
                    }
                </Carousel>
            </Box>

        </Component>
    )
}

export default Slide;

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 5,
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
    }
};

const Component = styled(Box)`
    margin-top: 10px;
    background: #FFFFFF;
`;

const Deal = styled(Box)`
    display: flex;    
    padding: 15px 20px;
`

const DealText = styled(Typography)`
    font-size: 22px;
    font-weight: 600;
    line-height: 32px;
    margin-right: 25px;
`

const ViewAllButton = styled(Button)`
    margin-left: auto;
    background-color: #DB4444;
    font-size: 13px;
    padding: 16px 48px;
    border-radius: 6px;

    &:hover {
        background-color: #cd1c1c;
    }
`;
