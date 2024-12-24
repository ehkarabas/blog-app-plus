import React, { useEffect, useCallback } from "react";
import Typography from "@mui/material/Typography";
import AccountCircle from "@mui/icons-material/AccountCircle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { useNavigate } from "react-router-dom";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { useSelector } from "react-redux";
import { Box, Button, Paper, Stack } from "@mui/material";
import useBlogCall from "../../hooks/useBlogCall";
import { toastWarnNotify } from "../../helper/ToastNotify";

const BlogCard = React.memo(({ blog }) => {
  const { isDark } = useSelector((state) => state.theme);
  const { currentUser, id: currentUserID } = useSelector((state) => state.auth);
  const { likeCreate, commentsToggler } = useBlogCall();
  const navigate = useNavigate();

  // uncomment to understand react memo and redux useSelector state change effect
  // useEffect(() => {
  //   console.log(`BlogCard mount edildi: ${blog._id}`);
  //   return () => {
  //     console.log(`BlogCard unmount edildi: ${blog._id}`);
  //   };
  // }, [blog.likes]);

  // console.log("BLOGCARD RERENDER", `${blog._id}`);

  const listStyles = {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
    m: 2,
  };

  const titleStyle = {
    textAlign: "center",
    color: isDark ? "red" : "green",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: "1",
    WebkitBoxOrient: "vertical",
    p: 0.7,
  };

  // const handleLikeAndDirect = (e) => {
  //   console.log(
  //     "🔭 ~ handleLikeAndDirect ~ e.currentTarget ➡ ➡ ",
  //     e.currentTarget
  //   );
  //   const blogId = e.currentTarget.getAttribute("data-blog-id");
  //   if (e.currentTarget.getAttribute("data-action") === "like") {
  //     if (currentUser) {
  //       likeCreate(blogId, { userId: currentUserID, blogId });
  //     } else {
  //       toastWarnNotify(
  //         "You must login first to send a like/comment or access whole blog."
  //       );
  //     }
  //   } else if (e.currentTarget.getAttribute("data-action") === "comment") {
  //     if (currentUser) {
  //       commentsToggler(true);
  //       navigate(`/detail/${blogId}/`);
  //     } else {
  //       toastWarnNotify(
  //         "You must login first to send a like/comment or access whole blog."
  //       );
  //     }
  //   } else {
  //     commentsToggler(false);
  //     navigate(`/detail/${blogId}/`);
  //   }
  // };

  const handleLikeAndDirect = useCallback(
    (e) => {
      const blogId = e.currentTarget.getAttribute("data-blog-id");
      const action = e.currentTarget.getAttribute("data-action");

      if (action === "like") {
        if (currentUser) {
          likeCreate(blogId, { userId: currentUserID, blogId });
        } else {
          toastWarnNotify(
            "You must login first to send a like/comment or access whole blog."
          );
        }
      } else if (action === "comment") {
        if (currentUser) {
          commentsToggler(true);
          navigate(`/detail/${blogId}/`);
        } else {
          toastWarnNotify(
            "You must login first to send a like/comment or access whole blog."
          );
        }
      } else {
        commentsToggler(false);
        navigate(`/detail/${blogId}/`);
      }
    },
    [currentUser, currentUserID, likeCreate, commentsToggler, navigate]
  );

  return (
    <Paper
      sx={{
        minWidth: "270px",
        width: "auto",
        maxWidth: "350px",
        m: "10px !important",
        height: "500px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "flex-start",
      }}
      elevation={10}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        mt={2}
        sx={{
          width: "100%",
        }}
      >
        <img
          src={
            blog?.image ||
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
        <Typography gutterBottom variant="h5" sx={titleStyle}>
          {blog?.title?.toUpperCase()}
        </Typography>
        <Typography sx={listStyles}>{blog?.content ?? "No Content"}</Typography>
      </Box>

      <Stack>
        {/* https://mui.com/system/getting-started/the-sx-prop/#typography */}
        <Typography sx={{ textAlign: "left", m: 2, mb: 0, fontSize: "0.7rem" }}>
          {blog?.updated_publish_date
            ? new Date(
                new Date(blog.publish_date).getTime() - 3 * 60 * 60 * 1000
              ).toLocaleString("en-US") +
              " , edited at " +
              new Date(
                new Date(blog?.updated_publish_date).getTime() -
                  3 * 60 * 60 * 1000
              ).toLocaleString("en-US")
            : blog?.publish_date
            ? new Date(
                new Date(blog.publish_date).getTime() - 3 * 60 * 60 * 1000
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
          <span>{blog?.author ?? "No author"}</span>
        </Stack>
      </Stack>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ p: 2, pt: 0, width: "100%" }}
      >
        <Box>
          <IconButton
            aria-label="add to favorites"
            sx={{ textAlign: "left", alignItems: "left" }}
            data-blog-id={blog?._id}
            data-action="like"
            onClick={handleLikeAndDirect}
          >
            <FavoriteIcon
              sx={{
                color: `${
                  blog?.likes_n?.some((like) => like.user_id === currentUserID)
                    ? "red"
                    : "gray"
                }`,
              }}
            />
            <span>{blog?.likes ?? "0"}</span>
          </IconButton>

          <IconButton
            aria-label="add comment"
            data-blog-id={blog?._id}
            data-action="comment"
            sx={{ textAlign: "left", alignItems: "left" }}
            onClick={handleLikeAndDirect}
          >
            <ChatBubbleOutlineOutlinedIcon />
            <span>{blog?.comment_count ?? "0"}</span>
          </IconButton>

          <IconButton
            aria-label="view"
            onClick={(e) => {
              e.preventDefault();
            }}
            sx={{
              "&:hover": {
                cursor: "auto",
              },
            }}
            disableRipple={true}
          >
            <RemoveRedEyeOutlinedIcon />
            <span>{blog?.post_views}</span>
          </IconButton>
        </Box>
        <Button
          variant="contained"
          data-blog-id={blog?._id}
          color="success"
          onClick={(e) => {
            handleLikeAndDirect(e);
          }}
        >
          READ MORE
        </Button>
      </Stack>
    </Paper>
  );
});

export default BlogCard;
