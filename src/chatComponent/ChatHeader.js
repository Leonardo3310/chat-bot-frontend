import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

function ChatHeader() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Financhat
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default ChatHeader;