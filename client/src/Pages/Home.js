import React from 'react'
import Slider from '../Components/Slider'
import Categories from '../Components/Categories'
import Products from '../Components/Products'
import Footer from '../Components/Footer'
import Feedback from '../Components/Feedback'

const Home = ({submitFeedback}) => {
    window.scrollTo({top:0})
    return (
        <div>
            <Slider/>
            <Categories/>
            <Products/>
            <Feedback submitFeedback={submitFeedback}/>
            <Footer/>
        </div>
    )
}

export default Home
