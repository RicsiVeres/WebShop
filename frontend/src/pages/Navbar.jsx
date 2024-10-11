import * as React from 'react';
import {
    AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Button, Tooltip, MenuItem, Badge, Drawer, Avatar, Divider, ListItemIcon
} from '@mui/material';
import { Search as SearchIcon, LocalMall as LocalMallIcon, ShoppingCart as ShoppingCartIcon, Login, Logout, Shop2, Store } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from 'styled-components';
import Cart from './customer/components/Cart';
import Search from './customer/components/Search';
import ProductsMenu from './customer/components/ProductsMenu';
import { updateCustomer } from '../redux/userHandle';
import { FavoriteBorder as FavoriteBorderIcon } from '@mui/icons-material';
import { Person2Outlined as  Person2OutlinedIcon} from '@mui/icons-material';
import { ShoppingCartOutlined as   ShoppingCartOutlinedIcon} from '@mui/icons-material';
import { ContactPageOutlined as  ContactPageOutlinedIcon  } from '@mui/icons-material';


const Navbar = () => {
    const { currentUser, currentRole } = useSelector(state => state.user);

    const totalQuantity = currentUser && currentUser.cartDetails && currentUser.cartDetails.reduce((total, item) => total + item.quantity, 0);

    const navigate = useNavigate()
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (currentRole === "Customer") {
            console.log(currentUser);
            dispatch(updateCustomer(currentUser, currentUser._id));
        }
    }, [currentRole, currentUser, dispatch])

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [anchorElSign, setAnchorElSign] = React.useState(null);

    const open = Boolean(anchorElUser);
    const openSign = Boolean(anchorElSign);

    const [isCartOpen, setIsCartOpen] = React.useState(false);

    // Cart
    const handleOpenCart = () => {
        setIsCartOpen(true);
    };

    const handleCloseCart = () => {
        setIsCartOpen(false);
    };

    // Navigation Menu
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    // User Menu
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    // Signin Menu
    const handleOpenSigninMenu = (event) => {
        setAnchorElSign(event.currentTarget);
    };

    const handleCloseSigninMenu = () => {
        setAnchorElSign(null);
    };

    const homeHandler = () => {
        navigate("/")
    };

    return (
        <AppBar position="sticky" sx={{ backgroundColor: "#FFFFFF", boxShadow: "none", padding: "0 2rem" }}>
  <Container maxWidth="xl">
    <Toolbar disableGutters>
      {/* Logo styling */}
      <Typography
        variant="h6"
        noWrap
        sx={{
          flexGrow: 1,
          display: 'flex',
          color: "#000000",
          fontWeight: "bold",
          fontSize: "1.5rem",
        }}
        onClick={ ()=> navigate("/")}
      >
        Exclusive
      </Typography>

      {/* Menu items styling */}
      <Box sx={{ display: 'flex', gap: "1.5rem", alignItems: 'center' }}>
        <Button sx={{ color: "#000000", textTransform: "none", fontWeight: "bold", fontSize: "1rem" }}>Home</Button>
        <Button sx={{ color: "#000000", textTransform: "none", fontWeight: "bold", fontSize: "1rem" }}>Contact</Button>
        <Button sx={{ color: "#000000", textTransform: "none", fontWeight: "bold", fontSize: "1rem" }}>About</Button>
        {currentRole === "null" && (
            <Button onClick={() => navigate("/Customerlogin")} sx={{ color: "#000000", textTransform: "none", fontWeight: "bold", fontSize: "1rem" }}>Sign Up</Button>
        )}

        

      </Box>

      {/* Search Bar */}
      <Search
        sx={{
          borderRadius: "5px",
          backgroundColor: "#7D8184",
          padding: "0.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginLeft: "2rem"
        }}
      />

      {/* Icons styling */}
      {currentRole === "Customer" && (
        <Box sx={{ display: 'flex', gap: "1rem", alignItems: 'center' }}>
        <IconButton>
            <FavoriteBorderIcon  sx={{ color: "#000000" }}/>
        </IconButton>
        <IconButton>
          <ShoppingCartOutlinedIcon sx={{ color: "#000000" }}  />
        </IconButton>
        <IconButton>
            <Box sx={{ flexGrow: 0, display: 'flex' }}>
                            
                            <Tooltip title="Account settings">
                                <IconButton
                                    onClick={handleOpenUserMenu}
                                >
                                    <Person2OutlinedIcon sx={{ color: "#000000", fontSize: "xl" }}  onClick={handleOpenCart}/>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                anchorEl={anchorElUser}
                                id="menu-appbar"
                                open={open}
                                onClose={handleCloseUserMenu}
                                onClick={handleCloseUserMenu}
                                PaperProps={{
                                    elevation: 0,
                                    sx: styles.styledPaper,
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <MenuItem onClick={() => navigate("/Profile")}>
                                    {/* <Avatar fontSize="small" /> */}
                                    <ListItemIcon>
                                        <ContactPageOutlinedIcon />
                                    </ListItemIcon>
                                    <Link to="/Profile">
                                        Adatlap
                                    </Link>
                                </MenuItem>
                                <MenuItem onClick={() => navigate("/Orders")}>
                                    <ListItemIcon>
                                        <Shop2 fontSize="small" />
                                    </ListItemIcon>
                                    <Link to="/Orders">
                                        Rendeléseim
                                    </Link>
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={() => navigate("/Logout")}>
                                    <ListItemIcon>
                                        <Logout fontSize="small" />
                                    </ListItemIcon>
                                    <Link to="/Logout">
                                        Kilépés
                                    </Link>
                                </MenuItem>
                            </Menu>
                        </Box>
        </IconButton>
      </Box>
      )}
      
    </Toolbar>
  </Container>
</AppBar>
    );
};

export default Navbar;

const HomeContainer = styled(Box)`
    flex-grow: 1;
    display: flex;
    justify-content: center;
`;

const NavLogo = styled(Link)`
    color: white;
    text-decoration: none;
    font-weight: bold;
    font-size: 1.5rem;
    cursor: pointer;

    &:hover {
        color: #e07575;
    }
`;

const styles = {
    styledPaper: {
        elevation: 0,
        sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
            },
        },
    },
};

