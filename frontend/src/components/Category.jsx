import { Box, Button, styled, Typography } from "@mui/material";
import { useState } from "react";
import Phonepng from "../assets/Phone.png";
import Computers from "../assets/Computers.png";
import SmartWatch from "../assets/SmartWatch.png";
import Camera from "../assets/Camera.png";
import HeadPhones from "../assets/HeadPhones.png";
import Gaming from "../assets/Gaming.png";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
function Category() {
    const [scrollIndex, setScrollIndex] = useState(0);
    const itemsPerPage = 6;

    const categories = [
        { name: "Phone", image: Phonepng },
        { name: "Computers", image: Computers },
        { name: "SmartWatch", image: SmartWatch },
        { name: "Camera", image: Camera },
        { name: "HeadPhones", image: HeadPhones },
        { name: "Gaming", image: Gaming },
        { name: "valami", image: Gaming },
        { name: "még valamiing", image: Gaming },
    ];

    const handleScroll = (direction) => {
        if (direction === "left") {
            // Balra navigálás: ha az elsőnél vagyunk, ugorjunk az utolsóra
            setScrollIndex((prev) => (prev === 0 ? categories.length - itemsPerPage : prev - 1));
        } else if (direction === "right") {
            // Jobbra navigálás: ha az utolsónál vagyunk, ugorjunk az elsőre
            setScrollIndex((prev) => (prev === categories.length - itemsPerPage ? 0 : prev + 1));
        }
    };

    // Az aktuálisan látható kategóriák
    const visibleCategories = categories.slice(scrollIndex, scrollIndex + itemsPerPage);

    return (
        <>
            <Deal>
                <Box sx={{ width: 20, height: 40, bgcolor: "#DB4444", borderRadius: 1, marginRight: 1 }} />
                <DealText sx={{ color: "#DB4444", fontWeight: "500" }}>Categories</DealText>
            </Deal>
            <Deal style={{
                display: "flex",
                justifyContent: "space-between",
            }}>
                <DealText>Browse By Category</DealText>
                <Box style={{display: "flex", justifyContent: "space-between"}}>
                    <ArrowButton onClick={() => handleScroll("left")}><NavigateBeforeIcon /></ArrowButton>
                    <ArrowButton onClick={() => handleScroll("right")}><NavigateNextIcon /></ArrowButton>
                </Box>

            </Deal>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
                <CategoryContainer>
                    {visibleCategories.map((category, index) => (
                        <CategoryBox key={index} data={category} />
                    ))}
                </CategoryContainer>
            </Box>
        </>
    );
}

export default Category;

export function CategoryBox({ data }) {
    return (
        <StyledCategoryBox>
            <Image src={data.image} alt={data.name} />
            <Typography sx={{ marginTop: 1, fontSize: "16px", fontWeight: 500 }}>{data.name}</Typography>
        </StyledCategoryBox>
    );
}
const StyledCategoryBox = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 170px; /* Fixált szélesség asztali nézetben */
    height: 145px; /* Fixált magasság asztali nézetben */
    border: 1px solid rgba(0, 0, 0, 0.3);
    margin: 0 15px;
    cursor: pointer;
    transition: background-color 0.3s ease, border-color 0.3s ease;

    &:hover {
        background-color: #DB4444;
        color: #ffffff;
        border-color: #DB4444;
    }

    &:hover img {
        filter: invert(1);
    }

    /* Mobil nézet beállítások: egyszerre maximum 3 kártya */
    @media (max-width: 768px) {
        flex: 0 0 calc((100vw - 40px) / 3); /* a konténer belső margóját is figyelembe véve */
        max-width: calc((100vw - 40px) / 3);
        height: 120px;
        margin: 0 5px;
    }
`;



const Image = styled("img")`
    width: 56px;
    height: 56px;
    transition: filter 0.3s ease;
`;

const CategoryContainer = styled(Box)`
    display: flex;
    overflow: hidden;
    width: calc(170px * 6 + 30px * 5); /* 6 elem szélessége + margók */

    @media (max-width: 600px) {
        width: calc(120px * 3 + 30px * 2); /* Mobilra 3 elem */
    }
`;

const ArrowButton = styled(Button)`
    display: flex;
    align-items: center;
    min-width: 40px;
    height: 40px;
    margin: 0 10px;
    color: black;
    border-radius: 50%;
    &:hover {
        background-color: #DB4444;
        color: #ffffff;
    }
`;

export const Deal = styled(Box)`
    display: flex;
    padding: 15px 20px;
`;

const DealText = styled(Typography)`
    font-size: 22px;
    font-weight: 600;
    line-height: 32px;
    margin-right: 25px;
`;
