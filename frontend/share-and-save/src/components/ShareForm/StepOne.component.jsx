import { TextField, MenuItem } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useFormik } from "formik";
import { object, string } from "yup";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Button from "../Button/Button.component";
import Uploader from "../Uploader/Uploader.component";
import { FormfieldWrapper } from "../SignUpForm/SignUpForm.styles";
import "./ShareForm.styles.scss";
import dayjs from "dayjs";

const foodCategories = ["生鮮魚肉", "蔬菜", "水果", "零食", "飲品", "其他"];

const StepOne = ({ onClickHandler }) => {
  const validationSchema = object({
    category: string().required("必填"),
    foodName: string().required("必填"),
    expiryDate: string().required("必填"),
  });

  const { handleChange, handleSubmit, setFieldValue, values, errors, touched } =
    useFormik({
      initialValues: {
        category: "",
        foodName: "",
        description: "",
        expiryDate: Date.now(),
      },
      validationSchema: validationSchema,
      onSubmit: (values) => {
        let { expiryDate } = values;
        expiryDate = dayjs(expiryDate).format("YYYY-MM-DD");
        // TODO: post request
        onClickHandler();
      },
    });

  return (
    <form onSubmit={handleSubmit} className="share-form">
      <FormfieldWrapper>
        <TextField
          select
          id="category"
          name="category"
          label="食物類別"
          value={values.category}
          onChange={handleChange}
          error={touched.category && Boolean(errors.category)}
          helperText={touched.category && errors.category}
        >
          {foodCategories.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="foodName"
          name="foodName"
          label="食物名稱"
          value={values.foodName}
          onChange={handleChange}
          error={touched.foodName && Boolean(errors.foodName)}
          helperText={touched.foodName && errors.foodName}
          sx={{ marginTop: "20px" }}
        />
        <TextField
          multiline
          rows={4}
          id="description"
          name="description"
          label="食物描述 (非必填)"
          value={values.description}
          onChange={handleChange}
          error={touched.description && Boolean(errors.description)}
          helperText={touched.description && errors.description}
          sx={{ marginTop: "20px" }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            onChange={(value) => {
              setFieldValue("expiryDate", Date.parse(value));
            }}
            inputFormat="MM/DD/YYYY"
            value={values.expiryDate}
            label="食物有限期限"
            renderInput={(params) => (
              <TextField
                id="expiryDate"
                name="expiryDate"
                {...params}
                error={touched.expiryDate && Boolean(errors.expiryDate)}
                helperText={touched.expiryDate && errors.expiryDate}
                sx={{ marginTop: "20px" }}
              />
            )}
          />
          <Uploader color="primary" />
        </LocalizationProvider>
      </FormfieldWrapper>
      <Button
        text="下一步"
        type="submit"
        variant="outlined"
        color="secondary"
        className="share-form-button"
      />
    </form>
  );
};

export default StepOne;
