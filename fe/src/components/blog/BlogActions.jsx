import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import useBlogCall from "../../hooks/useBlogCall";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { fetchBlogDetail } from "../../features/blogSlice";
import { useDispatch, useSelector } from "react-redux";

const BlogActions = () => {
  const { getBlogData, likeCreate, commentsToggler } = useBlogCall();
  const { id: currentUserID } = useSelector((state) => state.auth);
  const { blogDetail } = useSelector((state) => state.blog);
  const { id: blogId } = useParams();
  const [likeState, setLikeState] = useState(false);
  const [commentState, setCommentState] = useState(false);
  const dispatch = useDispatch();

  console.log("🔭 ~ BlogActions ~ blogDetail ➡ ➡ ", blogDetail);

  const handleLike = (e) => {
    likeCreate(blogId, { userId: currentUserID, blogId });
    setLikeState(!likeState);
  };

  const handleComment = (e) => {
    commentsToggler();
    setCommentState(!commentState);
  };

  const blogDataFetch = (id) => {
    const data = dispatch(fetchBlogDetail(id));
  };

  useEffect(() => {
    blogDataFetch(blogId);
  }, [likeState, commentState, blogId]);

  return (
    <Box>
      <IconButton aria-label="add to favorites" onClick={handleLike}>
        <FavoriteIcon
          sx={{
            color: `${
              blogDetail?.likes_n?.filter(
                (like) => like.user_id === currentUserID
              ).length > 0
                ? "red"
                : "gray"
            }`,
          }}
        />
        <span>{blogDetail?.likes ?? "0"}</span>
      </IconButton>

      <IconButton aria-label="add comment" onClick={handleComment}>
        <ChatBubbleOutlineOutlinedIcon />
        <span>{blogDetail?.comment_count ?? "0"}</span>
      </IconButton>

      <IconButton
        aria-label="view"
        onClick={(e) => {
          e.preventDefault();
        }}
        disableRipple={true}
      >
        <RemoveRedEyeOutlinedIcon />
        <span>{blogDetail?.post_views}</span>
      </IconButton>
    </Box>
  );
};

export default BlogActions;
