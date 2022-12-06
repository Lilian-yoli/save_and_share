import "./ConfirmationCard.styles.scss";

const ConfirmationCard = () => {
  return (
    <div className="confirmation-card">
      <p className="confirmation-card-title">請確認以下資訊</p>
      <div className="confirmation-card-content">
        <div>
          <p>食物資訊</p>
          <ul>
            <li>牛奶 20 盒</li>
          </ul>
        </div>
        <div>
          <p>分購資訊</p>
          <ul>
            <li>分購總人數: 5 人</li>
            <li>每份金額: 220 元</li>
          </ul>
        </div>
        <div>
          <p>面交資訊</p>
          <ul>
            <li>地址: 台中市西區中山路23號</li>
            <li>日期: 2022/12/2</li>
            <li>時間: 18:00</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationCard;
