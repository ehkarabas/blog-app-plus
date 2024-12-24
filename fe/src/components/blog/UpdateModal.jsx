import Box from "@mui/material/Box";
import { useEffect } from "react";
import useBlogCall from "../../hooks/useBlogCall";
import { LoadingButton } from "@mui/lab";
import { MenuItem, Modal, Paper, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { object, string, addMethod } from "yup";
import { Form, Formik } from "formik";
import { useFormik } from "formik";
import mongoose from "mongoose";

const isValidUrl = (url) => {
  try {
    new URL(url);
  } catch (e) {
    return false;
  }
  return true;
};

// mongodb ObjectId doğrulayıcı ekle
addMethod(string, "objectId", function (message) {
  return this.test("objectId", message, function (value) {
    const { path, createError } = this;
    return (
      mongoose.Types.ObjectId.isValid(value) ||
      createError({ path, message: message || "Invalid ObjectId" })
    );
  });
});

const updateBlogSchema = (blogsArr) =>
  object().shape({
    title: string()
      .min(5, "Title must be at least 5 characters.")
      .max(50, "Title must be at most 50 characters.")
      .required("You must enter the title."),
    image: string().test("is-url-valid", "URL is not valid", (value) =>
      isValidUrl(value)
    ),
    categoryId: object().shape({
      _id: string()
        .objectId("Category ID is invalid")
        .required("Category ID is required"),
      name: string().required("Category name is required"),
    }),
    status: string()
      .oneOf(["d", "p"], "Invalid status type")
      .required("Status type required"),
    content: string().required("Content required"),
  });

const UpdateModal = ({
  blog,
  id,
  updateModalOpen,
  setUpdateModalOpen,
  onDataChange,
}) => {
  console.log("🔭 ~ blog ➡ ➡ ", blog);
  const handleClose = () => setUpdateModalOpen(false);
  const { loading } = useSelector((state) => state.auth);
  const { categories } = useSelector((state) => state.blog);
  const { getBlogCategories, editBlogData } = useBlogCall();

  const updateModalStyle = {
    position: "absolute",
    top: "50vh",
    left: "50vw",
    transform: "translate(-50%, -50%)",
    minWidth: "270px",
    width: "50%",
    maxWidth: "768px",
    p: 2,
  };

  useEffect(() => {
    getBlogCategories();
  }, []);

  const formik = useFormik({
    initialValues: blog,
    validationSchema: updateBlogSchema,
    onSubmit: async (values, actions) => {
      // Backend'e giden veri de uygun formata getirilip gonderilebilir. Ama backend'ten gelen veriyi direkt olarak initial values'a koydugumuz icin backend'ten gelen veriyi useEffect ile uygun format'a donusturmek yeterli olacaktir. Asagida backend'e gidecek veriyi uygun formata getirme orneklenmistir.
      // const backendData = {
      //   ...values,
      //   status: values.status === "p" ? "Published" : "Draft",
      // };
      // console.log(backendData);
      console.log("🔭 ~ UpdateModal onSubmit ~ values ➡ ➡ ", values);
      editBlogData(id, values);
      await onDataChange();

      actions.resetForm();
      actions.setSubmitting(false);
      setUpdateModalOpen(false);
    },
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = formik;

  // backend'ten gelen veri frontend'e uygun hale getiriliyor. Formik component'i ve prop'larini kullanmak yerine useFormik kullanilarak backend'ten gelen veri ile field degerleri(bu ornek icin status, status backend controller'da d veya p olarak gelen veriyi database'e "Published" veya "Draft" olarak yaziyor ve collection document verisini de(status field'ini) olgudu gibi("Published", "Draft" olarak) donuyor, bu nedenle frontend'te gelen veri donusturulmeli veya backend'ten veriyi gonderirken(read) database'den cektigi "Published" veya "Draft"'i, "p" veya "d" olarak frontend form verisine uygun sekilde gondermeli.) uyumlu hale getiriliyor.
  useEffect(() => {
    if (blog) {
      // Backend'ten gelen veriyi uygun formata dönüştürme
      setFieldValue("title", blog.title);
      setFieldValue("image", blog.image);
      setFieldValue("categoryId._id", blog.categoryId._id);
      setFieldValue("categoryId.name", blog.categoryId.name);
      setFieldValue(
        "status",
        blog.status === "Published"
          ? "p"
          : blog.status === "Draft"
          ? "d"
          : blog.status
      );
      setFieldValue("content", blog.content);
    }
  }, [blog]);

  return (
    <div>
      <Modal
        open={updateModalOpen}
        onClose={handleClose}
        aria-labelledby="update-modal-title"
        aria-describedby="update-modal-description"
      >
        {/* <Formik
          initialValues={blog}
          validationSchema={updateBlogSchema}
          onSubmit={async (values, actions) => {
            console.log("🔭 ~ UpdateModal onSubmit ~ values ➡ ➡ ", values);
            editBlogData(id, values);
            await onDataChange();

            actions.resetForm();
            actions.setSubmitting(false);
            setUpdateModalOpen(false);
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
            setFieldValue,
          }) => ( */}
        <Paper sx={updateModalStyle} elevation={5}>
          {/* <Form className="forms"> */}
          <form onSubmit={handleSubmit}>
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
                value={values.categoryId._id || ""}
                error={touched?.categoryId && Boolean(errors?.categoryId)}
                helperText={touched?.categoryId && errors?.categoryId}
                onChange={(e) => {
                  const selectedCategory = categories.find(
                    (category) => category._id === e.target.value
                  );
                  setFieldValue("categoryId._id", e.target.value);
                  setFieldValue("categoryId.name", selectedCategory.name);
                }}
                onBlur={handleBlur}
                required
              >
                <MenuItem disabled>Please choose...</MenuItem>
                {categories?.map((category) => {
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
                // value={
                //   values.status === "Draft"
                //     ? "d"
                //     : values.status === "Published"
                //     ? "p"
                //     : ""
                // }
                value={values.status || ""}
                error={touched?.status && Boolean(errors?.status)}
                helperText={touched?.status && errors?.status}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              >
                <MenuItem disabled>Please choose...</MenuItem>
                <MenuItem
                  value="p"
                  // selected={values.status === "Published"}
                >
                  Published
                </MenuItem>
                <MenuItem
                  value="d"
                  // selected={values.status === "Draft"}
                >
                  Draft
                </MenuItem>
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
                Edit Blog
              </LoadingButton>
            </Box>
          </form>
          {/* </Form> */}
        </Paper>
        {/* )}
        </Formik> */}
      </Modal>
    </div>
  );
};

export default UpdateModal;
