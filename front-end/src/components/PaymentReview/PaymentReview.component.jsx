import "./PaymentReview.styles.scss";

const PaymentReview = () => {
  return (
    <div className="payment-review">
      <p className="payment-review-subject">購買資訊</p>
      <div className="payment-review-content">
        <p>購買方案: 年方案</p>
        <p>總額: NTD 100</p>
      </div>
    </div>
  );
};

export default PaymentReview;
