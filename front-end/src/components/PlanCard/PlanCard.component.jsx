import { PlanCardWrapper } from "./PlanCard.styles";
import Button from "../Button/Button.component";
import { useRef } from "react";
import { POST } from '../../utils/API';
import { useNavigate } from "react-router-dom";


const PlanCard = ({ plan, action }) => {
  const { title, fee, duration, features } = plan;

  let titleRef = useRef();

  const navigate = useNavigate();

  const onClickHandler = async () => {
    const selectedPlan = titleRef.current.innerText;

    switch (selectedPlan) {
      case "嘗試方案": {
        action();
        break;
      }
      case "月方案": {
        await POST('/user/update-membership-type', { 'membership_type': 'monthly_plan' })
        navigate('/transaction?plan=monthly_plan')
        break;
      }
      case "年方案": {
        await POST('/user/update-membership-type', { 'membership_type': 'annual_plan' })
        navigate('/transaction?plan=annual_plan')
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
