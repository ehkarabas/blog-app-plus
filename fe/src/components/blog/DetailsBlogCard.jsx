import Typography from "@mui/material/Typography";
import AccountCircle from "@mui/icons-material/AccountCircle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { useSelector } from "react-redux";
import { Box, Button, Paper, Stack } from "@mui/material";
import { useState } from "react";
import useBlogCall from "../../hooks/useBlogCall";
import CommentForm from "./CommentForm";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DeleteModal from "./DeleteModal";
import UpdateModal from "./UpdateModal";
import BlogActions from "./BlogActions";

const DetailsBlogCard = ({ detailBlog, onDataChange }) => {
  console.log("🔭 ~ DetailsBlogCard ~ detailBlog ➡ ➡ ", detailBlog);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const { isDark } = useSelector((state) => state.theme);
  const {
    currentUser,
    id: currentUserID,
    isAdmin,
  } = useSelector((state) => state.auth);
  const { commentsToggle } = useSelector((state) => state.blog);
  const { likeCreate, commentsToggler } = useBlogCall();

  const detailStyles = {
    overflow: "hidden",
    textOverflow: "ellipsis",
    m: 2,
  };

  const handleLikeAndComments = (e) => {
    if (e.currentTarget.id === `detail-like-button-${detailBlog?._id}`) {
      likeCreate(detailBlog?._id, {
        userId: currentUserID,
        blogId: detailBlog?._id,
      });
      onDataChange();
    }
    if (e.currentTarget.id === `detail-comment-button-${detailBlog?._id}`) {
      commentsToggler();
    }
  };

  return (
    <Paper
      sx={{
        minWidth: "270px",
        width: "50%",
        maxWidth: "768px",
        m: "10px auto !important",
        height: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "flex-start",
      }}
      elevation={0}
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
            detailBlog?.image ||
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
      <Box sx={{ m: 0, mt: 1, width: "100%", order: 2 }}>
        <Typography
          gutterBottom
          variant="h5"
          sx={{ textAlign: "center", color: isDark ? "red" : "green" }}
        >
          {detailBlog?.title?.toUpperCase()}
        </Typography>
        <Typography sx={detailStyles}>
          {detailBlog?.content ?? "No Content"}
        </Typography>
      </Box>

      <Stack sx={{ order: 1 }}>
        <Typography sx={{ textAlign: "left", m: 2, mb: 0 }}>
          {detailBlog?.publish_date
            ? new Date(
                new Date(detailBlog?.publish_date).getTime() -
                  3 * 60 * 60 * 1000
              ).toLocaleString("en-US")
            : "Not published"}
        </Typography>
        {detailBlog?.updated_publish_date && (
          <Typography sx={{ textAlign: "left", m: 2, mb: 0 }}>
            {"Edited at " +
              new Date(
                new Date(detailBlog?.updated_publish_date).getTime() -
                  3 * 60 * 60 * 1000
              ).toLocaleString("en-US")}
          </Typography>
        )}

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
          <span>{detailBlog?.author ?? "No author"}</span>
        </Stack>
      </Stack>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ p: 2, pt: 0, width: "100%", order: 3 }}
      >
        <BlogActions />

        {/* <Box>
          <IconButton
            aria-label="add to favorites"
            sx={{ textAlign: "left", alignItems: "left" }}
            id={`detail-like-button-${detailBlog?._id}`}
            onClick={(e) => {
              handleLikeAndComments(e);
            }}
          >
            <FavoriteIcon
              sx={{
                color: `${
                  detailBlog?.likes_n?.filter(
                    (like) => like.userId === currentUser?.id
                  ).length > 0
                    ? "red"
                    : "gray"
                }`,
              }}
            />
            <span>{detailBlog?.likes ?? "0"}</span>
          </IconButton>

          <IconButton
            aria-label="add to favorites"
            id={`detail-comment-button-${detailBlog?._id}`}
            sx={{ textAlign: "left", alignItems: "left" }}
            onClick={(e) => {
              handleLikeAndComments(e);
            }}
          >
            <ChatBubbleOutlineOutlinedIcon />
            <span>{detailBlog?.comment_count ?? "0"}</span>
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
            <span>{detailBlog?.post_views}</span>
          </IconButton>
        </Box> */}

        {(detailBlog?.author === currentUser || isAdmin) && (
          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button
              variant="contained"
              color="warning"
              onClick={(e) => {
                setUpdateModalOpen(true);
              }}
            >
              <EditIcon />
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={(e) => {
                setDeleteModalOpen(true);
              }}
            >
              <DeleteForeverIcon />
            </Button>
          </Stack>
        )}
      </Stack>

      {commentsToggle && (
        <Box mt={2} sx={{ width: "100% !important", order: 4 }}>
          <CommentForm id={detailBlog?._id} />
        </Box>
      )}

      <UpdateModal
        id={detailBlog?._id}
        setUpdateModalOpen={setUpdateModalOpen}
        updateModalOpen={updateModalOpen}
        onDataChange={onDataChange}
        blog={detailBlog}
      />

      <DeleteModal
        id={detailBlog?._id}
        item={"blog"}
        setDeleteModalOpen={setDeleteModalOpen}
        deleteModalOpen={deleteModalOpen}
      />
    </Paper>
  );
};

export default DetailsBlogCard;
