import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Footer from '../Components/Footer'
import { mobile } from '../responsive'
import { Api as api } from '../Api'
import Order from '../Components/Order'

const Container = styled.div``;

const Wrapper = styled.div`
    padding:20px;
    ${mobile({ padding: '10px' })}
`;

const Title = styled.h1`
    font-weight: 300;
    text-align: center;
`;

const Bottom = styled.div`
    display: flex;
    justify-content: space-between;
    ${mobile({ flexDirection: 'column' })}
`;

const Info = styled.div`
    flex:3;
`;

const Hr = styled.hr`
    background-color: #eee;
    border: none;
    height: 1px;
`;

const User = () => {
    //getting the orders
    const [orders, setOrders] = useState([])

    useEffect(() => {
        async function getOrders() {
            let res = await api.request(`orders/users/${localStorage.getItem('id')}`)
            setOrders(res.filter((order) => order.status !== 'returned'))
        }
        getOrders()
    }, [])

    console.log(orders)

    return (
        <Container>
            <Wrapper>
                <Title>YOUR ORDERS</Title>
                <Bottom>
                    <Info>
                        {orders?.map(order => (
                            <Order key={order._id} orderId={order._id} />
                        ))}
                        <Hr />
                    </Info>
                </Bottom>
            </Wrapper>
            <Footer />
        </Container>
    )


}

export default User