import { Divider, Box, Typography, Button, styled, Container } from '@mui/material';

import { Link, useNavigate } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import "react-multi-carousel/lib/styles.css";
import "./style/pages.css";

const Slide = ({ products, title }) => {
    const navigate = useNavigate()

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      };

    return (
        <Component>
            <Deal>
                <DealText>{title}</DealText>

                <ViewAllButton
                    variant="contained"
                    onClick={() => { navigate("/Products") }}
                >
                    View All
                </ViewAllButton>
            </Deal>

            <Divider />

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
                itemClass="carousel-item-padding-40-px">
                {
                    products.map((product, index) => (
                        <Link key={index} to={`/product/view/${product._id}`} className='card'>
                            <Box className="card-content">
                                <Image src={product.productImage} alt={product.productName} className="card-image" />
                                {product.isNew && <span className="badge">Új</span>}
                                <TitleText className="card-title">{product.productName}</TitleText>
                                    <Text className="card-cost">{formatNumber(product.price.cost)} ft</Text>

                                {/*<TextContainer className="card-pricing">
                                    <Text className="card-mrp">{product.price.mrp > product.price.cost ? `${product.price.mrp}ft` : ""}</Text>
                                </TextContainer>*/}

                                {product.price.mrp > product.price.cost && 
                                    <Text className="card-discount-badge">
                                        {`${product.price.discountPercent}% Kedvezmény`}
                                    </Text>
                                }
                                <button className="card-button">MEGNÉZ</button>
                            </Box>
                        </Link>




                    ))
                }
            </Carousel>
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
    background-color: #4d1c9c;
    border-radius: 2px;
    font-size: 13px;
    &:hover {
      background-color: #7a1ccb;
    }
`;

const Image = styled('img')({
    width: 'auto',
    height: 150
})

const TitleText = styled(Typography)`
    font-size: 14px;
    margin-top: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 600;
    color: #212121;
    display: flex;
    font-size: 1.1rem;
`;

const Text = styled(Typography)`
    font-size: 14px;
    margin-top: 5px
    font-weight: 600;
    margin: 0 0 20% 0;
    font-size: 1rem;
`

const TextContainer = styled(Container)`
    display: flex;
    gap: 8px;
    justify-content: center;
    align-items: center;
    margin: 10px;
`;