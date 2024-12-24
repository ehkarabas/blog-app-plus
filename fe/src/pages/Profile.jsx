import { Avatar, Paper, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";

const Profile = () => {
  const currentUser = useSelector((state) => state.auth);
  return (
    <>
      <Helmet>
        <title>BlogApp - User Profile</title>
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
            src={currentUser?.image}
            alt="brand logo"
            sx={{ width: 50, height: 50 }}
          />

          <Typography variant="h2">
            {currentUser?.firstName} {currentUser?.lastName}
          </Typography>

          <Typography>{currentUser?.email}</Typography>

          <Typography sx={{ fontStyle: "italic" }}>
            {currentUser?.bio || "Bio not found"}
          </Typography>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          ></Stack>
        </Stack>
      </Paper>
    </>
  );
};

export default Profile;
