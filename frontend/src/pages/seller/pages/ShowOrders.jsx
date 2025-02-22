import { useEffect, useState, useCallback } from "react";
import OrderDashboard from "../components/OrderDashboard";

const ShowOrders = () => {
    const [ordersData, setOrdersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getOrderedProducts`);
            if (!response.ok) throw new Error("Hiba az adatok lekérésekor");
            const data = await response.json();
            setOrdersData(data);
        } catch (error) {
            setError(error.message);
            console.error("Hiba:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    if (loading) return <p>Betöltés...</p>;
    if (error) return <p>Hiba történt: {error}</p>;

    return <OrderDashboard orders={ordersData} />;
};

export default ShowOrders;
