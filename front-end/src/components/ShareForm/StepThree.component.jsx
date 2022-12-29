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
import utc from "dayjs/plugin/utc";
import { useShareStore } from "../../stores/shareStore";
import { POST } from "../../utils/API";

dayjs.extend(utc)

const StepThree = ({ next, previous }) => {
  const [districtList, setDistrictList] = useState([]);

  const meetUpInfo = useShareStore((state) => state.meetUpInfo);
  const saveMeetUpInfo = useShareStore((state) => state.saveMeetUpInfo);

  const validationSchema = object({
    county: string().required("必填"),
    district: string().required("必填"),
    address: string().required("必填"),
    meet_up_date: string().nullable("必填").required("必填"),
    meet_up_time: string().nullable("必填").required("必填"),
  });

  const { handleChange, handleSubmit, setFieldValue, values, touched, errors } =
    useFormik({
      initialValues: {
        county: meetUpInfo.county,
        district: meetUpInfo.district,
        address: meetUpInfo.address,
        meet_up_date: meetUpInfo.meet_up_date,
        meet_up_time: meetUpInfo.meet_up_time,
      },
      validationSchema: validationSchema,
      onSubmit: async (values) => {

        // ref. https://developers.google.com/maps/documentation/geocoding/requests-geocoding
        // use geocoding api to convert address to longitude & latitude
        const { data: { results } } = await POST(`https://maps.googleapis.com/maps/api/geocode/json?address=台灣${values.county}${values.district}${values.address}&key=${process.env.REACT_APP_GOOGLE_MAP}`);
        const location = results[0].geometry.location;
        values.location = location;

        let { meet_up_date, meet_up_time } = values;
        meet_up_date = dayjs(meet_up_date).format('YYYY-MM-DD');
        const formattedMeetUpTime = dayjs(meet_up_time).format('HH:mm:ss');
        const meet_up_datetime = dayjs(`${meet_up_date} ${formattedMeetUpTime}`).utc(true).format();
        values.meet_up_date = meet_up_date;
        values.meet_up_time = meet_up_time
        saveMeetUpInfo({ ...values, meet_up_datetime });
        next();
      },
    });


  useEffect(() => {
    if (!values.county) return;

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
              setFieldValue("meet_up_date", Date.parse(value));
            }}
            inputFormat="YYYY/MM/DD"
            value={values.meet_up_date}
            label="面交日期"
            renderInput={(params) => (
              <TextField
                id="meet_up_date"
                name="meet_up_date"
                {...params}
                error={touched.meet_up_date && Boolean(errors.meet_up_date)}
                helperText={touched.meet_up_date && errors.meet_up_date}
                sx={{ marginTop: "10px" }}
              />
            )}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label="面交時間"
            value={values.meet_up_time}
            onChange={(value) => {
              setFieldValue("meet_up_time", value);
            }}
            inputProps={{ placeholder: "hh:mm" }}
            renderInput={(params) => (
              <TextField
                id="meet_up_time"
                name="meet_up_time"
                error={touched.meet_up_time && Boolean(errors.meet_up_time)}
                helperText={touched.meet_up_time && errors.meet_up_time}
                sx={{ marginTop: "20px" }}
                {...params}
              />
            )}
          />
        </LocalizationProvider>
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

export default StepThree;
