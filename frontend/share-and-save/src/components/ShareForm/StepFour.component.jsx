import Button from "../Button/Button.component";
import ConfirmationCard from "../ConfirmationCard/ConfirmationCard.component";

const StepFour = () => {
  return (
    <section className="confirmation">
      <ConfirmationCard />
      <Button text="確認送出" variant="outlined" color="secondary" />
    </section>
  );
};

export default StepFour;
