import React from 'react'
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Api as api } from '../Api';
import { Link } from 'react-router-dom';

const Success = ({ createCart }) => {
  const location = useLocation();
  console.log(location)
  const data = location.state.stripeData;
  const cart = location.state.products;
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const createOrder = async () => {
      try {
        const res = await api.request("orders", {
          userId: localStorage.getItem('id'),
          products: cart.map((item) => ({
            productId: item.productId,
            size: item.size,
            color: item.color,
            price: item.price
          })),
          amount: data.amount / 100,
          address: data.billing_details.address,
          chargeId: data.id
        }, 'post');

        await api.request(`carts/${localStorage.getItem('cartId')}`, {}, 'delete')
        localStorage.removeItem('cartId')
        
        setOrderId(res._id);
      } catch { }
    };
    data && createOrder();
  }, [cart, data]);

  createCart()

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {orderId
        ? `Order has been created successfully. Your order number is ${orderId}`
        : `Successfull. Your order is being prepared...`}
      <Link to='/'>
        <button style={{ padding: 10, marginTop: 20 }}>Go to Homepage</button>
      </Link>
    </div>
  );
};

export default Success;