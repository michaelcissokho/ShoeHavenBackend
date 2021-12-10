import React from 'react'
import styled from 'styled-components'
import { Facebook, Twitter, LinkedIn, GitHub, Room, Phone, MailOutline } from '@material-ui/icons';
import {mobile} from '../responsive'

const Container = styled.div`
    display: flex;
    ${mobile({flexDirection: 'column'})}
`;

const Left = styled.div`
    flex:1;
    display: flex;
    flex-direction: column;
    padding: 20px;
`;

const Logo = styled.h1``;
const Desc = styled.p`
    margin:20px 0px;
`;
const SocialContainer = styled.div`
    display: flex;
`;

const SocialIcon = styled.div`
    width: 40px;
    height: 40px;
    border-radius:50%;
    color:white;
    background-color: #${props => props.color};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    cursor: pointer;
`;

const Center = styled.div`
    flex:1;
    padding: 20px;
    ${mobile({display: 'none'})}
`;

const Title = styled.h3`
    margin-bottom:30px;
`

const List = styled.ul`
    margin:0;
    padding:0;
    list-style:none;
    display: flex;
    flex-wrap:wrap;
`

const ListItem = styled.li`
    width:50%;
    margin-bottom:10px;
    cursor: pointer;
`

const Right = styled.div`
    flex:1;
    padding: 20px;
    ${mobile({backgroundColor: '#fff8f8'})}
`;

const ContactItem = styled.div`
    margin-bottom: 20px;
    display: flex;
    align-items: center;
`;

const Footer = () => {
    return (
        <Container>
            <Left>
                <Logo>VICEROY.</Logo>
                <Desc
                >Dolor nisi officia ipsum officia amet excepteur sunt laborum. Anim adipisicing minim reprehenderit amet velit aliquip enim sit. Nostrud amet sunt commodo do do ea proident sunt.
                </Desc>
                <SocialContainer>
                    <SocialIcon color="3B5999">
                        <Facebook />
                    </SocialIcon>
                    <SocialIcon color="55ACEE">
                        <Twitter />
                    </SocialIcon>
                    <SocialIcon color="3B5999">
                        <LinkedIn />
                    </SocialIcon>
                    <SocialIcon color="E4405F">
                        <GitHub />
                    </SocialIcon>
                </SocialContainer>
            </Left>
            <Center>
                <Title>Useful Links</Title>
                <List>
                    <ListItem>Home</ListItem>
                    <ListItem>Cart</ListItem>
                    <ListItem>Mens Fashion</ListItem>
                    <ListItem>Womens Fashion</ListItem>
                    <ListItem>Accessories</ListItem>
                    <ListItem>My Account</ListItem>
                    <ListItem>Order Tracking</ListItem>
                    <ListItem>Wishlist</ListItem>
                    <ListItem>Terms</ListItem>
                </List>
            </Center>
            <Right>
                <Title>Contact</Title>
                <ContactItem><Room style={{marginRight:"10px"}}/> 4146 Spring Haven Trail, South Orange NJ, 07079 </ContactItem>
                <ContactItem><Phone style={{marginRight:"10px"}}/> +1 234 567 8901</ContactItem>
                <ContactItem><MailOutline style={{marginRight:"10px"}}/> contact@viceroy.dev</ContactItem>
            </Right>
        </Container>
    )
}

export default Footer
