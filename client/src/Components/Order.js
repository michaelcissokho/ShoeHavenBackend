import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { mobile } from '../responsive'
import { Api as api } from '../Api'
import OrderProduct from './OrderProduct'
import {v4 as uuid} from 'uuid'

const Container = styled.div``

const Summary = styled.div`
    flex:1;
    border: 0.5px solid lightgray;
    border-radius:10px;
    padding: 20px;
`;

const SummaryTitle = styled.h1`
    font-weight: 200;
`;

const SummaryItem = styled.div`
    margin: 30px 0px;
    text-align:right;
    font-weight: ${props => props.type === "total" && "500"};
    font-size : ${props => props.type === "total" && "24px"};
`;

const SummaryItemText = styled.span`
    margin:10px;
`;

const SummaryItemPrice = styled.span``;

const SummaryButton = styled.button`
    width: 100%;
    padding: 10px;
    background-color: black;
    color: white;
    font-weight: 600;
`;

const Order = ({ orderId }) => {
    const [order, setOrder] = useState({})

    useEffect(() => {
        async function getOrder() {
            let res = await api.request(`orders/find/${orderId}`)
            setOrder(res)
        }
        getOrder()
    }, [orderId])

    async function returnOrder(){
        try {
            let refund = await api.request(`checkout/refund`,{chargeId:order.chargeId}, 'post')
            let markReturned = await api.request(`orders/return/${order._id}`,{status:'returned'},'post')
            console.log('Refund', refund)
            console.log("Item Returned", markReturned)
            alert(`Order: ${markReturned._id} returned. You Have Been Refunded: $${refund.amount/100}`)
            return (refund,markReturned)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <Container>
            <Summary>
                <SummaryTitle>ORDER SUMMARY</SummaryTitle>
                {order.products?.map(product => 
                <OrderProduct 
                key={uuid()} 
                productId={product.productId} 
                size={product.size} 
                color={product.color}
                />)}
                <SummaryItem type="total">
                    <SummaryItemPrice>
                        <SummaryItemText>Total</SummaryItemText>
                         ${order.amount}
                    </SummaryItemPrice>
                </SummaryItem>
                <SummaryButton onClick={() => returnOrder()}>RETURN ORDER</SummaryButton>
            </Summary>
        </Container>
    )
}

export default Order
