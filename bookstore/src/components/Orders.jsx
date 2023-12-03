import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebase';
import '../css/Orders.css'

function Orders() {
    const userId = auth.currentUser.uid;
    const [userOrders, setUserOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                const userDoc = await firestore.collection('users').where('uid', '==', userId).get();

                if (!userDoc.empty) {
                    const userData = userDoc.docs[0].data();
                    const ordersList = userData.orders || [];
                    console.log("Orderlist: " + ordersList)

                    const ordersData = await Promise.all(ordersList.map(async (orderId) => {
                        try {
                            const orderDoc = await firestore.collection('orders').where('orderId', '==',  orderId).get();
                            
                            console.log(orderDoc)
                            if (!orderDoc.empty) {
                                const orderData = orderDoc.docs[0].data();
                                return { id: orderId, data: orderData };
                            }
                        } catch (orderError) {
                            console.error('Error fetching order details:', orderError);
                        }

                        return null;
                    }));

                    console.log(ordersData)

                    // Filter out null values (failed orders)
                    const validOrdersData = ordersData.filter(orderData => orderData !== null);

                    setUserOrders(validOrdersData);
                }
            } catch (error) {
                console.error('Error fetching user orders:', error);
            }

            setLoadingOrders(false);
        };

        fetchUserOrders();
    }, [userId]);

    return (
        <div className="orders-container">
            <h2 className="orders-title">Your Orders</h2>
            {loadingOrders ? (
                <div className="loading-spinner"></div>
            ) : (
                <div className="orders-list">
                    {userOrders.map((order, index) => (
                        <div key={index} className="order-item">
                            <h3 className="order-id">{order.id}</h3>
                            <p className="order-total">${order.data.total}</p>
                            <p className="order-date">Date - {order.data.deliveryDate.toDate().toDateString()}</p>
                            <p className="order-address">Address - {order.data.deliveryAddress}</p>
                            {/* Add more details as needed */}
                        </div>

                    ))}
                </div>
            )}
        </div>
    );
}

export default Orders;
