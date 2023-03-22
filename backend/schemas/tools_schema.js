const tappayPaymentInfoSchema = {
  type: "object",
  properties: {
    prime: { type: "string", minLength: 1 },
    amount: { type: "integer", minimum: 1 },
    member_id: { type: "integer", minimum: 1 },
    membership_type: { enum: ["monthly_plan", "annual_plan"] },
  },
  required: ["prime", "amount", "member_id", "membership_type"],
  additionalProperties: false,
};

module.exports = {
  tappayPaymentInfoSchema,
};
