import { Box } from "@mui/material";
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import InstagramIcon from '@mui/icons-material/Instagram';
import { AiFillTikTok } from "react-icons/ai";
import styled from 'styled-components';

function Footer() {
    return (
        <FooterContainer>
            <FooterContent>
                <Section>
                    <Heading2>Exclusive</Heading2>
                    <Heading3>Subscribe</Heading3>
                    <Paragraph>Get 10% off your first order</Paragraph>
                    <InputContainer>
                        <Input type="email" placeholder="Enter your email" />
                        <Button>Subscribe</Button>
                    </InputContainer>
                </Section>

                <Section>
                    <Heading2>Support</Heading2>
                    <Paragraph>111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.</Paragraph>
                    <Paragraph>exclusive@gmail.com</Paragraph>
                    <Paragraph>+88015-88888-9999</Paragraph>
                </Section>

                <Section>
                    <Heading2>Account</Heading2>
                    <Link href="#">My Account</Link>
                    <Link href="#">Login / Register</Link>
                    <Link href="#">Cart</Link>
                    <Link href="#">Wishlist</Link>
                    <Link href="#">Shop</Link>
                </Section>

                <Section>
                    <Heading2>Quick Link</Heading2>
                    <Link href="#">Privacy Policy</Link>
                    <Link href="#">Terms Of Use</Link>
                    <Link href="#">FAQ</Link>
                    <Link href="#">Contact</Link>
                </Section>

                <AppDownload>
                    <Heading2>Follow in Social Media</Heading2>
                    <SocialIcons>
                        <FacebookRoundedIcon />
                        <InstagramIcon />
                        <AiFillTikTok />
                    </SocialIcons>
                </AppDownload>
            </FooterContent>

            <FooterBottom>
                <Paragraph style={{ borderTop:'1px solid #473f3f', paddingTop:'2rem', color: '#473f3f'}}>© Copyright Ricsi 2024. All rights reserved</Paragraph>
            </FooterBottom>
        </FooterContainer>
    );
}

export default Footer;

// Stílusok a különböző elemekhez
const FooterContainer = styled(Box)`
    background-color: #000000;
    color: white;
    padding: 5% 10%;
    margin-top: 5vh;
    font-family: 'Arial', sans-serif;
`;

const FooterContent = styled(Box)`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 30px;
    max-width: 1440px;
    margin: 0 auto;

    @media (max-width: 1200px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 20px;
    }
`;

const Section = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 20px;

    @media (max-width: 768px) {
        align-items: center;
    }
`;

const Heading2 = styled.h2`
    margin: 0;
    padding-bottom: 15px;
    font-size: 20px;
    font-weight: bold;
`;

const Heading3 = styled.h3`
    margin: 0;
    padding-bottom: 10px;
    font-size: 16px;
    font-weight: normal;
`;

const Paragraph = styled.p`
    margin: 10px 0;
    font-size: 14px;
    line-height: 1.5;

    @media (max-width: 768px) {
        font-size: 12px;
    }
`;

const Link = styled.a`
    text-decoration: none;
    color: white;
    margin-bottom: 10px;
    font-size: 14px;
    &:hover {
        color: #DB4444;
        font-weight: bold;
    }

    @media (max-width: 768px) {
        font-size: 12px;
    }
`;

const InputContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: 20px;
    justify-content: center;
    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const Input = styled.input`
    padding: 12px;
    border: none;
    outline: none;
    border-radius: 5px;
    margin-right: 15px;
    width: 240px;
    font-size: 14px;

    @media (max-width: 768px) {
        width: 100%;
        margin-right: 0;
    }
`;

const Button = styled.button`
    background-color: #e42f2f;
    padding: 12px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    color: white;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #DB4444;
    }

    @media (max-width: 768px) {
        width: 100%;
    }
`;

const SocialIcons = styled.div`
    display: flex;
    gap: 25px;
    margin-top: 20px;
    svg {
        font-size: 28px;
        color: white;
        transition: color 0.3s ease;
        &:hover {
            color: #DB4444;
        }
    }

    @media (max-width: 768px) {
        justify-content: center;
    }
`;

const AppDownload = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    @media (max-width: 768px) {
        align-items: center;
    }
`;

const FooterBottom = styled(Box)`
    text-align: center;
    margin-top: 40px;
    font-size: 14px;
    color: white;
    margin-bottom: 20px;
`;
