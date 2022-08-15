import styled from "styled-components";
import Image from "next/image";
import WhatsappLogo from "../assets/whatsapplogo.png";
import CircularProgress from "@mui/material/CircularProgress";

const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;
const StyledImageWrapper = styled.div`
    margin-bottom: 50px;
`;

const Loading = () => {
    return (
        <StyledContainer>
            <StyledImageWrapper>
                <Image
                    src={WhatsappLogo}
                    alt="whatsapp logo"
                    height="200px"
                    width="200px"
                />
            </StyledImageWrapper>

            <CircularProgress/>
        </StyledContainer>
    );
};

export default Loading;
