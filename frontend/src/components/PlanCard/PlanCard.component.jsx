import { PlanCardWrapper } from "./PlanCard.styles";
import Button from "../../components/Button/Button.component";
import { useRef } from "react";

const PlanCard = ({ plan, action }) => {
  const { title, fee, duration, features } = plan;

  let titleRef = useRef();

  const onClickHandler = () => {
    const selectedPlan = titleRef.current.innerText;

    switch (selectedPlan) {
      case "嘗試方案": {
        // TODO: 1. post request to DB 2. popup to notify user and redirect to landing page
        action();
        break;
      }
      case "月方案": {
        // TODO: 1. post request to DB  2. to transaction page
        break;
      }
      case "年方案": {
        // TODO: 1. post request to DB  2. to transaction page
        break;
      }
      default: {
        throw new Error("無此方案");
      }
    }
  };

  return (
    <PlanCardWrapper>
      <h3 ref={titleRef}>{title}</h3>
      {fee === 0 ? (
        <p>免費</p>
      ) : (
        <p>
          {fee} NTD / {duration}
        </p>
      )}
      <ul>
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      <Button
        variant="contained"
        color="secondary"
        text="選擇"
        onClickHandler={onClickHandler}
      />
    </PlanCardWrapper>
  );
};

export default PlanCard;
