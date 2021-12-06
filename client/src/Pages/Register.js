import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import {mobile} from '../responsive'

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background:linear-gradient(
        rgba(255,255,255, 0.5),
        rgba(255,255,255,0.5) 
    ), url("https://images.pexels.com/photos/6984661/pexels-photo-6984661.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940") center;
    background-size:cover;
    display: flex;
    align-items: center;
    justify-content: center;
`

const Wrapper = styled.div`
    width:40%;
    padding: 20px;
    background-color:white;
    ${mobile({width: '85%'})}
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
    margin: 20px 10px 0px 0px;
    padding: 10px;
`

const Agreement = styled.span`
    font-size: 12px;
    margin: 20px 0px;
`

const Button = styled.button`
    width:40%;
    border: none;
    background-color:teal;
    padding: 15px 20px;
    color: white;
    cursor:pointer;
`

const Register = ({ register,createCart }) => {
    let history = useHistory()

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        register(username, email, password).then(() => {
            if (localStorage.getItem('id')) {
                createCart(localStorage.getItem('id'))
                history.push('/')
            } else {
                history.push('/register')
            }
        })
    }

    return (
        <Container>
            <Wrapper>
                <Title>
                    CREATE AN ACCOUNT
                </Title>
                <Form onSubmit={handleSubmit}>
                    <Input placeholder="username" onChange={(e) => setUsername(e.target.value)} />
                    <Input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
                    <Input  type ="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                    <Agreement>
                        By creating an account, I consent to the processing of my personal data according to the <b>PRIVACY POLICY</b>
                    </Agreement>
                    <Button>CREATE</Button>
                </Form>
            </Wrapper>
        </Container>
    )
}

export default Register