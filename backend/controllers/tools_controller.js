const TapPay = require("tappay-nodejs");
const { TAPPAY_PARTNER_KEY, TAPPAY_MERCHANT_ID } = process.env;
const {
  saveOrderToDb,
  updatePaymentStatus,
  updateMemberType,
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
  const userId = req.user.id;
  const memberType = req.body.membership_type;
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
  const memberTypeDataToDb = formMemberTypeDataToUpdate(userId, memberType);
  const updatedMemberType = await updateMemberType(memberTypeDataToDb);
  if (updatedMemberType[0].member_type !== memberType) {
    throw new Error("The inserted result of membership_type is not correct.");
  }
  return res.status(200).send({
    user_id: updatedMemberType[0].user_id,
    message: "Paid successfully and membership type have been updated!",
  });
};

const formMemberTypeDataToUpdate = (id, memberType) => {
  const now = new Date();
  const memberTypeInfo = {
    userId: id,
    memberType: memberType,
    shared_times: 0,
    shared_limit_times: 10,
    updated: now,
  };
  if (memberType === "annual_plan") {
    const nextYear = new Date().getFullYear() + 1;
    const expiredDatetime = new Date(new Date().setFullYear(nextYear));
    memberTypeInfo.expiredDatetime = expiredDatetime;
    return memberTypeInfo;
  } else if (memberType === "monthly_plan") {
    const nextMonth = new Date().getMonth() + 1;
    const expiredDatetime = new Date(new Date().setMonth(nextMonth));
    memberTypeInfo.expiredDatetime = expiredDatetime;
    return memberTypeInfo;
  }
};

module.exports = {
  tappayPrimePayFlow,
};
