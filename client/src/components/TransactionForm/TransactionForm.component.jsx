import { useEffect } from "react";
import "./TransactionForm.styles.scss";
import Button from "../Button/Button.component";

const fields = {
  number: {
    element: "#card-number",
    placeholder: "卡號",
  },
  expirationDate: {
    element: "#card-expiration-date",
    placeholder: "到期日 (MM / YY)",
  },
  ccv: {
    element: "#card-ccv",
    placeholder: "安全碼 (CCV)",
  },
};

const TransactionForm = ({ onSubmitHandler }) => {
  useEffect(() => {
    window.TPDirect.card.setup({
      fields: fields,
      styles: {
        input: {
          color: "gray",
          border: "1px solid #888",
          height: "40px",
          width: "300px",
          "font-size": "16px",
        },
        ":focus": {
          // 'color': 'black'
        },
        ".valid": {
          color: "green",
        },
        ".invalid": {
          color: "red",
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        "@media screen and (max-width: 400px)": {
          input: {
            color: "orange",
          },
        },
      },
      // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
      isMaskCreditCardNumber: true,
      maskCreditCardNumberRange: {
        beginIndex: 6,
        endIndex: 11,
      },
    });
  }, []);

  return (
    <>
      <div className="wrapper">
        <h3>請輸入您的付款細節</h3>
        <form>
          <div className="tpfield" id="card-number"></div>
          <div className="tpfield" id="card-expiration-date"></div>
          <div className="tpfield" id="card-ccv"></div>
          <Button
            type="submit"
            text="確認付款"
            onClickHandler={onSubmitHandler}
            variant="contained"
            color="secondary"
          />
        </form>
      </div>
    </>
  );
};

export default TransactionForm;
