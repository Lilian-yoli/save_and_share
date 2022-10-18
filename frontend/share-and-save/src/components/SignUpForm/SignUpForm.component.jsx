import { useFormik } from "formik";
import { TextField } from "@mui/material";
import Button from "../Button/Button.component";
import { string, object, ref } from "yup";
import { FormfieldWrapper } from "./SignUpForm.styles";

const SignUpForm = ({ onSubmitHandler }) => {
  const validationSchema = object({
    email: string().email("不符 Email 格式").required("請填寫信箱"),
    name: string().required("請填寫姓名"),
    password: string().trim().min(6, "至少輸入 6 碼").required("請填寫密碼"),
    passwordConfirmation: string()
      .required("必填")
      .oneOf([ref("password")], "必須與密碼相同喔"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      name: "",
      password: "",
      passwordConfirmation: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // TODO: api request;
      onSubmitHandler();
    },
  });

  return (
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
          id="name"
          name="name"
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
          id="passwordConfirmation"
          name="passwordConfirmation"
          label="確認密碼"
          type="password"
          value={formik.values.passwordConfirmation}
          onChange={formik.handleChange}
          error={
            formik.touched.passwordConfirmation &&
            Boolean(formik.errors.passwordConfirmation)
          }
          className="customized"
          helperText={
            formik.touched.passwordConfirmation &&
            formik.errors.passwordConfirmation
          }
          sx={{ marginTop: "20px;" }}
        />
        <Button type="submit" text="註冊" variant="contained" size="large" />
      </FormfieldWrapper>
    </form>
  );
};

export default SignUpForm;
