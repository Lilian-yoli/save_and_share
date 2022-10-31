import { TextField } from "@mui/material";
import { useFormik } from "formik";
import { object, string } from "yup";
import Button from "../Button/Button.component";
import { FormfieldWrapper } from "../SignUpForm/SignUpForm.styles";

const SignInForm = () => {
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
    onSubmit: (values) => {
      console.log(values);
      // TODO: post request
    },
  });

  return (
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
  );
};

export default SignInForm;
