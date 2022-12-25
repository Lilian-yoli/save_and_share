import Button from "../Button/Button.component";
import ConfirmationCard from "../ConfirmationCard/ConfirmationCard.component";
import { useNavigate } from "react-router-dom";
import { useShareStore } from "../../stores/shareStore";
import { POST } from "../../utils/API";

const StepFour = ({ previous }) => {
  const foodInfo = useShareStore((state) => state.foodInfo)
  const shareInfo = useShareStore((state) => state.shareInfo)
  const meetUpInfo = useShareStore((state) => state.meetUpInfo)

  const navigate = useNavigate();

  const initiateShare = async () => {
    console.log('confirm', foodInfo, shareInfo, meetUpInfo);
    delete meetUpInfo.meet_up_date;
    delete meetUpInfo.meet_up_time;

    const form = { ...foodInfo, ...shareInfo, ...meetUpInfo }
    console.log('confirm', form);
    await POST('/share/share-launch', form)

    goToMyShare();
  }

  const goToMyShare = () => {
    navigate('/my-share')
  }

  return (
    <section className="confirmation">
      <ConfirmationCard foodInfo={foodInfo} shareInfo={shareInfo} meetUpInfo={meetUpInfo} />

      <div className="share-form-button">
        <Button
          onClickHandler={previous}
          type="button"
          text="上一步"
          variant="outlined"
          color="secondary"
        />
        <Button onClickHandler={initiateShare} text="確認送出" variant="outlined" color="secondary" />
      </div>
    </section>
  );
};

export default StepFour;
