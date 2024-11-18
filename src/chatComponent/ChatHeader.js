import { AppBar, Toolbar, Typography } from "@mui/material";
import React from "react";

function ChatHeader() {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#282c34" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          FINANCHAT
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default ChatHeader;