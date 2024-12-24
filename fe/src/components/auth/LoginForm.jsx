import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { IconButton, InputAdornment, Stack, TextField } from "@mui/material";
import { Form } from "formik";
import { useState } from "react";
import { useSelector } from "react-redux";

const LoginForm = ({ values, handleChange, errors, touched, handleBlur }) => {
  const [showPassword, setShowPassword] = useState(false);
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

        <TextField
          label="Password"
          name="password"
          id="password"
          type="password"
          variant="outlined"
          endadornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          value={values.password}
          error={touched?.password && Boolean(errors?.password)}
          helperText={touched?.password && errors?.password}
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

export default LoginForm;
