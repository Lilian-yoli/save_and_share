import SignUpForm from "../../components/SignUpForm/SignUpForm.component";
import { ContentWrapper, LinkToSignInPage } from "./SignUp.styles";

const SignUpPage = () => {
  return (
    <ContentWrapper>
      <h2>還沒有註冊嗎？</h2>
      <SignUpForm />
      <LinkToSignInPage>已經有帳號了？</LinkToSignInPage>
    </ContentWrapper>
  );
};

export default SignUpPage;
