import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./Uploader.styles.scss";
import { POST } from "../../utils/API";
import axios from "axios";
import { useShareStore } from "../../stores/shareStore";
import { useState } from "react";
import { useEffect } from "react";

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
  const saveImg = useShareStore((state) => state.saveImg);
  const existedImg = useShareStore(state => state.image);
  const [imgURL, setImgUrl] = useState('');

  useEffect(() => {
    if (!existedImg) return;
    getImgFromS3(existedImg);

    async function getImgFromS3(filename) {
      const { data: { data: image } } = await POST('/share/get-presignedURL', { filename });
      setImgUrl(image.presignedURL);
    }
  }, [existedImg])

  async function uploadToS3(e) {
    const imageFile = e.target.files[0];
    const filename = e.target.files[0].name;

    // get s3 presigned url
    const { data: { data } } = await POST('/share/upload-image-presignedURL', { filename });
    const { presignedURL } = data;

    // put request to upload image to s3 bucket
    await axios.put(presignedURL, imageFile, {
      headers: {
        "Content-Type": 'image',
      },
    });

    // get filename and presigned url for rendering and saving filename to DB
    const { data: { data: image } } = await POST('/share/get-presignedURL', { filename });
    saveImg(image.filename);
    setImgUrl(image.presignedURL);
  };

  return (
    <>
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

      {imgURL &&
        <div className="img-frame">
          <img src={imgURL} alt="the uploaded" />
        </div>}
    </>
  );
};

export default Uploader;
