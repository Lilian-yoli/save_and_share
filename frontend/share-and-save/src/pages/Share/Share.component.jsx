import StepOne from "../../components/ShareForm/StepOne.component";
import StepTwo from "../../components/ShareForm/StepTwo.component";
import { ContentWrapper } from "../SignUp/SignUp.styles";
import { useState } from "react";

const SharePage = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const onClickHandler = () => {
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
  };

  return (
    <ContentWrapper vertical width="450px">
      <h2>想要發起分購嗎？</h2>
      {currentStep === 1 && <StepOne onClickHandler={onClickHandler} />}
      {currentStep === 2 && <StepTwo onClickHandler={onClickHandler} />}
    </ContentWrapper>
  );
};

export default SharePage;
