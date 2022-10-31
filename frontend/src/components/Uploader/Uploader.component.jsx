import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./Uploader.styles.scss";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6218fa",
    },
    secondary: {
      main: "#3cae9f",
      contrastText: "#fff",
    },
  },
});

const Uploader = ({ color }) => {
  return (
    <ThemeProvider theme={theme}>
      <IconButton
        color={color}
        className="custom-uploader"
        aria-label="upload picture"
        component="label"
      >
        <input hidden accept="image/*" type="file" />
        <PhotoCamera />
        <p>上傳照片</p>
      </IconButton>
    </ThemeProvider>
  );
};

export default Uploader;
