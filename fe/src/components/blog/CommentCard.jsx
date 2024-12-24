import React, { useState, useEffect } from "react";
import { Paper, Stack, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { fetchBlogDetail } from "../../features/blogSlice";
import useBlogCall from "../../hooks/useBlogCall";
import DeleteModal from "./DeleteModal";
import CommentActions from "./CommentActions";
import CommentUpdateForm from "./CommentUpdateForm";
import { useSelector } from "react-redux";

const CommentCard = ({ comment, currentUserID }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { isAdmin } = useSelector((state) => state.auth);
  const { editComment, deleteComment } = useBlogCall();

  const handleDelete = async () => {
    await deleteComment(comment._id);
  };

  const handleEditSubmit = async (values, actions) => {
    await editComment(comment._id, values);
    actions.setSubmitting(false);
    setIsEditing(false);
    await dispatch(fetchBlogDetail(comment.blogId._id));
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEditing]);

  return (
    <Paper
      sx={{
        width: "100%",
        m: "10px auto !important",
        ml: 0,
        height: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "flex-start",
      }}
      elevation={2}
    >
      <Stack
        sx={{ order: 0, width: 1 }}
        alignItems="flex-start"
        spacing={1}
        p={2}
      >
        {(comment.userId._id === currentUserID || isAdmin) && (
          <CommentActions
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            setDeleteModalOpen={setDeleteModalOpen}
          />
        )}

        <Typography>{comment.userId?.username ?? "No author"}</Typography>
        <Typography sx={{ opacity: "0.6", fontSize: "0.7rem" }}>
          {comment?.editedAt
            ? new Date(
                new Date(comment.createdAt).getTime() - 3 * 60 * 60 * 1000
              ).toLocaleString("en-US") +
              " , edited at " +
              new Date(
                new Date(comment?.editedAt).getTime() - 3 * 60 * 60 * 1000
              ).toLocaleString("en-US")
            : comment?.updatedAt
            ? new Date(
                new Date(comment?.updatedAt).getTime() - 3 * 60 * 60 * 1000
              ).toLocaleString("en-US")
            : "Not Published"}
        </Typography>

        {isEditing ? (
          <CommentUpdateForm comment={comment} setIsEditing={setIsEditing} />
        ) : (
          <Typography sx={{ my: 1, pt: 2 }}>
            {comment?.content ?? "No content"}
          </Typography>
        )}
      </Stack>
      <DeleteModal
        id={comment?._id}
        item={"comment"}
        setDeleteModalOpen={setDeleteModalOpen}
        deleteModalOpen={deleteModalOpen}
        comment={comment}
      />
    </Paper>
  );
};

export default CommentCard;
