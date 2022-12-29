import "./ConfirmationCard.styles.scss";
import dayjs from 'dayjs';

const ConfirmationCard = ({ foodInfo, shareInfo, meetUpInfo }) => {

  const { name } = foodInfo;
  const { total_portions, unit_description, price } = shareInfo;
  const { county, district, address, meet_up_date, meet_up_time } = meetUpInfo;

  const meetUpDateText = dayjs(meet_up_date).format('YYYY 年 M 月 D 日');
  const meetUpTimeText = dayjs(meet_up_time).format('h:mm A');

  const pricePerPortion = Math.round(price / total_portions);

  return (
    <div className="confirmation-card">
      <p className="confirmation-card-title">請確認以下資訊</p>
      <div className="confirmation-card-content">
        <div>
          <p>食物資訊</p>
          <ul>
            <li>{name}</li>
          </ul>
        </div>
        <div>
          <p>分購資訊</p>
          <ul>
            <li>分購總份數:  {total_portions} {unit_description}</li>
            <li>每份金額: {pricePerPortion} 元</li>
          </ul>
        </div>
        <div>
          <p>面交資訊</p>
          <ul>
            <li>地址: {county}{district}{address}</li>
            <li>日期: {meetUpDateText}</li>
            <li>時間: {meetUpTimeText}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationCard;
