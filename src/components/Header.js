import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { useHistory, Link } from "react-router-dom";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const username = localStorage.getItem("username");
  const history = useHistory();
  // console.log(children)

  const logOutBtn=()=>{
    localStorage.clear(); 
    history.push("/", { from: "Logout page" });
  }


  if (hasHiddenAuthButtons === "login" || hasHiddenAuthButtons === "register") {
    return (
      <Box className="header">
        <Box className="header-title">
          <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        <Link to="/" className="link">
          <Button
            className="explore-button"
            startIcon={<ArrowBackIcon />}
            variant="text"
          >
            Back to explore
          </Button>
        </Link>
      </Box>
    );
  }

  if (hasHiddenAuthButtons === "prodPage" && username !== null) {
    return (
      <Box className="header">
        <Box className="header-title">
          <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        {/* <Link to="/products" className="link"> */}        
        
        <Box>          
          <img src="avatar.png" alt={username} width="15%" />   
          <label>{username}</label>
          <Button className="secondary-action" variant="text" onClick={logOutBtn}>
            Logout
          </Button>
          
        </Box>
      </Box>
    );
  }else if(hasHiddenAuthButtons === "prodPage" && username === null){
    return (
      <Box className="header">
        <Box className="header-title">
          <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        <Box>
          <Link to="/login" className="link">      
            <Button className="secondary-action" variant="text">
              Login
            </Button>
          </Link>
          <Link to="/register" className="link">      
            <Button className="button" variant="contained">
              Register
            </Button>
          </Link>
        </Box>
      </Box>
    );
  }
};

export default Header;
