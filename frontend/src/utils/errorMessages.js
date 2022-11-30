const errors = {
  "Duplicated Email.": "此信箱已註冊過",
  "Invalid information.": "帳號或密碼有誤",
};

export default function convertErrorMessages(error) {
  const { errorMsg } = error.response.data.error;
  return errors[errorMsg];
}
