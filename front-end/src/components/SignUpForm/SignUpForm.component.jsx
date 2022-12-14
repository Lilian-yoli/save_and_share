import { useFormik } from "formik";
import { TextField } from "@mui/material";
import Button from "../Button/Button.component";
import Dialog from "../Dialog/Dialog.component";
import { string, object, ref } from "yup";
import { FormfieldWrapper } from "./SignUpForm.styles";
import { POST } from "../../utils/API";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import convertErrorMessages from "../../utils/errorMessages";
import { useState, useContext } from "react";
import { userContext } from "../../contexts/userContext";


dayjs.extend(duration);

const SignUpForm = ({ onSubmitHandler }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { setCurrentUser } = useContext(userContext)

  const validationSchema = object({
    email: string().email("不符 Email 格式").required("請填寫信箱"),
    username: string().required("請填寫姓名"),
    password: string().trim().min(6, "至少輸入 6 碼").required("請填寫密碼"),
    verified_password: string()
      .required("必填")
      .oneOf([ref("password")], "必須與密碼相同喔"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      verified_password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const { data } = await POST("/user/signup", values);
        const { data: { access_token, token_expired, user } } = data
        const daysToExpire = dayjs.duration(token_expired, "seconds").asDays();
        Cookies.set("Share&SaveToken", access_token, { expires: daysToExpire });
        setCurrentUser({ id: user.id, isLoggedIn: true })
        onSubmitHandler();
      } catch (error) {
        const errorMsg = convertErrorMessages(error);
        setErrorMsg(errorMsg);
        setIsDialogOpen(true);
      }
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <FormfieldWrapper>
          <TextField
            id="email"
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            className="customized"
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            id="username"
            name="username"
            label="姓名"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            className="customized"
            helperText={formik.touched.name && formik.errors.name}
            sx={{ marginTop: "20px;" }}
          />
          <TextField
            id="password"
            name="password"
            label="密碼"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            className="customized"
            helperText={formik.touched.password && formik.errors.password}
            sx={{ marginTop: "20px;" }}
          />
          <TextField
            id="verified_password"
            name="verified_password"
            label="確認密碼"
            type="password"
            value={formik.values.verified_password}
            onChange={formik.handleChange}
            error={
              formik.touched.verified_password &&
              Boolean(formik.errors.verified_password)
            }
            className="customized"
            helperText={
              formik.touched.verified_password &&
              formik.errors.verified_password
            }
            sx={{ marginTop: "20px;" }}
          />
          <Button type="submit" text="註冊" variant="contained" size="large" />
        </FormfieldWrapper>
      </form>
      <Dialog
        content={errorMsg}
        open={isDialogOpen}
        buttonText={{ positive: "知道了" }}
        action={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export default SignUpForm;
