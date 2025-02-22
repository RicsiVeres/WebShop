import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import hu from "date-fns/locale/hu";
import { FiCalendar, FiEdit, FiFilter, FiSearch, FiX } from "react-icons/fi";

const OrderDashboard = ({ orders: initialOrders }) => {
    const [orders, setOrders] = useState(initialOrders);
    const [filters, setFilters] = useState({
        search: "",
        status: "all",
        minDate: "",
        maxDate: "",
    });
    const [loadingId, setLoadingId] = useState(null);
    const [error, setError] = useState(null);

    const statusOptions = useMemo(
        () => [
            { value: "succes", label: "Sikeres" },
            { value: "processing", label: "Feldolgozás alatt" },
            { value: "canceled", label: "Megszakítva" },
        ],
        []
    );

    useEffect(() => {
        setOrders(initialOrders);
    }, [initialOrders]);

    const handleStatusChange = async (orderId, newStatus) => {
        setLoadingId(orderId);
        setError(null);

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BASE_URL}/orders/${orderId}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ orderStatus: newStatus }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Hiba a státusz módosításakor");
            }

            const updatedOrder = await response.json();

            setOrders((prev) =>
                prev.map((order) =>
                    order._id === orderId ? { ...order, ...updatedOrder } : order
                )
            );
        } catch (err) {
            setError(err.message);
            console.error("Státusz módosítási hiba:", err);
        } finally {
            setLoadingId(null);
        }
    };

    const formatStatus = (status) => {
        switch (status.toLowerCase()) {
            case "succes":
                return "Sikeres";
            case "canceled":
                return "Megszakítva";
            case "processing":
                return "Feldolgozás alatt";
            default:
                return status;
        }
    };

    const formatPrice = (price) =>
        new Intl.NumberFormat("hu-HU", {
            style: "currency",
            currency: "HUF",
        }).format(price);

    const filteredOrders = useMemo(() => {
        const searchTerm = filters.search.toLowerCase();
        return orders.filter((order) => {
            const matchesSearch =
                order.orderedProducts.some((product) =>
                    product.productName.toLowerCase().includes(searchTerm)
                ) ||
                order.buyerDetails[0]?.name?.toLowerCase().includes(searchTerm) ||
                order._id.toLowerCase().includes(searchTerm);

            const matchesStatus =
                filters.status === "all" ||
                order.orderStatus.toLowerCase() === filters.status;

            const orderDate = new Date(order.createdAt);
            const minDate = filters.minDate ? new Date(filters.minDate) : null;
            const maxDate = filters.maxDate ? new Date(filters.maxDate) : null;

            const matchesDate =
                (!minDate || orderDate >= minDate) && (!maxDate || orderDate <= maxDate);

            const matchesAmount =
                (!filters.minAmount || order.totalPrice >= filters.minAmount) &&
                (!filters.maxAmount || order.totalPrice <= filters.maxAmount);

            return matchesSearch && matchesStatus && matchesDate && matchesAmount;
        });
    }, [orders, filters]);

    const handleFilterChange = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const resetFilters = () => {
        setFilters({
            search: "",
            status: "all",
            minDate: "",
            maxDate: "",
            minAmount: "",
            maxAmount: "",
        });
    };

    return (
        <DashboardContainer>
            <FilterBar>
                <FilterGroup>
                    <FiSearch size={20} />
                    <SearchInput
                        placeholder="Termék, Név vagy Azonosító"
                        value={filters.search}
                        onChange={(e) => handleFilterChange("search", e.target.value)}
                    />
                </FilterGroup>

                <FilterGroup>
                    <FiFilter size={20} />
                    <Select
                        value={filters.status}
                        onChange={(e) => handleFilterChange("status", e.target.value)}
                    >
                        <option value="all">Összes státusz</option>
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Select>
                </FilterGroup>

                <FilterGroup>
                    <FiCalendar size={20} />
                    <DateInput
                        type="date"
                        value={filters.minDate}
                        onChange={(e) => handleFilterChange("minDate", e.target.value)}
                    />
                    <DateSeparator>-</DateSeparator>
                    <DateInput
                        type="date"
                        value={filters.maxDate}
                        onChange={(e) => handleFilterChange("maxDate", e.target.value)}
                    />
                    <ResetButton onClick={resetFilters}>
                        <FiX size={16} /> Szűrők törlése
                    </ResetButton>
                </FilterGroup>

            </FilterBar>

            {error && <GlobalErrorMessage>{error}</GlobalErrorMessage>}

            <ResultsInfo>
                {filteredOrders.length} találat ({orders.length} összes rendelésből)
            </ResultsInfo>

            <OrderGrid>
                {filteredOrders.map((order) => (
                    <OrderCard key={order._id}>
                        <CardHeader>
                            <OrderId>#{order._id.slice(-6)}</OrderId>
                            <StatusContainer>
                                {loadingId === order._id ? (
                                    <LoadingText>Frissítés...</LoadingText>
                                ) : (
                                    <>
                                        <StatusSelect
                                            value={order.orderStatus}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            disabled={loadingId === order._id}
                                        >
                                            {statusOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </StatusSelect>
                                        <EditIcon />
                                    </>
                                )}
                            </StatusContainer>
                        </CardHeader>

                        <CustomerInfo>
                            <CustomerName>
                                {order.buyerDetails[0]?.name || "Ismeretlen vásárló"}
                            </CustomerName>
                            <OrderDate>
                                {format(new Date(order.createdAt), "yyyy. MMMM dd. HH:mm", {
                                    locale: hu,
                                })}
                            </OrderDate>
                        </CustomerInfo>

                        <ProductList>
                            {order.orderedProducts.map((product) => (
                                <ProductItem key={product._id}>
                                    <ProductImage
                                        src={product.productImage}
                                        alt={product.productName}
                                    />
                                    <ProductDetails>
                                        <ProductName>{product.productName}</ProductName>
                                        <ProductMeta>
                                            <Price>{formatPrice(product.price.cost)}</Price>
                                            <Quantity>{product.quantity} db</Quantity>
                                        </ProductMeta>
                                    </ProductDetails>
                                </ProductItem>
                            ))}
                        </ProductList>

                        <TotalPrice>Összesen: {formatPrice(order.totalPrice)}</TotalPrice>
                    </OrderCard>
                ))}
            </OrderGrid>
        </DashboardContainer>
    );
};

