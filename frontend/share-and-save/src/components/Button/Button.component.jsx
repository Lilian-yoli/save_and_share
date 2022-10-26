import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6218fa",
    },
    secondary: {
      main: "#3cae9f",
      contrastText: "#fff",
    },
    danger: {
      main: "#d32f2f",
      contrastText: "#fff",
    },
  },
});

const SSButton = ({
  type,
  loading,
  text,
  variant,
  color,
  size,
  onClickHandler,
  className,
}) => {
  return loading ? (
    <ThemeProvider theme={theme}>
      <LoadingButton
        type={type}
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
        type={type}
        onClick={onClickHandler}
        variant={variant}
        color={color}
        size={size}
        className={className}
      >
        {text}
      </Button>
    </ThemeProvider>
  );
};

export default SSButton;
