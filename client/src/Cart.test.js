import { render, screen } from '@testing-library/react';
import Cart from './Cart'

let items
beforeEach(function(){
    items = [  {
        "id": 6,
        "username": "michael",
        "title": "Item 2",
        "picture": "",
        "price": 1000,
        "details": "This is the second listing on this website",
        "sold": false
      },
      {
        "id": 7,
        "username": "michael",
        "title": "Item 3",
        "picture": "",
        "price": 200,
        "details": "Item 3 to test out the grid",
        "sold": false
      }]
})

it('renders cart without error', function(){
    render(<Cart items={items}/>)
})

it('should match snapshot', function(){
    const {asFragment} = render(<Cart items={items}/>)
    expect(asFragment()).toMatchSnapshot()
})
