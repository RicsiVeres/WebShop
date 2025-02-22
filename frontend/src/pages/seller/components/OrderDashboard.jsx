import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import hu from "date-fns/locale/hu";
import { FiCalendar, FiEdit, FiFilter, FiSearch, FiX, FiPhone, FiMapPin } from "react-icons/fi";

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
                order.buyerDetails[0]?.name.toLowerCase().includes(searchTerm) ||
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
                            <OrderMeta>
                                <OrderId>#{order._id.slice(-6)}</OrderId>
                                <OrderDate>
                                    <FiCalendar size={14} />
                                    {format(new Date(order.createdAt), "yyyy. MMM dd. HH:mm", { locale: hu })}
                                </OrderDate>
                            </OrderMeta>

                            <StatusContainer>
                                {loadingId === order._id ? (
                                    <LoadingBadge>Frissítés...</LoadingBadge>
                                ) : (
                                    <StatusSelect
                                        value={order.orderStatus}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        status={order.orderStatus.toLowerCase()}
                                    >
                                        {statusOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </StatusSelect>
                                )}
                            </StatusContainer>
                        </CardHeader>

                        <CustomerSection>
                            <CustomerHeader>
                                <CustomerAvatar>
                                    {order.buyerDetails[0]?.name.charAt(0) || '?'}
                                </CustomerAvatar>
                                <CustomerInfo>
                                    <CustomerName>
                                        {order.buyerDetails[0]?.name || "Ismeretlen vásárló"}
                                    </CustomerName>
                                    <PaymentStatus>
                                        {order.paymentInfo?.status === 'Successful' ? '💸 Fizetve' : '⏳ Fizetésre vár'}
                                    </PaymentStatus>
                                </CustomerInfo>
                            </CustomerHeader>

                            <ContactGrid>
                                <ContactItem>
                                    <ContactIcon>
                                        <FiPhone size={18} />
                                    </ContactIcon>
                                    <ContactText>
                                        <ContactLabel>Telefonszám</ContactLabel>
                                        {order.shippingData?.phoneNo}
                                    </ContactText>
                                </ContactItem>

                                <ContactItem>
                                    <ContactIcon>
                                        <FiMapPin size={18} />
                                    </ContactIcon>
                                    <ContactText>
                                        <ContactLabel>Szállítási cím</ContactLabel>
                                        {order.shippingData?.city}, {order.shippingData?.address}
                                    </ContactText>
                                </ContactItem>
                            </ContactGrid>
                        </CustomerSection>

                        <ProductTable>
                            <TableHeader>
                                <TableHeaderItem>Termék</TableHeaderItem>
                                <TableHeaderItem>Egységár</TableHeaderItem>
                                <TableHeaderItem>Mennyiség</TableHeaderItem>
                            </TableHeader>

                            {order.orderedProducts.map((product) => (
                                <TableRow key={product._id}>
                                    <ProductInfo>
                                        <ProductImage src={product.productImage} alt={product.productName} />
                                        <ProductDetails>
                                            <ProductName>{product.productName}</ProductName>
                                            <ProductCategory>{product.category}</ProductCategory>
                                        </ProductDetails>
                                    </ProductInfo>
                                    <ProductPrice>{formatPrice(product.price.cost)}</ProductPrice>
                                    <ProductQuantity>{product.quantity} db</ProductQuantity>
                                </TableRow>
                            ))}
                        </ProductTable>

                        <TotalPrice>
                            <TotalLabel>Végösszeg:</TotalLabel>
                            <TotalAmount>{formatPrice(order.totalPrice)}</TotalAmount>
                        </TotalPrice>
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
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
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
    padding: 0.75rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    font-size: 0.95rem;
    transition: all 0.2s;

    &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
`;

const Select = styled.select`
    padding: 0.75rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    font-size: 0.95rem;
    width: 100%;
    background: white;
    cursor: pointer;
`;

const DateInput = styled.input`
    flex: 1;
    min-width: 120px;
    padding: 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;

    @media (max-width: 480px) {
        padding: 0.65rem;
        font-size: 0.9rem;
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
    font-size: 0.95rem;
    margin-bottom: 2rem;
    text-align: center;
`;

const GlobalErrorMessage = styled.div`
    padding: 1rem;
    background: #fee2e2;
    color: #b91c1c;
    border-radius: 12px;
    margin: 1rem 0;
    text-align: center;
`;

const OrderGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 2rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const OrderCard = styled.div`
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
    border: 1px solid #f1f5f9;
    transition: transform 0.2s;

    &:hover {
        transform: translateY(-3px);
    }
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #f1f5f9;
`;

const OrderMeta = styled.div`
    display: grid;
    gap: 0.25rem;
`;

const OrderId = styled.span`
    font-size: 0.85rem;
    color: #64748b;
    font-weight: 500;
`;

const OrderDate = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #94a3b8;
    font-size: 0.85rem;
`;

const StatusContainer = styled.div`
    position: relative;
`;

const StatusSelect = styled.select`
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    appearance: none;
    border: 1px solid;
    background: ${props =>
    props.status === 'succes' ? '#f0fdf4' :
        props.status === 'processing' ? '#fff7ed' :
            '#fee2e2'};
    color: ${props =>
    props.status === 'succes' ? '#16a34a' :
        props.status === 'processing' ? '#ea580c' :
            '#dc2626'};
    border-color: ${props =>
    props.status === 'succes' ? '#86efac' :
        props.status === 'processing' ? '#fdba74' :
            '#fca5a5'};
`;

const LoadingBadge = styled.div`
    padding: 0.5rem 1rem;
    border-radius: 8px;
    background: #f1f5f9;
    color: #64748b;
    font-size: 0.85rem;
`;

const CustomerSection = styled.div`
    margin: 1.5rem 0;
    padding: 1.5rem;
    background: #f8fafc;
    border-radius: 12px;
`;

const CustomerHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
`;

const CustomerAvatar = styled.div`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1.1rem;
    color: #475569;
`;

const CustomerInfo = styled.div`
    flex: 1;
`;

const CustomerName = styled.div`
    font-size: 1.1rem;
    font-weight: 600;
    color: #1e293b;
`;

const PaymentStatus = styled.div`
    font-size: 0.85rem;
    color: #64748b;
    margin-top: 0.25rem;
`;

const ContactGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
`;

const ContactItem = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: white;
    border-radius: 12px;
    border: 1px solid #f1f5f9;
`;

const ContactIcon = styled.div`
    padding: 0.75rem;
    background: #f1f5f9;
    border-radius: 8px;
    display: flex;
    color: #64748b;
`;

const ContactText = styled.div`
    flex: 1;
`;

const ContactLabel = styled.div`
    font-size: 0.75rem;
    color: #64748b;
    margin-bottom: 0.25rem;
`;

const ProductTable = styled.div`
    margin: 2rem 0;
    border: 1px solid #f1f5f9;
    border-radius: 12px;
    overflow: hidden;
`;

const TableHeader = styled.div`
    display: flex;
    padding: 1rem;
    background: #f8fafc;
    border-bottom: 1px solid #f1f5f9;
    font-weight: 500;
    color: #64748b;
`;

const TableHeaderItem = styled.div`
    flex: 1;
    &:nth-child(1) { flex: 2; }
`;

const TableRow = styled.div`
    display: flex;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #f1f5f9;
    &:last-child { border-bottom: none; }
`;

const ProductInfo = styled.div`
    flex: 2;
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const ProductImage = styled.img`
    width: 50px;
    height: 50px;
    object-fit: contain;
    border-radius: 8px;
    border: 1px solid #f1f5f9;
`;

const ProductDetails = styled.div`
    flex: 1;
`;

const ProductName = styled.div`
    font-weight: 500;
    color: #1e293b;
`;

const ProductCategory = styled.div`
    font-size: 0.8rem;
    color: #64748b;
`;

const ProductPrice = styled.div`
    flex: 1;
    text-align: center;
`;

const ProductQuantity = styled.div`
    flex: 1;
    text-align: center;
`;

const TotalPrice = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    background: #f8fafc;
    border-radius: 12px;
    font-weight: 600;
    color: #1e293b;
`;

const TotalLabel = styled.span`
    font-size: 1rem;
`;

const TotalAmount = styled.span`
    font-size: 1.2rem;
`;

export default OrderDashboard;