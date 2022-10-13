import SearchIcon from "@mui/icons-material/Search";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import logo from "../../assets/images/logo.png";
import {
  LogoContainer,
  NavContainer,
  NavTab,
  BrandName,
} from "./Navbar.styles";
import Avatar from "@mui/material/Avatar";

const Navbar = () => {
  return (
    <NavContainer>
      <div>
        <LogoContainer>
          <img src={logo} alt="pizza in slices" />
        </LogoContainer>
        <BrandName to="/">
          <h1>Share & Save</h1>
        </BrandName>
      </div>
      <div>
        <NavTab to="/search">
          <SearchIcon />
          <span>搜尋分購</span>
        </NavTab>
        <NavTab to="share">
          <AddReactionIcon />
          <span>一起分購吧！</span>
        </NavTab>
        <div className="avatar">
          <Avatar sx={{ bgcolor: "#6218fa" }}></Avatar>
        </div>
      </div>
    </NavContainer>
  );
};

export default Navbar;
