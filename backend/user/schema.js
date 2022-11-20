

const signUpSchema = {
    type: "object",
    properties: {
      email: {type: "string",
              format: "email",
              minLength: 1,
              maxLength: 50},
      username: {type: "string",
                 minLength: 1,
                 maxLength: 50},
      password: {type: "string",
                 minLength: 6,
                 maxLength: 50},
      verified_password: {type: "string",
                          minLength: 6,
                          maxLength: 50}
    },
    required: ["email", "username", "password", "verified_password"],
    additionalProperties: false,
  }


const membershipTypeSchema = {
  type: "object",
  properties: {
    membership_type: {enum: ["monthly_plan", "annual_plan"]}
  },
  required: ["membership_type"],
  additionalProperties: false
}

  module.exports = {
    signUpSchema,
    membershipTypeSchema
}