import React, { useState } from 'react'
import Home from './Pages/Home'
import User from './Pages/User';
import Login from './Pages/Login'
import Register from './Pages/Register'
import { Route, Switch, Redirect, useHistory } from 'react-router-dom'
import Cart from './Pages/Cart'
import { Api as api } from './Api'
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductList from './Pages/ProductList';
import Navbar from './Components/Navbar';
import Announcement from './Components/Announcement';
import Product from './Pages/Product';
import Success from './Pages/Success';

function App() {
  const history = useHistory()
  const [user, setUser] = useState(localStorage.getItem('id'));

  async function register(username, email, password) {
    await api.register(username, email, password)
    setUser(localStorage.getItem('id'))

    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  async function login(username, password) {
    await api.login(username, password)
    setUser(localStorage.getItem('id'))    
    return new Promise((resolve, reject) => {
      resolve()
    });
  }

  async function createCart(userId){
    let cart = await api.request('carts',{userId, products:[]},'post')
    localStorage.setItem('cartId', cart._id)
  }

  function logout() {
    localStorage.clear()
    setUser(localStorage.getItem('id'))
    alert('Logged Out')
    history.push('/')
  }

  //submitting feedback
  async function submitFeedback(comment) {
    try {
      await api.request(`feedback`, { userId: localStorage.getItem('id'), comment }, 'post')
      return new Promise((resolve, reject) => {
        resolve()
      })
    } catch {}
  }

  return (
    <div className="App">
      <Announcement />
      <Navbar logout={logout} />
      <Switch>
        <Route exact path='/'>
          <Home submitFeedback={submitFeedback} />
        </Route>

        <Route exact path='/login'>
          {user ? <Redirect to='/' /> : <Login login={login} createCart={createCart}/>}
        </Route>

        <Route exact path='/register'>
          {user ? <Redirect to='/' /> : <Register register={register} createCart={createCart}/>}
        </Route>

        <Route exact path='/products/:cat'>
          <ProductList submitFeedback={submitFeedback} />
        </Route>

        <Route exact path='/product/:id'>
          <Product submitFeedback={submitFeedback} />
        </Route>

        <Route exact path='/users/:id'>
          <User />
        </Route>

        <Route exact path='/cart'>
          <Cart/>
        </Route>

        <Route exact path='/success'>
          <Success createCart={createCart}/>
        </Route>

      </Switch>
    </div>
  );
}

export default App;
