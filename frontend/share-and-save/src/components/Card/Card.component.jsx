import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { CardContainer } from "./Card.styles";

const Card = ({ text }) => {
  return (
    <CardContainer>
      <ErrorOutlineIcon
        fontSize="large"
        style={{ verticalAlign: "middle", color: "#F02D21" }}
      />
      <p>{text}</p>
    </CardContainer>
  );
};

export default Card;