// Stílusok
const DashboardContainer = styled.div`
    max-width: 1440px;
    margin: 0 auto;
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, sans-serif;
    background: #f8fafc;
    min-height: 100vh;
`;
const FilterBar = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
    background: #ffffff;
    padding: 1.5rem;
    border-radius: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    margin-bottom: 2rem;

    @media (max-width: 1200px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 1.2rem;
        padding: 1.2rem;
    }

    @media (max-width: 480px) {
        gap: 1rem;
        padding: 1rem;
    }
`;


const FilterGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #475569;
    min-width: 240px;

    &:nth-child(3),
    &:nth-child(4) {
        grid-column: span 2;

        @media (max-width: 1200px) {
            grid-column: span 1;
        }
    }

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
        gap: 0.5rem;
        min-width: auto;
    }
`;

const SearchInput = styled.input`
    flex: 1;
    padding: 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.2s;

    &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    &::placeholder {
        color: #94a3b8;
    }
`;

const Select = styled.select`
    padding: 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    background: white;
    font-size: 1rem;
    cursor: pointer;
    width: 100%;
    transition: all 0.2s;

    &:hover {
        border-color: #94a3b8;
    }
`;

const DateInput = styled.input`
    flex: 1;
    min-width: 120px;
    padding: 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    max-width: 175px;

    @media (max-width: 769px) {
        padding: 0.65rem;
        font-size: 0.9rem;
        max-width: 100%;
    }
`;

const DateSeparator = styled.span`
    color: #94a3b8;
    padding: 0 0.3rem;
    font-size: 0.9rem;
`;

const ResetButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    grid-column: 1 / -1;
    width: fit-content;
    margin: 0 auto;

    @media (max-width: 768px) {
        width: 100%;
        margin-top: 0.5rem;
    }
`;

const ResultsInfo = styled.div`
    color: #64748b;
    font-size: 1rem;
    margin-bottom: 2rem;
    text-align: center;
`;

const GlobalErrorMessage = styled.div`
    margin: 1rem 0;
    padding: 1rem;
    background: #fee2e2;
    color: #b91c1c;
    border-radius: 8px;
    text-align: center;
    font-size: 0.9rem;
`;

const OrderGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 2rem;
`;

const OrderCard = styled.div`
    background: #ffffff;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px solid #f1f5f9;
`;

const OrderId = styled.span`
    font-size: 0.9rem;
    color: #64748b;
    font-weight: 500;
`;

const StatusContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 180px;
`;

const StatusSelect = styled.select`
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    background: white;
    font-size: 1rem;
    cursor: pointer;
    appearance: none;
    transition: all 0.2s;

    &:hover {
        border-color: #94a3b8;
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }
`;

const EditIcon = styled(FiEdit)`
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #64748b;
    pointer-events: none;
`;

const LoadingText = styled.span`
    color: #64748b;
    font-size: 0.9rem;
    font-style: italic;
`;

const CustomerInfo = styled.div`
    margin-bottom: 2rem;
`;

const CustomerName = styled.div`
    font-size: 1.25rem;
    color: #1e293b;
    font-weight: 600;
    margin-bottom: 0.5rem;
`;

const OrderDate = styled.div`
    font-size: 0.9rem;
    color: #64748b;
`;

const ProductList = styled.div`
    margin-bottom: 1.5rem;
`;

const ProductItem = styled.div`
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1rem 0;
    border-bottom: 2px solid #f1f5f9;

    &:last-child {
        border-bottom: none;
    }
`;

const ProductImage = styled.img`
    width: 80px;
    height: 80px;
    object-fit: contain;
    border-radius: 8px;
    border: 2px solid #f1f5f9;
`;

const ProductDetails = styled.div`
    flex: 1;
`;

const ProductName = styled.div`
    font-size: 1.1rem;
    color: #1e293b;
    font-weight: 500;
    margin-bottom: 0.5rem;
`;

const ProductMeta = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Price = styled.span`
    color: #10b981;
    font-weight: 600;
    font-size: 1.1rem;
`;

const Quantity = styled.span`
    color: #64748b;
    font-size: 0.9rem;
`;

const TotalPrice = styled.div`
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 2px solid #f1f5f9;
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
    text-align: right;
`;

export default OrderDashboard;