import React from 'react'
import styled from 'styled-components'
import { Facebook, Twitter, LinkedIn, GitHub, Room, Phone, MailOutline } from '@material-ui/icons';
import {mobile} from '../responsive'
import {Link} from 'react-router-dom';

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
                <Desc>
                    A site for all shoes for sale by Michael Cissokho the site's creator. Hopefully you will find your perfect fit!
                </Desc>
                <SocialContainer>
                    {/* <SocialIcon color="3B5999">
                        <Facebook />
                    </SocialIcon>
                    <SocialIcon color="55ACEE">
                        <Twitter />
                    </SocialIcon> */}
                    <SocialIcon color="3B5999">
                        <a href={"https://www.linkedin.com/in/michaelcissokho/"}>
                            <LinkedIn style={{textDecoration:'none', color:'white'}}/> 
                        </a>   
                    </SocialIcon>
                    <SocialIcon color="E4405F">    
                        <a href={"https://github.com/michaelcissokho"} > 
                            <GitHub style={{textDecoration:'none', color:'white'}}/>
                        </a>
                    </SocialIcon>
                </SocialContainer>
            </Left>
            <Center>
                <Title>Useful Links</Title>
                <List>
                    <ListItem>
                        <Link to="/" style={{textDecoration:'none', color:'black'}}> Home </Link>
                    </ListItem>
                    <ListItem>
                        <Link to="/cart" style={{textDecoration:'none', color:'black'}}> Cart</Link> 
                    </ListItem>
                    <ListItem> 
                        <Link to="/products/men" style={{textDecoration:'none', color:'black'}}> Mens Fashion </Link>
                    </ListItem>
                    <ListItem> 
                        <Link to="/products/women" style={{textDecoration:'none', color:'black'}}> Womens Fashion </Link>
                    </ListItem>                  
                    <ListItem> 
                        <Link to="/products/casual" style={{textDecoration:'none', color:'black'}}> Casual </Link>
                    </ListItem>
                    <ListItem> 
                        <Link to={`/users/${localStorage.getItem('id')}`} style={{textDecoration:'none', color:'black'}}> My Account </Link>
                    </ListItem>
                </List>
            </Center>
            <Right>
                <Title>Contact</Title>
                <ContactItem><Room style={{marginRight:"10px"}}/> 4146 Spring Haven Trail, South Orange NJ, 07079 </ContactItem>
                <ContactItem><Phone style={{marginRight:"10px"}}/> +1 732 421 5239</ContactItem>
                <ContactItem><MailOutline style={{marginRight:"10px"}}/> michael.cissokho@gmail.com</ContactItem>
            </Right>
        </Container>
    )
}

export default Footer
