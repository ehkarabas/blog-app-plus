import { Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}
      color="#fff"
      p={2}
      bgcolor={theme.palette.primary.main}
      component="footer"
      className="dark:bg-blue-900 dark:text-white"
    >
      {/* İçteki Row Stack */}
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Typography>
          Cool<span style={{ color: "aqua", fontWeight: "bold" }}>Dev</span>
        </Typography>
        <Typography>&copy; {currentYear}</Typography>
      </Stack>

      {/* Mesaj Typography */}
      <Typography
        variant="caption"
        sx={{
          display: "block",
          fontStyle: "italic",
          textAlign: "center",
          marginTop: 1,
          fontSize: "0.75rem",
        }}
      >
        If your first action after your initial visit seems unresponsive, please
        wait a moment for the services to activate automatically.
      </Typography>
    </Stack>
  );
};

export default Footer;
