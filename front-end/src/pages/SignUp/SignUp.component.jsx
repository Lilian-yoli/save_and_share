import SignUpForm from "../../components/SignUpForm/SignUpForm.component";
import { ContentWrapper, LinkToSignInPage } from "./SignUp.styles";
import { useState } from "react";
import PlanCard from "../../components/PlanCard/PlanCard.component";
import ConfirmationPopup from "../../components/Dialog/Dialog.component";
import { useNavigate } from "react-router-dom";

const PLAN_LIST = [
  {
    title: "嘗試方案",
    fee: 0,
    features: ["可以加入分購", "無法發起分購"],
    duration: null,
  },
  {
    title: "月方案",
    fee: 20,
    features: ["可以加入分購", "可以發起分購", "單日可發起 10 筆分購"],
    duration: "月",
  },
  {
    title: "年方案",
    fee: 100,
    features: [
      "可以加入分購",
      "可以發起分購",
      "單日可發起 10 筆分購",
      "比起月方案，節省超過 50% 的費用",
    ],
    duration: "年",
  },
];

const SignUpPage = () => {
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const onSubmitHandler = () => {
    setIsSignedUp(true);
  };

  const handleClickOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    navigate("/");
  };

  return isSignedUp ? (
    <ContentWrapper gap="20px">
      {PLAN_LIST.map((plan, index) => (
        <PlanCard plan={plan} key={index} action={handleClickOpen} />
      ))}

      <ConfirmationPopup
        open={isOpen}
        action={handleClose}
        content="已成功註冊囉～確認後會回到首頁 :)"
        buttonText={{ negative: "", positive: "OK" }}
      />
    </ContentWrapper>
  ) : (
    <ContentWrapper vertical width="450px">
      <h2>還沒有註冊嗎？</h2>
      <SignUpForm onSubmitHandler={onSubmitHandler} />
      <LinkToSignInPage>已經有帳號了？</LinkToSignInPage>
    </ContentWrapper>
  );
};

export default SignUpPage;
