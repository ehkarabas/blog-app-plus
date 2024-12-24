import { Avatar, IconButton, Paper, Stack, Typography } from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const About = () => {
  return (
    <>
      <Helmet>
        <title>BlogApp - About</title>
      </Helmet>

      <Paper
        elevation={5}
        sx={{
          minWidth: "270px",
          width: "50%",
          maxWidth: "768px",
          m: "10px auto !important",
          p: 5,
          minHeight: "300px",
          height: "70vh",
          maxHeight: "768px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <Avatar
            src="/images/ehlogo-transparent.png"
            alt="brand logo"
            sx={{ width: 50, height: 50 }}
          />

          <Typography variant="h2">
            Cool<span className="text-info">Dev</span>
          </Typography>

          <Typography>Developer in progress...</Typography>

          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <IconButton>
              <Link to="https://linkedin.com" target="_blank">
                <LinkedInIcon
                  sx={{
                    color: "black",
                    "&:hover": { color: "blue" },
                    fontSize: 35,
                  }}
                />
              </Link>
            </IconButton>

            <IconButton>
              <Link to="https://twitter.com" target="_blank">
                <TwitterIcon
                  sx={{
                    color: "black",
                    "&:hover": { color: "blue" },
                    fontSize: 35,
                  }}
                />
              </Link>
            </IconButton>

            <IconButton>
              <Link to="https://instagram.com" target="_blank">
                <InstagramIcon
                  sx={{
                    color: "black",
                    "&:hover": { color: "red" },
                    fontSize: 35,
                  }}
                />
              </Link>
            </IconButton>

            <IconButton>
              <Link to="https://youtube.com" target="_blank">
                <YouTubeIcon
                  sx={{
                    color: "black",
                    "&:hover": { color: "red" },
                    fontSize: 35,
                  }}
                />
              </Link>
            </IconButton>
          </Stack>
        </Stack>
      </Paper>
    </>
  );
};

export default About;
