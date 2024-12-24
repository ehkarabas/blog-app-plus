import { Box, MenuItem, Paper, Stack, TextField } from "@mui/material";
import useBlogCall from "../hooks/useBlogCall";
import { Form, Formik } from "formik";
import { object, string, number, date, InferType, ref } from "yup";
import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";

const NewBlog = () => {
  const { getBlogCategories, postBlogData } = useBlogCall();
  const { loading, id: userId } = useSelector((state) => state.auth);
  const [categoriesArr, setCategoriesArr] = useState([]);

  const isValidUrl = (url) => {
    try {
      new URL(url);
    } catch (e) {
      return false;
    }
    return true;
  };

  const createCategorySchema = (categoriesArr) =>
    object().shape({
      title: string()
        .min(4, "Title must be at least 4 characters.")
        .max(50, "Title must be at most 50 characters.")
        .required("You must enter the title."),
      image: string().test("is-url-valid", "URL is not valid", (value) =>
        isValidUrl(value)
      ),
      category: string().required("Category required"),
      status: string()
        .oneOf(["d", "p"], "Invalid status type")
        .required("Status type required"),
      content: string().required("Content required"),
    });

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getBlogCategories();
      console.log("🔭 ~ fetchCategories ~ categories ➡ ➡ ", categories);
      setCategoriesArr(categories);
    };
    fetchCategories();
  }, []);

  return (
    <>
      <Helmet>
        <title>BlogApp - New Blog</title>
      </Helmet>

      <Stack direction="row" justifyContent="center" alignItems="center" mt={1}>
        <Paper
          elevation={5}
          sx={{
            p: 2,
            borderRadius: "1rem",
            minWidth: "270px",
            width: "50%",
            maxWidth: "768px",
          }}
        >
          <Formik
            initialValues={{
              title: "",
              image: "",
              category: "",
              status: "",
              content: "",
            }}
            validationSchema={createCategorySchema(categoriesArr)}
            onSubmit={(values, actions) => {
              const data = {
                ...values,
                categoryId: values.category,
                userId,
              };
              delete data.category;
              console.log("🔭 ~ NewBlog ~ data ➡ ➡ ", data);
              postBlogData(data);
              actions.resetForm();
              actions.setSubmitting(false);
            }}
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
              <Form onSubmit={handleSubmit}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    label="Title"
                    name="title"
                    id="title"
                    type="text"
                    variant="outlined"
                    value={values.title}
                    error={touched?.title && Boolean(errors?.title)}
                    helperText={touched?.title && errors?.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />

                  <TextField
                    label="Image URL"
                    name="image"
                    id="image"
                    type="url"
                    variant="outlined"
                    value={values.image}
                    error={touched?.image && Boolean(errors?.image)}
                    helperText={touched?.image && errors?.image}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />

                  <TextField
                    margin="dense"
                    select
                    fullWidth
                    label="Category"
                    id="category"
                    name="category"
                    value={values.category || ""}
                    error={touched?.category && Boolean(errors?.category)}
                    helperText={touched?.category && errors?.category}
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    onBlur={handleBlur}
                    required
                  >
                    <MenuItem selected disabled>
                      Please choose...
                    </MenuItem>
                    {categoriesArr?.map((category) => {
                      return (
                        <MenuItem key={category._id} value={category._id}>
                          {category.name}
                        </MenuItem>
                      );
                    })}
                  </TextField>

                  <TextField
                    margin="dense"
                    select
                    fullWidth
                    label="Status"
                    id="status"
                    name="status"
                    value={values.status || ""}
                    error={touched?.status && Boolean(errors?.status)}
                    helperText={touched?.status && errors?.status}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  >
                    <MenuItem selected disabled>
                      Please choose...
                    </MenuItem>
                    <MenuItem value="d">Draft</MenuItem>
                    <MenuItem value="p">Published</MenuItem>
                  </TextField>

                  <TextField
                    label="Content"
                    name="content"
                    id="content"
                    variant="outlined"
                    multiline
                    rows={2}
                    value={values.content}
                    error={touched?.content && Boolean(errors?.content)}
                    helperText={touched?.content && errors?.content}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />

                  <LoadingButton
                    variant="contained"
                    type="submit"
                    loading={loading}
                  >
                    Submit Blog
                  </LoadingButton>
                </Box>
              </Form>
            )}
          </Formik>
        </Paper>
      </Stack>
    </>
  );
};

export default NewBlog;
