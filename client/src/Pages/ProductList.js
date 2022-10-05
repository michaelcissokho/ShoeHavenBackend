import React, {useState} from 'react'
import styled from 'styled-components'
import Navbar from '../Components/Navbar';
import Announcement from '../Components/Announcement';
import Products from '../Components/Products';
import Footer from '../Components/Footer';
import {mobile} from '../responsive'
import { useLocation } from 'react-router-dom';
import Feedback from '../Components/Feedback';


const Container = styled.div``;

const Title = styled.h1`
    margin: 20px;
`;

const FilterContainer = styled.div`
    display: flex; 
    justify-content: space-between;
`;

const Filter = styled.div`
    margin: 20px;
    ${mobile({margin: '0px 20px', display: 'flex', flexDirection:'column'})}
`;

const FilterText = styled.span`
    font-size: 20px;
    font-weight: 600;
    margin-right: 20px;
    ${mobile({marginRight: '0px'})}
`;

const Select = styled.select`
    padding: 10px;
    margin-right: 20px;
    ${mobile({margin: '10px 0px'})}
`;
const Option = styled.option``;


const ProductList = ({submitFeedback}) => {
    const location = useLocation()
    const cat = location.pathname.split('/')[2]
    const [filters, setFilters] = useState({})

    function handleFilters(e){   
        e.target.name === "sizes" ? 
       setFilters({
           ...filters,
           [e.target.name]:+e.target.value
       })  
       :
       setFilters({
           ...filters,
           [e.target.name]:e.target.value
       })
    }

    const [sort, setSort] = useState("newest")

    window.scrollTo(0,0)


    return (
        <Container>
            <Title>{cat}</Title>
            <FilterContainer>
                <Filter>
                    <FilterText>Filter Products:</FilterText>
                    <Select name="colors" onChange={handleFilters}>
                        <Option disabled selected>
                            Color
                        </Option>
                        <Option>white</Option>
                        <Option>black</Option>
                        <Option>red</Option>
                        <Option>blue</Option>
                        <Option>gold</Option>
                        <Option>green</Option>
                    </Select>
                    <Select name="sizes" onChange={handleFilters}>
                        <Option disabled selected>
                            Size
                        </Option>
                        <Option>7</Option>
                        <Option>7.5</Option>
                        <Option>8</Option>
                        <Option>8.5</Option>
                        <Option>9</Option>
                        <Option>9.5</Option>
                        <Option>10</Option>
                        <Option>10.5</Option>
                        <Option>11</Option>
                        <Option>11.5</Option>
                        <Option>12</Option>
                        <Option>12.5</Option>
                        <Option>13</Option>
                    </Select>
                </Filter>
                <Filter>
                <FilterText>Sort Products:</FilterText>
                <Select onChange={e => setSort(e.target.value)}>
                    <Option value="newest">Newest</Option>
                    <Option value="asc">Price (asc)</Option>
                    <Option value="desc">Price (desc)</Option>
                </Select>
                </Filter>
            </FilterContainer>
            <Products cat={cat} filters={filters} sort={sort}/>
            <Feedback submitFeedback={submitFeedback}/>
            <Footer/>
        </Container>
    )
}

export default ProductList
