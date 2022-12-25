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
import { useShareStore } from "../../stores/shareStore";

const foodCategories = ["生鮮魚肉", "蔬菜", "水果", "零食", "飲品", "其他"];

const StepOne = ({ next }) => {

  const foodInfo = useShareStore((state) => state.foodInfo)
  const saveFoodInfo = useShareStore((state) => state.saveFoodInfo)


  const validationSchema = object({
    category: string().required("必填"),
    name: string().required("必填"),
    expiry_date: string().required("必填"),
  });

  const { handleChange, handleSubmit, setFieldValue, values, errors, touched } =
    useFormik({
      initialValues: {
        category: foodInfo.category,
        name: foodInfo.name,
        food_description: foodInfo.food_description,
        expiry_date: foodInfo.expiry_date,
      },
      validationSchema: validationSchema,
      onSubmit: (values) => {
        let { expiry_date } = values;
        expiry_date = dayjs(expiry_date).format("YYYY-MM-DD");
        values.expiry_date = expiry_date
        saveFoodInfo(values)

        next();
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
          id="name"
          name="name"
          label="食物名稱"
          value={values.name}
          onChange={handleChange}
          error={touched.name && Boolean(errors.name)}
          helperText={touched.name && errors.name}
          sx={{ marginTop: "20px" }}
        />
        <TextField
          multiline
          rows={4}
          id="food_description"
          name="food_description"
          label="食物描述 (非必填)"
          value={values.food_description}
          onChange={handleChange}
          error={touched.food_description && Boolean(errors.food_description)}
          helperText={touched.food_description && errors.food_description}
          sx={{ marginTop: "20px" }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            onChange={(value) => {
              setFieldValue("expiry_date", Date.parse(value));
            }}
            inputFormat="YYYY/MM/DD"
            value={values.expiry_date}
            label="食物有限期限"
            renderInput={(params) => (
              <TextField
                id="expiry_date"
                name="expiry_date"
                {...params}
                error={touched.expiry_date && Boolean(errors.expiry_date)}
                helperText={touched.expiry_date && errors.expiry_date}
                sx={{ marginTop: "20px" }}
              />
            )}
          />
        </LocalizationProvider>
        <Uploader color="primary" />
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
