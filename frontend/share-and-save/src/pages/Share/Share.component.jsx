import StepOne from "../../components/ShareForm/StepOne.component";
import StepTwo from "../../components/ShareForm/StepTwo.component";
import StepThree from "../../components/ShareForm/StepThree.component";
import { ContentWrapper } from "../SignUp/SignUp.styles";
import { useState } from "react";
import Stepper from "../../components/Stepper/Stepper.component";

const SharePage = () => {
  // index-based to align with the design of MUI's stepper, which means the first step would correpond to 0, second to 1
  const [currentStep, setCurrentStep] = useState(0);

  const onClickHandler = () => {
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
  };

  return (
    <ContentWrapper vertical width="500px">
      <h2>想要發起分購嗎？</h2>
      <Stepper activeStep={currentStep} />
      {currentStep === 0 && <StepOne onClickHandler={onClickHandler} />}
      {currentStep === 1 && <StepTwo onClickHandler={onClickHandler} />}
      {currentStep === 2 && <StepThree onClickHandler={onClickHandler} />}
    </ContentWrapper>
  );
};

export default SharePage;
