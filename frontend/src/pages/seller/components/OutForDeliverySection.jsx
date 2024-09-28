import { useState, useEffect } from "react";
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getSpecificProducts } from "../../../redux/userHandle";
import axios from 'axios';
import TableTemplate from "../../../components/TableTemplate";
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from "react-router-dom";

// Modal component
const OrderDetailsModal = ({ open, handleClose, orderDetails }) => {
    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Rendelési adatok:</DialogTitle>
            <DialogContent>
                <Typography variant="body1"><strong>Ügyfél:</strong> {orderDetails?.buyerDetails.map(buyer => buyer.name).join(', ')}</Typography>
                <Typography variant="body1"><strong>Email:</strong> <a href={`mailto:${orderDetails?.buyerDetails[0].email}`} style={{ textDecoration: 'none' }}>
                    {orderDetails?.buyerDetails[0].email}
                </a></Typography>
                <Typography variant="body1"><strong>Telefonszám:</strong> <a href={`tel:${38 + orderDetails?.shippingData.phoneNo}`} style={{ textDecoration: 'none' }}>
                    {`+380${orderDetails?.shippingData.phoneNo}`}
                </a></Typography>
                <Typography variant="body1"><strong>Cím:</strong> {`${orderDetails?.shippingData.address}, ${orderDetails?.shippingData.pinCode}, ${orderDetails?.shippingData.city}, ${orderDetails?.shippingData.state}, ${orderDetails?.shippingData.country}`}</Typography>
                <Typography variant="body1"><strong>Ár:</strong> {`${orderDetails?.totalPrice} Ft`}</Typography>
                <Typography variant="body1"><strong>Dátum:</strong> {new Date(orderDetails?.createdAt).toLocaleDateString('hu-HU')}</Typography>
                <Typography variant="body1"><strong>Megrendelt termékek:</strong></Typography>
                <ul>
                    {orderDetails?.orderedProducts.map(product => (
                        <li key={product._id}>{product.productName}</li>
                    ))}
                </ul>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">Bezár</Button>
            </DialogActions>
        </Dialog>
    );
};

const OutForDeliverySection = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser, responseSpecificProducts } = useSelector(state => state.user);

    // Fetch ordered products
    useEffect(() => {
        const fetchOrderedProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/getOrderedProducts`);
                setOrders(response.data);
            } catch (error) {
                setError(`Hiba az adatok lekérésekor: ${error.message}`);
            }
        };

        fetchOrderedProducts();
        dispatch(getSpecificProducts(currentUser._id, "getOrderedProductsBySeller"));
    }, [dispatch, currentUser._id]);

    // Format date and number
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('hu-HU');
    };

    const formatNumber = (num) => num.toLocaleString('hu-HU', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

    // Columns for the table
    const orderedColumns = [
        { id: 'name', label: 'Ügyfél', minWidth: 25 },
        { id: 'email', label: 'Email', minWidth: 35 },
        { id: 'phone', label: 'Telefonszám', minWidth: 35 },
        { id: 'address', label: 'Cím', minWidth: 75 },
        { id: 'price', label: 'Ár', minWidth: 25 },
        { id: 'date', label: 'Dátum', minWidth: 10 },
    ];

    // Create rows for the table
    const orderedRows = orders.map(order => ({
        name: order.buyerDetails.map(num => num.name).join(', '),
        email: order.buyerDetails.map(num => num.email).join(', '),
        phone: order.shippingData.phoneNo,
        address: `${order.shippingData.address}, ${order.shippingData.pinCode}, ${order.shippingData.city}, ${order.shippingData.state}, ${order.shippingData.country}`,
        price: `${formatNumber(order.totalPrice)} Ft`,
        date: formatDate(order.createdAt),
        id: order._id,
    }));

    // Handle row click to open modal with full order details
    const handleRowClick = (row) => {
        const selectedOrderData = orders.find(order => order._id === row.id);
        setSelectedOrder(selectedOrderData);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedOrder(null);
    };

    const handleReject = (row, event) => {
        event.stopPropagation(); // Prevent the row click event from firing
        console.log(`Order ${row.id} elutasítva`);
        // Add your rejection logic here
    };

    const handleExecute = (row, event) => {
        event.stopPropagation(); // Prevent the row click event from firing
        console.log(`Order ${row.id} végrehajtva`);
        // Add your execution logic here
    };

    const ProductsButtonHaver = ({ row }) => (
        <>
            <Button 
                variant="outlined" 
                color="error" 
                size="small" 
                startIcon={<DeleteIcon />} 
                onClick={(event) => handleReject(row, event)} // Pass the event
            >
                Elutasít
            </Button>
            <Button 
                variant="contained" 
                color="success" 
                size="small" 
                endIcon={<SendIcon />} 
                style={{ marginLeft: '12px' }} 
                onClick={(event) => handleExecute(row, event)} // Pass the event
            >
                Végrehajt
            </Button>
        </>
    );

    return (
        <Box sx={{ padding: 2 }}>
            {responseSpecificProducts ? (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => navigate("/Seller/addproduct")}
                    >
                        Termék hozzáadása
                    </Button>
                </Box>
            ) : (
                <>
                    <Typography variant="h5" gutterBottom>
                        Termékek listája:
                    </Typography>
                    {error && <Typography color="error">{error}</Typography>}
                    <TableTemplate
                        buttonHaver={ProductsButtonHaver}
                        columns={orderedColumns}
                        rows={orderedRows}
                        onRowClick={handleRowClick} // Add onRowClick event
                    />
                </>
            )}
            <OrderDetailsModal
                open={openModal}
                handleClose={handleCloseModal}
                orderDetails={selectedOrder}
            />
        </Box>
    );
};

export default OutForDeliverySection;
