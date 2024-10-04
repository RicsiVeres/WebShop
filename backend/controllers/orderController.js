const Order = require('../models/orderSchema.js');

const newOrder = async (req, res) => {
    try {

        const {
            buyer,
            shippingData,
            orderedProducts,
            paymentInfo,
            productsQuantity,
            totalPrice,
        } = req.body;

        const order = await Order.create({
            buyer,
            shippingData,
            orderedProducts,
            paymentInfo,
            paidAt: Date.now(),
            productsQuantity,
            totalPrice,
        });

        return res.send(order);

    } catch (err) {
        res.status(500).json(err);
    }
}

const getOrderedProductsByCustomer = async (req, res) => {
    try {
        let orders = await Order.find({ buyer: req.params.id });

        if (orders.length > 0) {
            const orderedProducts = orders.reduce((accumulator, order) => {
                accumulator.push(...order.orderedProducts);
                return accumulator;
            }, []);
            res.send(orderedProducts);
        } else {
            res.send({ message: "No products found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getOrderedProducts = async (req, res) => {
    try {
        const orders = await Order.aggregate([
            {
                $lookup: {
                    from: 'customers', // a 'customers' tábla neve
                    localField: 'buyer', // 'orders' táblából a buyer mező
                    foreignField: '_id', // 'customers' táblában az azonosító mező
                    as: 'buyerDetails' // a vásárlói adatok ebbe a mezőbe kerülnek
                }
            },
            {
                $project: {
                    "buyerDetails.password": 0 // a 'password' mező kizárása
                }
            }
        ]);

        if (orders.length > 0) {
            res.json(orders); // visszaküldjük az egyesített adatokat a kliensnek
        } else {
            res.send({ message: "Nincsenek megrendelések" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

    const changeOrderStatus = async (req, res) => {
        try {
            const orderId = req.params.id;
            const newStatus = req.body.orderStatus; // Az új státuszt a kliens küldi a kérés törzsében

            if (!newStatus) {
                console.log(`Order ID: ${orderId}, New Status: ${newStatus}`);
             return res.status(400).send('Order status is required');

            }

            const updatedOrder = await Order.findByIdAndUpdate(orderId, { orderStatus: newStatus }, { new: true });
        
            if (!updatedOrder) {
                return res.status(404).send('Order not found');
            }

            res.status(200).json(updatedOrder);
        } catch (error) {
            res.status(500).send('Error updating order status');
        }
    };


const getOrderedProductsBySeller = async (req, res) => {
    try {
        const sellerId = req.params.id;

        const ordersWithSellerId = await Order.find({
            'orderedProducts.seller': sellerId
        });

        if (ordersWithSellerId.length > 0) {
            const orderedProducts = ordersWithSellerId.reduce((accumulator, order) => {
                order.orderedProducts.forEach(product => {
                    const existingProductIndex = accumulator.findIndex(p => p._id.toString() === product._id.toString());
                    if (existingProductIndex !== -1) {
                        // If product already exists, merge quantities
                        accumulator[existingProductIndex].quantity += product.quantity;
                    } else {
                        // If product doesn't exist, add it to accumulator
                        accumulator.push(product);
                    }
                });
                return accumulator;
            }, []);
            res.send(orderedProducts);
        } else {
            res.send({ message: "No products found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    newOrder,
    getOrderedProducts,
    getOrderedProductsByCustomer,
    getOrderedProductsBySeller,
    changeOrderStatus
};
