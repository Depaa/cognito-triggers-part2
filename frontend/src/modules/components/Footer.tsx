import { FC, ReactElement } from "react";
import { Box } from "@mui/material";

export const Footer: FC = (): ReactElement => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        backgroundColor: "primary.main",
        paddingTop: "2rem",
        paddingBottom: "2rem",
      }}
    ></Box>
  );
};

export default Footer;