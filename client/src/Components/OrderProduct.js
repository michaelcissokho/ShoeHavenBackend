import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { mobile } from '../responsive'
import { Api as api } from '../Api'

const Container = styled.div``

const Product = styled.div`
    display: flex;
    justify-content: space-between;
    ${mobile({ flexDirection: 'column' })}
`;

const ProductDetail = styled.div`
    flex:2;
    display: flex;
`;

const Image = styled.img`
    width: 200px;
`;

const Details = styled.div`
    padding: 20px;
    display: flex;
    flex-direction:column;
    justify-content: space-around;
`;
const ProductName = styled.span``;

const ProductId = styled.span``;

const ProductColor = styled.div`
    width: 20px;
    height: 20px;
    border-radius:50%;
    background-color: ${props => props.color};
`;

const ProductSize = styled.span``;

const PriceDetail = styled.div`
    flex:1;
    display: flex;
    flex-direction:column;
    align-items: center;
    justify-content: center;
`;

const ProductPrice = styled.div`
    font-size: 30px;
    font-weight: 200;
    ${mobile({ marginBottom: '20px' })}
`;


const OrderProduct = ({ productId, size, color }) => {
    const [product, setProduct] = useState({})

    useEffect(() => {
        async function getProduct(){
            let res = await api.request(`products/${productId}`)
            setProduct(res)
        }
        getProduct()
    }, [productId])



    return (
        <Container>
                <Product key={product._id}>
                    <ProductDetail>
                        <Image src={product.img} />
                        <Details>
                            <ProductName>
                                <b>Product:</b>{product.title}
                            </ProductName>
                            <ProductId>
                                <b>ID:</b> {product._id}
                            </ProductId>
                            <ProductColor color={color} />
                            <ProductSize>
                                <b>Size:</b> {size}
                            </ProductSize>
                        </Details>
                    </ProductDetail>
                    <PriceDetail>
                        <ProductPrice>${product.price}</ProductPrice>
                    </PriceDetail>
                </Product>
        </Container>
    )
}

export default OrderProduct
