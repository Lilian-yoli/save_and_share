const TapPay = require("tappay-nodejs");
const { TAPPAY_PARTNER_KEY, TAPPAY_MERCHANT_ID } = process.env;
const {
  saveOrderToDb,
  updatePaymentStatus,
} = require("./../models/tools_model");
const { validateInputData } = require("../utils");
const { tappayPaymentInfoSchema } = require("../schemas/tools_schema");

TapPay.initialize({
  partner_key: TAPPAY_PARTNER_KEY,
  env: "sandbox",
});

const sendPaymentInfoToTappay = async ({ prime, amount }) => {
  const paymentInfo = {
    prime,
    merchant_id: TAPPAY_MERCHANT_ID,
    amount,
    currency: "TWD",
    details: "An apple and a pen.",
    cardholder: {
      phone_number: "+886923456789",
      name: "王小明",
      email: "LittleMing@Wang.com",
    },
  };
  const payResult = await TapPay.payByPrime(paymentInfo)
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
  return payResult;
};

const tappayPrimePayFlow = async (req, res) => {
  const form = req.body;
  const validatedResult = validateInputData(tappayPaymentInfoSchema, form);
  if (validatedResult.error) {
    return res.status(422).send(validatedResult);
  }
  const [orderIdObject] = await saveOrderToDb(form);
  const payResult = await sendPaymentInfoToTappay(form);
  if (payResult.status == 0) {
    const updatedPaymentStatus = await updatePaymentStatus(orderIdObject.id);
    if (updatedPaymentStatus.rowCount != 1) {
      throw new Error("Something went wrong when updating payment status.");
    }
  } else {
    throw new Error("Tappay transaction failed.");
  }
  res.status(200).send({ data: { message: "Already paid successfully." } });
};

module.exports = {
  tappayPrimePayFlow,
};
