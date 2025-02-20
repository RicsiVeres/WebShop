import React, { useState } from 'react';
import {
    AppBar, Toolbar, IconButton, Typography, Box, Button, Drawer, List, ListItem, ListItemButton, ListItemText, Divider, Badge
} from '@mui/material';
import {
    Menu as MenuIcon,
    Close as CloseIcon,
    FavoriteBorder as FavoriteBorderIcon,
    ShoppingCartOutlined as ShoppingCartOutlinedIcon,
    Person2Outlined as Person2OutlinedIcon
} from '@mui/icons-material';
import Search from './customer/components/Search';
import Cart from './customer/components/Cart';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useMediaQuery } from '@mui/material';

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:600px)'); // Mobil nézet detektálása
    const { currentUser, currentRole } = useSelector(state => state.user);
    const navigate = useNavigate();

    const totalQuantity = currentUser?.cartDetails?.reduce((total, item) => total + item.quantity, 0) || 0;
    const favoritsitemcounts = () => {
        try {
            const favorits = JSON.parse(localStorage.getItem('favorits')) || [];
            if (!Array.isArray(favorits)) {
                console.warn("The 'favorits' key in localStorage is not an array. Resetting to an empty array.");
                localStorage.setItem('favorits', JSON.stringify([])); // Reset, ha nem tömb
                return 0;
            }
            return favorits.length;
        } catch (error) {
            console.error("Error parsing 'favorits' from localStorage:", error);
            localStorage.setItem('favorits', JSON.stringify([])); // Reset, ha hiba van
            return 0;
        }
    };


    const toggleMobileMenu = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleOpenCart = () => {
        setIsCartOpen(true);
    };

    const handleCloseCart = () => {
        setIsCartOpen(false);
    };

    const handleNavigateToProfile = () => {
        navigate("/profile");
    };

    const handleNavigateToFavorites = () => {
        navigate("/favorites");
    };

    const handleNavigateToContacts = () => {
        navigate("/Contacts");
        isMobile && setMobileOpen(!mobileOpen);
    };

    const handleNavigateToAbout = () => {
        navigate("/About");
        isMobile && setMobileOpen(!mobileOpen);
    };


    const handleNavigateToOrders = () => {
            navigate("/Orders");
            isMobile && setMobileOpen(!mobileOpen);
        };

    const handleNavigateToHome = () => {
            navigate("/");
            isMobile && setMobileOpen(!mobileOpen);
        };



    return (
        <AppBar position="sticky" sx={{ backgroundColor: "#FFFFFF", boxShadow: "none", padding: ".5rem 2.5rem", maxWidth: "1170px", margin: "0 auto" }}>
            <Toolbar disableGutters>
                {/* Logo */}
                <Typography
                    variant="h6"
                    noWrap
                    sx={{
                        flexGrow: 1,
                        color: "#000000",
                        fontWeight: "bold",
                        fontSize: "1.5rem",
                        cursor: "pointer"
                    }}
                    onClick={() => navigate("/")}
                >
                    Exclusive
                </Typography>

                {/* Desktop Menu */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: "1.5rem", alignItems: 'center' }}>
                    <Button sx={menuButtonStyle} onClick={handleNavigateToHome}>Home</Button>
                    <Button sx={menuButtonStyle} onClick={handleNavigateToContacts}>Contact</Button>
                    <Button sx={menuButtonStyle} onClick={handleNavigateToAbout}>About</Button>
                    {currentRole !== "Customer" ? (
                        <Button onClick={() => navigate("/Customerlogin")} sx={menuButtonStyle}>
                            Sign Up
                        </Button>
                    ):
                        <Button sx={menuButtonStyle} onClick={() => navigate("/Orders")}>Rendeléseim</Button>
                    }
                    <Search sx={searchBarStyle} />
                    {currentRole === "Customer" && (
                        <Box sx={{ display: 'flex', gap: "1rem", alignItems: 'center' }}>
                            <IconButton onClick={handleNavigateToFavorites}>
                                <Badge badgeContent={favoritsitemcounts()} color="error">
                                    <FavoriteBorderIcon sx={{ color: "#000000" }} />
                                </Badge>
                            </IconButton>
                            <IconButton onClick={handleOpenCart}>
                                <Badge badgeContent={totalQuantity} color="error">
                                    <ShoppingCartOutlinedIcon sx={{ color: "#000000" }} />
                                </Badge>
                            </IconButton>
                            <IconButton onClick={handleNavigateToProfile}>
                                <Person2OutlinedIcon sx={{ color: "#000000" }} />
                            </IconButton>
                        </Box>
                    )}
                </Box>

                {/* Hamburger Menu Button */}
                <IconButton
                    sx={{ display: { xs: 'flex', md: 'none',  }, color: "#000000" }}
                    onClick={toggleMobileMenu}
                >
                    {mobileOpen ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
            </Toolbar>

            {/* Mobile Drawer */}
            <Drawer
                anchor="top"
                open={mobileOpen}
                onClose={toggleMobileMenu}
                sx={{
                    '& .MuiDrawer-paper': {
                        backgroundColor: "#FFFFFF",
                        padding: "1rem",
                        animation: "slideIn 0.3s ease-out"
                    }
                }}
            >
                <Box>
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleNavigateToHome}>
                                <ListItemText primary="Home" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleNavigateToContacts}>
                                <ListItemText primary="Contact" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton >
                                <ListItemText onClick={handleNavigateToAbout} primary="About" />
                            </ListItemButton>
                        </ListItem>
                        {currentRole !== "Customer" && (
                            <>
                                <ListItem disablePadding>
                                    <ListItemButton onClick={() => navigate("/Customerlogin")}>
                                        <ListItemText primary="Sign Up" />
                                    </ListItemButton>
                                </ListItem>
                            </>
                        )}
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleNavigateToOrders}>
                                <ListItemText primary="Rendeléseim" />
                            </ListItemButton>
                        </ListItem>
                        <Divider />
                        <Box sx={{ padding: "1rem 0", width: "100vw" }}>
                            <Search />
                        </Box>
                    </List>
                </Box>
            </Drawer>

            {/* Cart Drawer */}
            <Drawer
                anchor="right"
                open={isCartOpen}
                onClose={handleCloseCart}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: isMobile ? '95vw' : '45vw',
                        boxSizing: 'border-box',
                    },
                }}
            >
                <Cart setIsCartOpen={setIsCartOpen} />
            </Drawer>

            {/* Sticky Footer Buttons for Mobile */}
            {currentRole === "Customer" && (
                <Box
                    sx={{
                        display: { xs: 'flex', md: 'none' },
                        justifyContent: 'space-between',
                        Width: '100vw',
                        alignItems: 'center',
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        width: '100vw',
                        padding: "1rem",
                        backgroundColor: "#FFFFFF",
                        boxShadow: "0 -2px 5px rgba(0,0,0,0.1)"
                    }}
                >
                    <IconButton onClick={handleNavigateToFavorites}>
                        <FavoriteBorderIcon sx={{ color: "#000000" }} />
                    </IconButton>
                    <IconButton onClick={handleOpenCart}>
                        <Badge badgeContent={totalQuantity} color="error">
                            <ShoppingCartOutlinedIcon sx={{ color: "#000000" }} />
                        </Badge>
                    </IconButton>
                    <IconButton onClick={handleNavigateToProfile}>
                        <Person2OutlinedIcon sx={{ color: "#000000", marginRight: "2.5rem" }} />
                    </IconButton>
                </Box>
            )}
        </AppBar>
    );
};

const menuButtonStyle = {
    color: "#000000",
    textTransform: "none",
    fontWeight: "bold",
    fontSize: "1rem",
};

const searchBarStyle = {
    borderRadius: "5px",
    backgroundColor: "#7D8184",
    padding: "0.5rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginLeft: "2rem",
};

export default Navbar;
