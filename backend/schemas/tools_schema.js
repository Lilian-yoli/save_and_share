const tappayPaymentInfoSchema = {
  type: "object",
  properties: {
    prime: { type: "string", minLength: 1 },
    amount: { type: "integer", minimum: 1 },
    member_id: { type: "integer", minimum: 1 },
    plan_type: { type: "string", minLength: 1 },
  },
  required: ["prime", "amount", "member_id", "plan_type"],
  additionalProperties: false,
};

module.exports = {
  tappayPaymentInfoSchema,
};
