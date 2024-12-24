import { Avatar, Box, Stack, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";
import { Formik } from "formik";
import { object, string, number, date, InferType, ref } from "yup";
import { useDispatch, useSelector } from "react-redux";
import useBlogCall from "../../hooks/useBlogCall";
import { LoadingButton } from "@mui/lab";
import CommentIcon from "@mui/icons-material/Comment";
import CommentCard from "./CommentCard";
import { useEffect, useState } from "react";
import { fetchBlogDetail } from "../../features/blogSlice";

const CommentForm = ({ id }) => {
  const theme = useTheme();
  const { commentCreate } = useBlogCall();
  const { id: currentUserID } = useSelector((state) => state.auth);
  const { blogDetail } = useSelector((state) => state.blog);
  const dispatch = useDispatch();
  const comments = blogDetail?.comments || [];

  const commentSchema = object({
    comment: string().required("Comment cannot be empty."),
  });

  const handleFormikSubmit = async (values, actions) => {
    await commentCreate(id, {
      blogId: id,
      userId: currentUserID,
      content: values.comment,
    });
    actions.resetForm();
    await dispatch(fetchBlogDetail(id));
    actions.setSubmitting(false);
  };

  useEffect(() => {
    dispatch(fetchBlogDetail(id));
  }, [id, dispatch]);

  return (
    <Box sx={{ minWidth: "270px", width: "100%", maxWidth: "768px", p: 0 }}>
      <Stack
        justifyContent="center"
        alignItems="stretch"
        spacing={2}
        p={2}
        sx={{ width: "100% !important" }}
      >
        <Avatar
          sx={{
            backgroundColor: "primary.light",
            m: "auto !important",
          }}
        >
          <CommentIcon size="30" />
        </Avatar>
        <Typography
          variant="h4"
          align="center"
          color={theme.palette.primary.light}
        >
          Comments
        </Typography>

        {comments.map((comment, index) => (
          <CommentCard
            key={`comment-card-${comment._id}`}
            comment={comment}
            currentUserID={currentUserID}
          />
        ))}

        <Formik
          initialValues={{
            comment: "",
          }}
          validationSchema={commentSchema}
          onSubmit={handleFormikSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              component="form"
              onSubmit={handleSubmit}
            >
              <TextField
                label="Comment"
                name="comment"
                id="comment"
                variant="outlined"
                multiline
                rows={2}
                value={values.comment}
                error={touched?.comment && Boolean(errors?.comment)}
                helperText={touched?.comment && errors?.comment}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />

              <LoadingButton
                variant="contained"
                type="submit"
                loading={isSubmitting}
              >
                Submit Comment
              </LoadingButton>
            </Box>
          )}
        </Formik>
      </Stack>
    </Box>
  );
};

export default CommentForm;
