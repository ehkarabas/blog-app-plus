import { useSelector } from "react-redux";
import { Form } from "formik";
import { Stack, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";

const PwResetForm = ({ values, handleChange, errors, touched, handleBlur }) => {
  const { loading } = useSelector((state) => state.auth);

  return (
    <Form className="forms">
      <Stack spacing={2}>
        <TextField
          label="Email"
          name="email"
          id="email"
          type="email"
          variant="outlined"
          value={values.email}
          error={touched?.email && Boolean(errors?.email)}
          helperText={touched?.email && errors?.email}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />

        <LoadingButton variant="contained" type="submit" loading={loading}>
          Submit
        </LoadingButton>
      </Stack>
    </Form>
  );
};

export default PwResetForm;
