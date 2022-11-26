import { fabClasses } from "@mui/material";
import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory, Link } from "react-router-dom";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const [isLoading,setIsLoading] = useState(false);

  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async (formData) => {
    // call api

    const url = config.endpoint + "/auth/register";
    // console.log(url);

    try {
      setIsLoading(true);
      const response = await axios.post(url, {
        username: formData.username,
        password: formData.password,
      });
      setIsLoading(false);
      console.log(response);
      if (response.status === 201) {
        enqueueSnackbar("Registered successfully", { variant: "success" });
        history.push("/login", { from: "Register page" });
      } else if (response.status === 400) {
        enqueueSnackbar(response.statusText, { variant: "error" });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          enqueueSnackbar(error.response.data.message, { variant: "error" });
        } else {
          enqueueSnackbar(
            "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
            { variant: "error" }
          );
        }
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    // console.log(data);
    if(data.username===""){
      enqueueSnackbar("Username is a required field",{variant:'error'})
      return false;
    }

    if(data.username.length<6){
      enqueueSnackbar("Username must be at least 6 characters",{variant:'error'})
      return false;
    }

    if(data.password===""){
      enqueueSnackbar("Password is a required field",{variant:'error'})
      return false;
    }

    if(data.password.length<6){
      enqueueSnackbar("Password must be at least 6 characters",{variant:'error'})
      return false;
    }

    if(data.password !== data.confirmPassword){
      enqueueSnackbar("Passwords do not match",{variant:'error'})
      return false;
    }

    return true;
  };

  const handleRegisterClick = async (e) => {


    if(validateInput(userInfo)){
      register(userInfo)
    }
  };

  const handleInputTxtChange = (e) => {
    const value = e.target.value;
    setUserInfo({
      ...userInfo,
      [e.target.name]: value,
    });
    // console.log(value);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons={'register'} />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            onChange={handleInputTxtChange}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            onChange={handleInputTxtChange}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            onChange={handleInputTxtChange}
          />
          {isLoading?<CircularProgress />: <Button
            className="button"
            variant="contained"
            onClick={handleRegisterClick}
          >
            Register Now
          </Button>}
          
          <p className="secondary-action">
            Already have an account?{" "}
            <Link to="/login" className="link">Login here</Link>
            {/* <a className="link" href="/login">
              Login here
            </a> */}
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
