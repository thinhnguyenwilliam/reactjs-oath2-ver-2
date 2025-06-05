import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { setToken } from "../services/localStorageService";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function Authenticate() {
  //console.log('Url google callback', window.location.href);
  const navigate = useNavigate();
  const [isLoggedin, setIsLoggedin] = useState(false);

  useEffect(() => {
    const accessTokenRegex = /code=([^&]+)/;
    //console.log(`accessTokenRegex is: ${accessTokenRegex}`)
    const isMatch = accessTokenRegex.exec(window.location.href);
    //console.log(`isMatch is: ${isMatch}`)

    if (isMatch) {
      const code = isMatch[1];

      fetch(`http://localhost:8081/identity/api/auth/outbound/authentication?code=${code}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to authenticate");
          return res.json();
        })
        .then((data) => {
          console.log("Received token:", data.result.token);
          setToken(data.result.token);
          setIsLoggedin(true);
        })
        .catch((err) => {
          console.error("Authentication error:", err);
        });
    }

  }, []);


  useEffect(() => {
    if (isLoggedin) {
      navigate("/");
    }
  }, [isLoggedin, navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress></CircularProgress>
      <Typography>Authenticating...</Typography>
    </Box>
  );
}
