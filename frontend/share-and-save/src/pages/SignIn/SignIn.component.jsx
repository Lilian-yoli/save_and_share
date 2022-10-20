import { useEffect } from "react";
import { ContentWrapper } from "../SignUp/SignUp.styles";
import SignInForm from "../../components/SignInForm/SignInForm.component";

const SignInPage = () => {
  const handleCredentialResponse = (response) => {
    console.log("Encoded JWT ID token: " + response.credential);
  };

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:
        "796720117989-9a41ji9c7saef2hlhmfd1jlv464fhkoh.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("google-login-button"),
      { theme: "theme", width: "450", shape: "pill" } // customization attributes
    );
  }, []);

  return (
    <ContentWrapper vertical width="450px">
      <h2>登入</h2>
      <SignInForm />
      <div id="google-login-button" style={{marginTop: '60px'}}></div>
    </ContentWrapper>
  );
};

export default SignInPage;
