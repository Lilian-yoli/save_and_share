import { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";

export default function FadeMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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
          <>
            <MenuItem onClick={handleClose} className="customized menu-item">
              你的訊息
            </MenuItem>
            <MenuItem
              onClick={handleClose}
              className="customized menu-item"
            ></MenuItem>
            <MenuItem
              onClick={handleClose}
              className="customized menu-item"
            ></MenuItem>
            <MenuItem
              onClick={handleClose}
              className="customized menu-item"
            ></MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={handleClose} className="customized menu-item">
              登入
            </MenuItem>
            <MenuItem onClick={handleClose} className="customized menu-item">
              註冊
            </MenuItem>
          </>
        )}
      </Menu>
    </div>
  );
}
