import { TextField } from "@mui/material";
import { useFormik } from "formik";
import { object, string } from "yup";
import Button from "../Button/Button.component";
import { FormfieldWrapper } from "../SignUpForm/SignUpForm.styles";
import { POST } from "../../utils/API";
import convertErrorMessages from "../../utils/errorMessages";
import Dialog from "../Dialog/Dialog.component";
import { useState, useContext } from "react";
import { userContext } from "../../contexts/userContext";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const SignInForm = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { setCurrentUser } = useContext(userContext);

  const navigate = useNavigate();

  const validationSchema = object({
    email: string().email("不符 Eamil 格式").required("必填"),
    password: string().required("必填"),
  });

  const { handleChange, handleSubmit, values, errors, touched } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const {
          data: { access_token, token_expired, user },
        } = await POST("user/signin", values);
        const daysToExpire = dayjs.duration(token_expired, "seconds").asDays();
        Cookies.set("Share&SaveToken", access_token, { expires: daysToExpire });
        setCurrentUser({ id: user.id, isLoggedIn: true });
        navigate("/");
      } catch (error) {
        const errorMsg = convertErrorMessages(error);
        setErrorMsg(errorMsg);
        setIsDialogOpen(true);
      }
    },
  });

  return (
    <>
      <form onSubmit={handleSubmit}>
        <FormfieldWrapper>
          <TextField
            id="email"
            name="email"
            label="信箱"
            type="email"
            value={values.email}
            onChange={handleChange}
            error={touched.email && Boolean(errors.email)}
            helperText={touched.email && errors.email}
          ></TextField>
          <TextField
            id="password"
            name="password"
            label="密碼"
            type="password"
            value={values.password}
            onChange={handleChange}
            error={touched.password && Boolean(errors.password)}
            helperText={touched.password && errors.password}
            sx={{ marginTop: "20px" }}
          ></TextField>
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            text="登入"
          />
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

export default SignInForm;
