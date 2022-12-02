import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Box from "@mui/material/Box";
import "./Stepper.styles.scss";

const steps = ["食物資訊", "分購資訊", "面交資訊", "確認資訊"];

const SStepper = ({ activeStep }) => {
  return (
    <Box sx={{ width: "100%", marginTop: "25px" }}>
      <Stepper activeStep={activeStep} className="custom-stepper">
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};

          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};

export default SStepper;
