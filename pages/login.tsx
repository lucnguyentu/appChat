import Button from "@mui/material/Button";
import Head from "next/head";
import Image from "next/image";
import styled from "styled-components";
import WhatsappLogo from "../assets/whatsapplogo.png";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";

const StyledContainer = styled.div`
  height: 100vh;
  display: grid;
  place-items: center;
  background-color: whitesmoke;
`;

const StyledLoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 18px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
`;

const StyledImageWrapper = styled.div`
  margin-bottom: 50px;
`;

const login = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [signInWithGoogle, _user, _loading, _error] = useSignInWithGoogle(auth);

    const signIn = () => {
        signInWithGoogle()
    }

    return (
        <StyledContainer>
            <Head>
                <title>Login page</title>
            </Head>

            <StyledLoginContainer>
                <StyledImageWrapper>
                    <Image
                        src={WhatsappLogo}
                        alt="whatsapp logo"
                        height="200px"
                        width="200px"
                    />
                </StyledImageWrapper>

                <Button variant="outlined" onClick={signIn}>
                Sing in with google
                </Button>
            </StyledLoginContainer>
        </StyledContainer>
    );
};

export default login;
