import { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import { useNavigate } from "react-router-dom";

export default function FadeMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const open = Boolean(anchorEl);

  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getToPage = (destination) => {
    handleClose();
    navigate(`/${destination}`);
  };

  return (
    <div>
      <Button
        id="fade-button"
        aria-controls={open ? "fade-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        disableRipple
      >
        <Avatar sx={{ bgcolor: "#6218fa" }}></Avatar>
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {isLoggedIn ? (
          <div>
            <MenuItem onClick={handleClose} className="customized menu-item">
              你的訊息
            </MenuItem>
            <MenuItem onClick={handleClose} className="customized menu-item">
              發起的分購
            </MenuItem>
            <MenuItem onClick={handleClose} className="customized menu-item">
              加入的分購
            </MenuItem>
            <MenuItem onClick={handleClose} className="customized menu-item">
              登出
            </MenuItem>
          </div>
        ) : (
          <div>
            <MenuItem onClick={handleClose} className="customized menu-item">
              登入
            </MenuItem>
            <MenuItem
              onClick={() => getToPage("sign-up")}
              className="customized menu-item"
            >
              註冊
            </MenuItem>
          </div>
        )}
      </Menu>
    </div>
  );
}
