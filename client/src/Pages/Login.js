import React, { useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import styled from 'styled-components'
import { mobile } from '../responsive'

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background:linear-gradient(
        rgba(255,255,255, 0.5),
        rgba(255,255,255,0.5) 
    ), url("https://images.pexels.com/photos/6984650/pexels-photo-6984650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940") center;
    background-size:cover;
    display: flex;
    align-items: center;
    justify-content: center;
`

const Wrapper = styled.div`
    width:25%;
    padding: 20px;
    background-color:white;
    ${mobile({ width: '80%' })}
`

const Title = styled.h1`
    font-size: 24px;
    font-weight: 300;
`

const Form = styled.form`
    display: flex;
    flex-direction: column;
`

const Input = styled.input`
    flex:1;
    min-width:40%;
    margin: 10px 0px;
    padding: 10px;
`

const Button = styled.button`
    width:40%;
    border: none;
    background-color:teal;
    padding: 15px 20px;
    color: white;
    cursor:pointer;
    margin-bottom: 10px;
`

const CreateAccountStyle = {
    margin: '5px 0px',
    fontSize: '12px',
    textDecoration: 'underline',
    cursor: 'pointer'
};


const Login = ({ login,createCart }) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    let history = useHistory()

    const handleSubmit = (e) => {
        e.preventDefault()
        login(username, password).then(() => {
            if (localStorage.getItem('id')) {
                createCart(localStorage.getItem('id'))
                history.push('/')
            } else {
                history.push('/login')
                alert('Invalid Username/Password')
            }
        })
    }

    return (
        <Container>
            <Wrapper>
                <Title>
                    SIGN IN
                </Title>
                <Form onSubmit={handleSubmit}>
                    <Input placeholder="username" onChange={(e) => setUsername(e.target.value)} />
                    <Input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                    <Button>LOGIN</Button>
                </Form>
                <Link to="/register" style={CreateAccountStyle}>CREATE A NEW ACCOUNT</Link>
            </Wrapper>
        </Container>
    )
}


export default Login