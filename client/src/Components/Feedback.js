import React, { useState } from 'react'
import styled from 'styled-components'
import { Send } from '@material-ui/icons';
import { mobile } from '../responsive'

const Container = styled.div`
    height: 60vh;
    background-color: #fcf5f5;
    display: flex;
    align-items: center;
    justify-content: center; 
    flex-direction: column;
`;
const Title = styled.h1`
    font-size:70px;
    margin-bottom: 20px;
    ${mobile({ textAlign: 'center', fontSize: '35px' })}
`;

const Desc = styled.div`
    font-size:24px;
    font-weight: 300;
    margin-bottom: 20px;
    ${mobile({ padding: '10px 0px' })}
`;

const InputContainer = styled.form`
    width:50%;
    height: 160px;
    background-color: white;
    display: flex;
    justify-content: space-between;
    border: 1px solid lightgray;
    ${mobile({ width: '95%', height: '100px' })}
`;
const Input = styled.textarea`
    border:none;
    flex:8;
    padding-left: 20px;
`;
const Button = styled.button`
    flex:1;
    border:none;
    background-color: teal;
    color:white;
`;

const Feedback = ({ submitFeedback }) => {
    const [comment, setComment] = useState("")
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        submitFeedback(comment).then(() => {
            setSubmitted(true)
        })
    }

    if (submitted === false) {
        return (
            <Container>
                <Title>Want To Help Improve Viceroy?</Title>
                <Desc>Tell Us About Your Experience:</Desc>
                <InputContainer onSubmit={handleSubmit}>
                    <Input onChange={(e) => setComment(e.target.value)} />
                    <Button type="submit">
                        <Send />
                    </Button>
                </InputContainer>
            </Container>
        )
    } else {
        return (
            <Container>
                <Desc>Thank You For Your Feedback</Desc>
                <button onClick={() => setSubmitted(false)}>Submit Again</button>
            </Container>
        )
    }

}

export default Feedback