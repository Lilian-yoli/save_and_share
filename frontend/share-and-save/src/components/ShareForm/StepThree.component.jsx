import { TextField, MenuItem } from "@mui/material";
import { string, object } from "yup";
import { useFormik } from "formik";
import { FormfieldWrapper } from "../SignUpForm/SignUpForm.styles";
import Button from "../Button/Button.component";
import "./ShareForm.styles.scss";
import CountyDistrictList from "../../assets/data/CountyDistrictData.json";
import { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const StepThree = ({ onClickHandler }) => {
  const [districtList, setDistrictList] = useState([]);

  const validationSchema = object({
    county: string().required("必填"),
    district: string().required("必填"),
    address: string().required("必填"),
    meetUpDate: string().nullable("必填").required("必填"),
    meetUpTime: string().nullable("必填").required("必填"),
  });

  const { handleChange, handleSubmit, setFieldValue, values, touched, errors } =
    useFormik({
      initialValues: {
        county: "",
        district: "",
        address: "",
        meetUpDate: Date.now(),
        meetUpTime: Date.now(),
      },
      validationSchema: validationSchema,
      onSubmit: (values) => {
        let { meetUpDate, meetUpTime } = values;
        meetUpDate = dayjs(meetUpDate).format("YYYY-MM-DD");
        meetUpTime = dayjs(meetUpTime).format("hh:mm");

        onClickHandler();
      },
    });

  useEffect(() => {
    if (!values.county) return;

    setFieldValue("district", "");

    const newDistrictList = CountyDistrictList.filter(
      (county) => county.CityName === values.county
    )[0]["AreaList"];
    setDistrictList(newDistrictList);
  }, [values.county, setFieldValue]);

  return (
    <form onSubmit={handleSubmit} className="share-form">
      <FormfieldWrapper>
        <p className="share-form-subtitle">面交地點</p>
        <TextField
          select
          id="county"
          name="county"
          label="縣市"
          value={values.county}
          onChange={handleChange}
          error={touched.county && Boolean(errors.county)}
          helperText={touched.county && errors.county}
          sx={{ marginTop: "10px" }}
        >
          {CountyDistrictList.map((county, index) => (
            <MenuItem key={index} value={county["CityName"]}>
              {county["CityName"]}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          id="district"
          name="district"
          label="區域"
          value={values.district}
          onChange={handleChange}
          error={touched.district && Boolean(errors.district)}
          helperText={touched.district && errors.district}
          sx={{ marginTop: "20px" }}
        >
          {districtList.map((county, index) => (
            <MenuItem key={index} value={county["AreaName"]}>
              {county["AreaName"]}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="address"
          name="address"
          label="地址"
          value={values.address}
          onChange={handleChange}
          error={touched.address && Boolean(errors.address)}
          helperText={touched.address && errors.address}
          sx={{ marginTop: "20px" }}
        />
        <p className="share-form-subtitle" style={{ marginTop: "25px" }}>
          面交時間
        </p>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            onChange={(value) => {
              setFieldValue("meetUpDate", Date.parse(value));
            }}
            inputFormat="YYYY/MM/DD"
            value={values.meetUpDate}
            label="面交日期"
            renderInput={(params) => (
              <TextField
                id="meetUpDate"
                name="meetUpDate"
                {...params}
                error={touched.meetUpDate && Boolean(errors.meetUpDate)}
                helperText={touched.meetUpDate && errors.meetUpDate}
                sx={{ marginTop: "10px" }}
              />
            )}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label="面交時間"
            value={values.meetUpTime}
            onChange={(value) => {
              setFieldValue("meetUpTime", value);
            }}
            inputProps={{ placeholder: "hh:mm" }}
            renderInput={(params) => (
              <TextField
                id="meetUpTime"
                name="meetUpTime"
                error={touched.meetUpTime && Boolean(errors.meetUpTime)}
                helperText={touched.meetUpTime && errors.meetUpTime}
                sx={{ marginTop: "20px" }}
                {...params}
              />
            )}
          />
        </LocalizationProvider>
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

export default StepThree;
