import React, { useEffect, useState } from 'react'
import Product from './Product'
import { Api as api } from '../Api'
import { v4 as uuid } from 'uuid'
import styled from 'styled-components'

const Container = styled.div`
    padding: 20px;
    display: flex;
    flex-wrap:wrap;
    justify-content: space-between;
`;

const Listings = ({ cat, filters, sort, addToCart }) => {
    const [products, setProducts] = useState([])
    const [filteredProducts,setFilteredProducts] = useState([])

    useEffect(() => {
        async function getProducts() {
            let res = cat ? await api.request(`products?category=${cat}`) : await api.request(`products`)
            
            setProducts(res)
        }
        getProducts()
    }, [cat])

    useEffect(() => {
        cat && 
        setFilteredProducts(
            products.filter((item) => 
                Object.entries(filters).every(([key,value])=>
                    item[key].includes(value)
                )
            )
        )
    },[cat,filters,products])

    useEffect(() => {
        if(sort === "newest"){
            setFilteredProducts(prevProducts => 
                [...prevProducts].sort((a,b) => a.createdAt - b.createdAt)
            )
        }else if(sort === "asc"){
            setFilteredProducts(prevProducts => 
                [...prevProducts].sort((a,b) => a.price - b.price)
            )
        }else{
            setFilteredProducts(prevProducts => 
                [...prevProducts].sort((a,b) => b.price - a.price)
            )
        }
    },[sort])

    return (
        <Container>
            {cat
            ? filteredProducts.map((listing) =><Product key={uuid()} _id={listing._id} addToCart={addToCart}/>)
            : products.slice(0,8)
            .map((listing) => <Product key={uuid()} _id={listing._id} addToCart={addToCart}/>)
            }
        </Container>
    )
}

export default Listings