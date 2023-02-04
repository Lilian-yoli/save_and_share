import { TextField } from "@mui/material";
import { object, number, string, ref } from "yup";
import { useFormik } from "formik";
import Button from "../Button/Button.component";
import { FormfieldWrapper } from "../SignUpForm/SignUpForm.styles";
import { useShareStore } from "../../stores/shareStore";

const StepTwo = ({ next, previous }) => {
  const shareInfo = useShareStore((state) => state.shareInfo);
  const saveShareInfo = useShareStore((state) => state.saveShareInfo)

  const validationSchema = object({
    unit_description: string().required("必填"),
    total_portions: number().required("必填").positive("請輸入正整數"),
    own_portions: number().required("必填").integer("請輸入整數").lessThan(ref("total_portions"), '取用數量須小於總數量'),
    price: number().required("必填").positive("請輸入正整數"),
  });

  const { handleChange, handleSubmit, values, errors, touched } = useFormik({
    initialValues: {
      unit_description: shareInfo.unit_description,
      total_portions: shareInfo.total_portions,
      own_portions: shareInfo.own_portions,
      price: shareInfo.price,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      saveShareInfo(values)
      next();
    },
  });

  return (
    <form onSubmit={handleSubmit} className="share-form">
      <FormfieldWrapper>
        <TextField
          id="unit_description"
          name="unit_description"
          label="單位"
          value={values.unit_description}
          onChange={handleChange}
          error={touched.unit_description && Boolean(errors.unit_description)}
          helperText={touched.unit_description && errors.unit_description}
        />
        <TextField
          type="number"
          id="total_portions"
          name="total_portions"
          label="總份數"
          value={values.total_portions}
          onChange={handleChange}
          error={touched.total_portions && Boolean(errors.total_portions)}
          helperText={touched.total_portions && errors.total_portions}
          sx={{ marginTop: "20px" }}
        />
        <TextField
          type="number"
          id="own_portions"
          name="own_portions"
          label="自己想取用的份數"
          value={values.own_portions}
          onChange={handleChange}
          error={touched.own_portions && Boolean(errors.own_portions)}
          helperText={touched.own_portions && errors.own_portions}
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
      <div className="share-form-buttons">
        <Button
          onClickHandler={previous}
          type="button"
          text="上一步"
          variant="outlined"
          color="secondary"
        />
        <Button
          type="submit"
          text="下一步"
          variant="outlined"
          color="secondary"
        />
      </div>
    </form>
  );
};

export default StepTwo;
