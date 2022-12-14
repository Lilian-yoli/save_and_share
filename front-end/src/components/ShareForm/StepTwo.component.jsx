import { TextField } from "@mui/material";
import { object, number } from "yup";
import { useFormik } from "formik";
import Button from "../Button/Button.component";
import { FormfieldWrapper } from "../SignUpForm/SignUpForm.styles";

const StepTwo = ({ onClickHandler }) => {
  const validationSchema = object({
    denominator: number().required("必填").positive("請輸入正整數"),
    numerator: number().required("必填").positive("請輸入正整數"),
    price: number().required("必填").positive("請輸入正整數"),
  });

  const { handleChange, handleSubmit, values, errors, touched } = useFormik({
    initialValues: {
      denominator: "",
      numerator: "",
      price: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      onClickHandler();
    },
  });

  return (
    <form onSubmit={handleSubmit} className="share-form">
      <FormfieldWrapper>
        <TextField
          type="number"
          id="denominator"
          name="denominator"
          label="預計平分成幾份呢？"
          value={values.denominator}
          onChange={handleChange}
          error={touched.denominator && Boolean(errors.denominator)}
          helperText={touched.denominator && errors.denominator}
        />
        <TextField
          type="number"
          id="numerator"
          name="numerator"
          label="自己想取用的份數"
          value={values.numerator}
          onChange={handleChange}
          error={touched.numerator && Boolean(errors.numerator)}
          helperText={touched.numerator && errors.numerator}
          sx={{ marginTop: "20px" }}
        />
        <TextField
          type="number"
          id="price"
          name="price"
          label="食物價格"
          value={values.price}
          onChange={handleChange}
          error={touched.price && Boolean(errors.price)}
          helperText={touched.price && errors.price}
          sx={{ marginTop: "20px" }}
        />
      </FormfieldWrapper>
      <Button
        type="submit"
        text="下一步"
        variant="outlined"
        color="secondary"
        className="share-form-button"
      />
    </form>
  );
};

export default StepTwo;
