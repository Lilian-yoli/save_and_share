

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
                 minLength: 1,
                 maxLength: 50}
    },
    required: ["email", "username", "password"],
    additionalProperties: false,
  }

  module.exports = {
    signUpSchema
}