import "./PaymentReview.styles.scss";

const PaymentReview = ({ type }) => {
  const planTypes = {
    'monthly_plan': { name: '月方案', price: 20 },
    'annual_plan': { name: '年方案', price: 100 }
  }


  return (
    <div className="payment-review">
      <p className="payment-review-subject">購買資訊</p>
      <div className="payment-review-content">
        <p>購買方案: {planTypes[type].name}</p>
        <p>總額: NTD {planTypes[type].price}</p>
      </div>
    </div>
  );
};

export default PaymentReview;
