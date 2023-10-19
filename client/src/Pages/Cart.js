import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Footer from '../Components/Footer'
import { mobile } from '../responsive'
import StripeCheckout from 'react-stripe-checkout'
import { Api as api } from '../Api'
import { useHistory } from 'react-router-dom'
import CartItem from '../Components/CartItem'

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

const Summary = styled.div`
    flex:1;
    border: 0.5px solid lightgray;
    border-radius:10px;
    padding: 20px;
    height: 50vh;
`;

const SummaryTitle = styled.h1`
    font-weight: 200;
`;

const SummaryItem = styled.div`
    margin: 30px 0px;
    display: flex;
    justify-content: space-between;
    font-weight: ${props => props.type === "total" && "500"};
    font-size : ${props => props.type === "total" && "24px"};
`;

const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

const SummaryButton = styled.button`
    width: 100%;
    padding: 10px;
    background-color: black;
    color: white;
    font-weight: 600;
`;

const Cart = () => {
    //getting the cart
    const [cart, setCart] = useState([])
    const cartId = localStorage.getItem('cartId')    
    const [render, setRender] = useState(true)

    const KEY = process.env.REACT_APP_STRIPE_PUBLIC


    useEffect(() => {
        async function getCart() {
            let res = await api.request(`carts/${cartId}`)
            setCart(res)
        }
        getCart()
    }, [cartId, render])

    let cartTotal = 0

    if (cart.products) {
        for (let item of cart.products) {
            cartTotal += item.price
        }
    }

    //calling stripeCheckout
    const [stripeToken, setStripeToken] = useState(null)
    const history = useHistory()

    const onToken = (token) => {
        setStripeToken(token)
    }

    useEffect(() => {
        async function makePayment() {
            try {
                let res = await api.request(`checkout/payment`, {
                    tokenId: stripeToken.id,
                    amount: cartTotal * 100
                }, 'post')
                history.push('/success', {
                    stripeData: res,
                    products: cart.products,
                })
            } catch (err) {
                console.log(err)
            }
        }
        stripeToken && cartTotal >= 1 && makePayment()
    }, [stripeToken, cartTotal, history, cart])

    //removing item to cart
    async function removeFromCart(id = localStorage.getItem('cartId'), cartItemId) {
        try {
            let oldCart = await api.request(`carts/${id}`)
            await api.request(`carts/${id}`, {
                products: oldCart.products.filter((item) => item._id !== cartItemId)
            }, 'put')
            setRender(!render)
        } catch (err) {
            console.log('Error Removing From Cart:', err)
        }
    }

    function displayCheckoutAlert(){
        alert(`Enter card number 4242 4242 4242 4242\nand any future expiration date to complete checkout`)
    }

    return (
        <Container>
            {/* <Announcement />
            <Navbar /> */}
            <Wrapper>
                <Title>YOUR BAG</Title>
                <Bottom>
                    <Info>
                        {cart.products?.map(item => (
                            <CartItem 
                            key={item._id} 
                            productId={item.productId} 
                            size={item.size} 
                            color={item.color} 
                            removeFromCart={removeFromCart}
                            cartItemId={item._id}
                            />
                        ))}
                        <Hr />
                    </Info>
                    <Summary>
                        <SummaryTitle>ORDER SUMMARY</SummaryTitle>
                        <SummaryItem>
                            <SummaryItemText>Subtotal</SummaryItemText>
                            <SummaryItemPrice>$ {cartTotal}</SummaryItemPrice>
                        </SummaryItem>
                        <SummaryItem>
                            <SummaryItemText>Estimated Shipping</SummaryItemText>
                            <SummaryItemPrice>$ 5.90</SummaryItemPrice>
                        </SummaryItem>
                        <SummaryItem>
                            <SummaryItemText>Shipping Discount</SummaryItemText>
                            <SummaryItemPrice>$ -5.90</SummaryItemPrice>
                        </SummaryItem>
                        <SummaryItem type="total">
                            <SummaryItemText>Total</SummaryItemText>
                            <SummaryItemPrice>${cartTotal}</SummaryItemPrice>
                        </SummaryItem>
                        <StripeCheckout
                            name="Viceroy"
                            image="https://images.unsplash.com/photo-1541426599766-35c9460d3ba1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                            billingAddress
                            shippingAddress
                            description={`Your total is $${cartTotal}`}
                            amount={cartTotal * 100}
                            token={onToken}
                            stripeKey={KEY}
                        >
                            <SummaryButton onClick={displayCheckoutAlert}>CHECKOUT NOW</SummaryButton>
                        </StripeCheckout>
                    </Summary>
                </Bottom>
            </Wrapper>
            <Footer />
        </Container>
    )

}

export default Cart