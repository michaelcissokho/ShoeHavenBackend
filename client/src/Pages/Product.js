import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Feedback from '../Components/Feedback'
import Footer from '../Components/Footer'
import { mobile } from '../responsive'
import { useLocation } from 'react-router-dom'
import { Api as api } from '../Api'

const Container = styled.div``

const Wrapper = styled.div`
    padding: 50px;
    display: flex;
    ${mobile({ padding: '10px', flexDirection: 'column' })}
`

const ImgContainer = styled.div`
    flex:1;
`

const Image = styled.img`
    width:100%;
    height: 90vh;
    object-fit:cover;
    ${mobile({ height: '40vh' })}

`

const InfoContainer = styled.div`
    flex:1;
    padding: 0px 50px;
    ${mobile({ padding: '0px 10px' })}
`

const Title = styled.h1`
    font-weight: 200;
`

const Description = styled.p`
    margin: 20px 0px;
`

const Price = styled.span`
    font-weight: 100;
    font-size: 40px;
`

const FilterContainer = styled.div`
    width:50%;
    margin: 30px 0px;
    display: flex;
    justify-content: space-between;
    ${mobile({ width: '100%' })}
`

const Filter = styled.div`
    display: flex;
    align-items: center;
`

const FilterTitle = styled.span`
    font-size: 20px;
    font-weight: 200;
`

const FilterColor = styled.option`
    width:20px;
    height: 20px;
    border-radius:50%;
    background-color: ${(props) => props.color};
    margin: 0px 5px;
    cursor: pointer;
`

const FilterSize = styled.select`
    margin-left: 10px;
    padding: 5px;
`;

const FilterSizeOption = styled.option``

const AddContainer = styled.div`
    width:50%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    ${mobile({ width: '100%' })}
`

const Button = styled.button`
    padding: 15px;
    border:2px solid teal;
    background-color: white;
    font-weight: 500;
    cursor: pointer;

    &:hover{
        background-color:#f8f4f4
    }
`

const Product = ({ submitFeedback }) => {
    //sourcing the product
    const location = useLocation()
    const id = location.pathname.split('/')[2]
    const [product, setProduct] = useState({})

    //storing values of color and size filters
    const [color, setColor] = useState("")
    const [size, setSize] = useState("")

    useEffect(() => {
        async function getProduct() {
            let res = await api.request(`products/${id}`)
            setProduct(res)
            setColor(res.colors[0])
            setSize(res.sizes[0])
        }
        getProduct()
    }, [id])

    window.scrollTo(0,0)

    //adding item to cart
    async function addToCart(id = localStorage.getItem('cartId')) {
        try {
            if(!localStorage.getItem('token')){
                alert('Please Sign In To Add Item To Cart')
                return
            }

            let oldCart = await api.request(`carts/${id}`)
            await api.request(`carts/${id}`, {
                products: [...oldCart.products, { productId: product._id, size, color, price: product.price }]
            }, 'put')
            
            alert('Added To Cart')
        } catch (err) {
            console.log('Error Adding to Cart:', err)
        }
    }

    return (
        <Container>
            <Wrapper>
                <ImgContainer>
                    <Image src={product.img} />
                </ImgContainer>
                <InfoContainer>
                    <Title>{product.title}</Title>
                    <Description>{product.desc}</Description>
                    <Price>${product.price}</Price>
                    <FilterContainer>
                        <Filter>
                            <FilterTitle>Colors</FilterTitle>
                            {product.colors?.map((color) => (
                                <FilterColor color={color} key={color} onClick={() => setColor(color)} />
                            ))}
                        </Filter>
                        <Filter>
                            <FilterTitle>Size</FilterTitle>
                            <FilterSize onChange={(e) => setSize(e.target.value)}>
                                {product.sizes?.map((s) => (
                                    <FilterSizeOption key={s}>{s}</FilterSizeOption>
                                ))}
                            </FilterSize>
                        </Filter>
                    </FilterContainer>
                    <AddContainer>
                        <Button onClick={() => addToCart()}>ADD TO CART</Button>
                    </AddContainer>
                </InfoContainer>
            </Wrapper>
            <Feedback submitFeedback={submitFeedback} />
            <Footer />
        </Container>
    )
}


export default Product
