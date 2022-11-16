import { useEffect, useContext } from "react";
import { ContentWrapper } from "../SignUp/SignUp.styles";
import SignInForm from "../../components/SignInForm/SignInForm.component";
import FacebookLogin from "react-facebook-login";
import "./facebook.styles.scss";
import { POST } from "../../utils/API";
import { userContext } from "../../contexts/userContext";

const SignInPage = () => {
  const { setCurrentUser } = useContext(userContext);

  const handleCredentialResponse = async (response) => {
    try {
      const access_token = response.credential;
      const form = { provider: "google", access_token };
      const { data } = await POST("user/signin", form);
      console.log(data);
    } catch (error) {
      console.error(error)
    }
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

  // Facebook sing-in
  let accessToken = "";

  function responseFacebook(values) {
    const { accessToken: token } = values;
    accessToken = token;
  }

  function componentClicked() {
    console.log("accessToken=>", accessToken);
    //TODO: post request
  }

  return (
    <ContentWrapper vertical width="450px">
      <h2>登入</h2>
      <SignInForm />
      <div id="google-login-button" style={{ marginTop: "60px" }}></div>
      <FacebookLogin
        appId="642590437217919"
        autoLoad={true}
        fields="name,email,picture"
        onClick={componentClicked}
        callback={responseFacebook}
        cssClass="my-facebook-button"
        icon="fa-facebook"
      />
    </ContentWrapper>
  );
};

export default SignInPage;
