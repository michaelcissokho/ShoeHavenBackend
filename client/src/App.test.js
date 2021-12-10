import React from "react";
import '@testing-library/jest-dom'
import { render, fireEvent } from "@testing-library/react";
import Cart from "./Pages/Cart";
import CheckoutForm from '../Transactions/CheckoutForm'
import App from './App'
import Listings from './Components/Listings'
import { MemoryRouter, BrowserRouter } from 'react-router-dom'

it("renders without crashing", function () {
  render(<BrowserRouter><Cart items={[]} /></BrowserRouter>);
});

it("matches snapshot with no itms", function () {
  const { asFragment } = render(<BrowserRouter><Cart items={[]} /></BrowserRouter>);
  expect(asFragment()).toMatchSnapshot();
});


//click on a listing from listings page and see if it shows up in cart*********************** need help here
it('adds item to cart', function () {
  const { getByText } = render(
    <BrowserRouter>
      <Listings />
    </BrowserRouter>
  )
  const addToCart = getByText('Add To Cart')
  fireEvent.click(addToCart)
  //make sure you can close the alert*****************
  const closeAlert = getByText('OK')
  fireEvent.click(closeAlert)
  const cart = getByText('Cart')
  fireEvent.click(cart)
  expect(getByText(' Remove From Cart ')).toBeInTheDocument()

})


//check if you can delete an item from the cart
it('can delete item from cart', function () {
  //figure out how to mock function removeFrom cart**********
  const { getByText } = render(
    <BrowserRouter>
      <Cart items={[{ id: 1, username: 'test1', title: 'item1', picture: '', price: 100, removeFromCart: 'removeFromCart' }]} />)
  </BrowserRouter>
  )
  const link = getByText('Remove From Cart')
  fireEvent.click(link)
  expect(getByText('Remove From Cart')).not.toBeInTheDocument()
})


//click on checkout button and make sure it routes to checkoutform
it('goes to checkout form', function () {
  //figure out how to mock function removeFrom cart**********
  const { getByText } = render(<MemoryRouter initialEntries={['/cart']}><App /></MemoryRouter>)
  const link = getByText('Checkout')
  fireEvent.click(link)
  expect(getByText('Enter Details To Checkout Your Items:')).toBeInTheDocument()
})


//make sure checkout form renders properly
it('renders checkout form properly', function () {
  const { asFragment } = render(
    <BrowserRouter>
      <CheckoutForm cart={[{ id: 1, username: 'test1', title: 'item1', picture: '', price: 100, removeFromCart: 'removeFromCart' }]} />)
  </BrowserRouter>
  )
  expect(asFragment()).toMatchSnapshot()
})


