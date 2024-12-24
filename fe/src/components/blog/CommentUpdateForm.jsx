import { Formik, Form } from "formik";
import { Box, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import useBlogCall from "../../hooks/useBlogCall";
import { useDispatch } from "react-redux";
import { fetchBlogDetail } from "../../features/blogSlice";
import { object, string } from "yup";

const commentSchema = object().shape({
  content: string().required("Content required"),
});

const CommentUpdateForm = ({ comment, setIsEditing }) => {
  const { editComment } = useBlogCall();
  const dispatch = useDispatch();

  const handleEditSubmit = async (values, actions) => {
    await editComment(comment._id, values);
    actions.setSubmitting(false);
    setIsEditing(false);
    await dispatch(fetchBlogDetail(comment.blogId._id));
  };

  return (
    <Formik
      initialValues={comment}
      validationSchema={commentSchema}
      onSubmit={handleEditSubmit}
      // sx={{ width: 1 }}
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
        <Form style={{ width: "100%" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Content"
              name="content"
              variant="outlined"
              multiline
              rows={2}
              value={values.content}
              error={touched.content && Boolean(errors.content)}
              helperText={touched.content && errors.content}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            <LoadingButton
              variant="contained"
              type="submit"
              loading={isSubmitting}
            >
              Save
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default CommentUpdateForm;
