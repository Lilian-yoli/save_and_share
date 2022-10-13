import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6218fa",
    },
    danger: {
      main: "#d32f2f",
      contrastText: "#fff",
    },
  },
});

const SSButton = ({ loading, text, variant, color, size, onClickHandler }) => {
  return loading ? (
    <ThemeProvider theme={theme}>
      <LoadingButton
        onClick={onClickHandler}
        variant={variant}
        color={color}
        loading
        loadingPosition="start"
        startIcon={<SaveIcon />}
      >
        {text}
      </LoadingButton>
    </ThemeProvider>
  ) : (
    <ThemeProvider theme={theme}>
      <Button
        onClick={onClickHandler}
        variant={variant}
        color={color}
        size={size}
      >
        {text}
      </Button>
    </ThemeProvider>
  );
};

export default SSButton;
