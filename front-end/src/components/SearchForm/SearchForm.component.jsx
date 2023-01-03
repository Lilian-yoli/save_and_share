import { TextField, MenuItem } from "@mui/material";
import { useFormik } from "formik";
import { object, string } from "yup";
import Button from "../Button/Button.component";
import { FormfieldWrapper } from "./SearchForm.styles";
import CountyDistrictList from "../../assets/data/CountyDistrictData.json";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { POST } from "../../utils/API";
import { useSearchStore } from "../../stores/searchStore";

const foodCategories = ["生鮮魚肉", "蔬菜", "水果", "零食", "飲品", "其他"];

const SearchForm = ({ variant }) => {
  const [districtList, setDistrictList] = useState([]);
  const navigate = useNavigate();

  const setResult = useSearchStore((state) => state.setSearchResult);
  const setParams = useSearchStore((state) => state.setSearchParams);
  const searchParams = useSearchStore((state) => state.searchParams);

  const validationSchema = object({
    category: string().required("請選擇食物類別"),
    name: string().required("請輸入食物名稱"),
    county: string().required("請選擇縣市"),
    district: string().required("請選擇區域"),
  });

  const { values, handleChange, handleSubmit, touched, errors, setFieldValue } =
    useFormik({
      initialValues: {
        category: searchParams.category,
        name: searchParams.name,
        county: searchParams.county,
        district: searchParams.district,
      },
      validationSchema: validationSchema,
      onSubmit: async (values) => {
        try {
          setParams(values);
          const { data: { data } } = await POST('share/share-search', values);
          setResult(data);
          navigate("/search");
        } catch (error) {
          console.error(error);
        }
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
    <form onSubmit={handleSubmit}>
      <FormfieldWrapper variant={variant}>
        <TextField
          select
          id="category"
          name="category"
          label="食物類別"
          value={values.category}
          onChange={handleChange}
          error={touched.category && Boolean(errors.category)}
          helperText={touched.category && errors.category}
          className="customized"
          color="secondary"
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
          type="name"
          value={values.name}
          onChange={handleChange}
          error={touched.name && Boolean(errors.name)}
          helperText={touched.name && errors.name}
          className="customized"
          color="secondary"
        />
        <TextField
          select
          id="county"
          name="county"
          label="縣市"
          value={values.county}
          onChange={handleChange}
          error={touched.county && Boolean(errors.county)}
          helperText={touched.county && errors.county}
          className="customized"
          color="secondary"
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
          className="customized"
          color="secondary"
        >
          {districtList.map((county, index) => (
            <MenuItem key={index} value={county["AreaName"]}>
              {county["AreaName"]}
            </MenuItem>
          ))}
        </TextField>
        <Button type="submit" variant="contained" text="搜尋" size="large" />
      </FormfieldWrapper>
    </form>
  );
};

export default SearchForm;
