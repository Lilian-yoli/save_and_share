const TapPay = require("tappay-nodejs");
const { TAPPAY_PARTNER_KEY, TAPPAY_MERCHANT_ID } = process.env;

TapPay.initialize({
  partner_key: TAPPAY_PARTNER_KEY,
  env: "sandbox",
});

const tappayDirectPayFlow = (req, res) => {
  const { prime } = req.body;
  const paymentInfo = {
    prime,
    merchant_id: TAPPAY_MERCHANT_ID,
    amount: 1,
    currency: "TWD",
    details: "An apple and a pen.",
    cardholder: {
      phone_number: "+886923456789",
      name: "王小明",
      email: "LittleMing@Wang.com",
    },
  };
  TapPay.payByPrime(paymentInfo)
    .then((response) => {
      console.log(response.body);
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  tappayDirectPayFlow,
};
