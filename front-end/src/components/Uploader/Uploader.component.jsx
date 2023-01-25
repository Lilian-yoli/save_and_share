import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./Uploader.styles.scss";
import { POST } from "../../utils/API";
import axios from "axios";
import { useShareStore } from "../../stores/shareStore";

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
  const saveImgURL = useShareStore((state) => state.saveImgURL);

  async function uploadToS3(e) {
    const imageFile = e.target.files[0];
    // const imageFile = new FormData();
    // imageFile.append('file', e.target.files[0]);
    const filename = e.target.files[0].name;

    const { data: { data } } = await POST('/share/upload-image-presignedURL', { filename });
    const { presignedURL } = data;

    await axios.put(presignedURL, imageFile, {
      headers: {
        "Content-Type": 'image',
      },
    });

    const { data: { data: image } } = await POST('/share/get-presignedURL', { filename });
    saveImgURL(image.presignedURL);
  };

  return (
    <ThemeProvider theme={theme}>
      <IconButton
        color={color}
        className="custom-uploader"
        aria-label="upload picture"
        component="label"
      >
        <input onChange={uploadToS3} hidden accept="image/*" type="file" name="file" />
        <PhotoCamera />
        <p>上傳照片</p>
      </IconButton>
    </ThemeProvider>
  );
};

export default Uploader;
