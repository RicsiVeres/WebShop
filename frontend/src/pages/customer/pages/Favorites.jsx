import Slide from "../../Slide";
import React from "react";

function favorites() {

    const getFavoritItems = () => {
        return JSON.parse(localStorage.getItem('favorits')) || [];
    }

    return(
        <>
            <Slide products={getFavoritItems()} title="" slidecategory="Favorites" favoritcard={true}   />

        </>
    )
}
export default favorites;