import Typography from "@mui/material/Typography";
import AccountCircle from "@mui/icons-material/AccountCircle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { useSelector } from "react-redux";
import { Box, Button, Paper, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MyBlogsBlogCard = ({ userBlog, isSingle }) => {
  const { isDark } = useSelector((state) => state.theme);
  const currentUser = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const userBlogStyles = {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: isSingle ? "inherit" : "-webkit-box",
    WebkitLineClamp: isSingle ? "none" : "2",
    WebkitBoxOrient: isSingle ? "inherit" : "vertical",
    m: 2,
  };

  const userBlogTitleStyle = {
    textAlign: "center",
    color: isDark ? "red" : "green",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: isSingle ? "inherit" : "-webkit-box",
    WebkitLineClamp: isSingle ? "none" : "1",
    WebkitBoxOrient: isSingle ? "inherit" : "vertical",
    p: 0.7,
  };

  return (
    <Paper
      sx={{
        minWidth: "270px",
        width: isSingle ? "50%" : "auto",
        maxWidth: isSingle ? "768px" : "350px",
        m: isSingle ? "10px auto !important" : "10px !important",
        height: isSingle ? "auto" : "500px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "flex-start",
      }}
      elevation={isSingle ? 0 : 10}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        mt={2}
        sx={{
          width: "100%",
          order: 0,
        }}
      >
        <img
          src={
            userBlog?.image ||
            "https://thumbs.dreamstime.com/b/no-image-icon-vector-available-picture-symbol-isolated-white-background-suitable-user-interface-element-205805243.jpg"
          }
          alt="img"
          className="h-48 object-cover object-center"
          onError={(e) => {
            e.currentTarget.src =
              "https://thumbs.dreamstime.com/b/no-image-icon-vector-available-picture-symbol-isolated-white-background-suitable-user-interface-element-205805243.jpg";
          }}
        />
      </Stack>
      <Box sx={{ m: 0, mt: 1, width: "100%" }}>
        <Typography gutterBottom variant="h5" sx={userBlogTitleStyle}>
          {userBlog?.title?.toUpperCase()}
        </Typography>
        <Typography sx={userBlogStyles}>
          {userBlog?.content ?? "No Content"}
        </Typography>
      </Box>

      <Stack>
        <Typography sx={{ textAlign: "left", m: 2, mb: 0, fontSize: "0.7rem" }}>
          {userBlog?.updated_publish_date
            ? new Date(
                new Date(userBlog.publish_date).getTime() - 3 * 60 * 60 * 1000
              ).toLocaleString("en-US") +
              " , edited at " +
              new Date(
                new Date(userBlog?.updated_publish_date).getTime() -
                  3 * 60 * 60 * 1000
              ).toLocaleString("en-US")
            : userBlog?.publish_date
            ? new Date(
                new Date(userBlog.publish_date).getTime() - 3 * 60 * 60 * 1000
              ).toLocaleString("en-US")
            : "Not Published"}
        </Typography>
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            textAlign: "left",
            m: 2,
            my: 1,
            color: "black",
          }}
        >
          <AccountCircle />
          <span>{userBlog?.author ?? "No author"}</span>
        </Stack>
      </Stack>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ p: 2, pt: 0, width: "100%", order: 3 }}
      >
        <Box>
          <IconButton
            aria-label="add to favorites"
            sx={{
              textAlign: "left",
              alignItems: "left",
              "&:hover": {
                cursor: "auto",
              },
            }}
            onClick={(e) => {
              e.preventDefault();
            }}
            disabled
          >
            <FavoriteIcon
              sx={{
                color: `${
                  userBlog?.likes_n?.filter(
                    (like) => like.userId === currentUser?.id
                  ).length > 0
                    ? "red"
                    : "gray"
                }`,
              }}
            />
            <span>{userBlog?.likes ?? "0"}</span>
          </IconButton>

          <IconButton
            aria-label="add comment"
            sx={{
              textAlign: "left",
              alignItems: "left",
              "&:hover": {
                cursor: "auto",
              },
            }}
            onClick={(e) => {
              e.preventDefault();
            }}
            disableRipple={true}
            disabled
          >
            <ChatBubbleOutlineOutlinedIcon />
            <span>{userBlog?.comment_count ?? "0"}</span>
          </IconButton>

          <IconButton
            aria-label="view"
            onClick={(e) => {
              e.preventDefault();
            }}
            sx={{
              textAlign: "left",
              alignItems: "left",
              "&:hover": {
                cursor: "auto",
              },
            }}
            disableRipple={true}
            disabled
          >
            <RemoveRedEyeOutlinedIcon />
            <span>{userBlog?.post_views}</span>
          </IconButton>
        </Box>

        <Button
          variant="contained"
          color="info"
          onClick={(e) => {
            navigate(`/detail/${userBlog?._id}/`);
          }}
        >
          ACCESS
        </Button>
      </Stack>
    </Paper>
  );
};

export default MyBlogsBlogCard;
