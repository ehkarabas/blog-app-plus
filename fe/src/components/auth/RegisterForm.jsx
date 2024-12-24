import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
} from "@mui/material";
import { Form } from "formik";
import { useState } from "react";
import { useSelector } from "react-redux";

const RegisterForm = ({
  values,
  handleChange,
  errors,
  touched,
  handleBlur,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const { loading } = useSelector((state) => state.auth);

  return (
    <Form className="forms">
      <Stack spacing={2}>
        <TextField
          label="Username"
          name="username"
          id="username"
          type="text"
          variant="outlined"
          value={values.username}
          error={touched?.username && Boolean(errors?.username)}
          helperText={touched?.username && errors?.username}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />

        <TextField
          label="First Name"
          name="firstName"
          id="firstName"
          type="text"
          variant="outlined"
          value={values.firstName}
          error={touched?.firstName && Boolean(errors?.firstName)}
          helperText={touched?.firstName && errors?.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          sx={{ "&:focus": { outline: "none !important" } }}
          required
        />

        <TextField
          label="Last Name"
          name="lastName"
          id="lastName"
          type="text"
          variant="outlined"
          value={values.lastName}
          error={touched?.lastName && Boolean(errors?.lastName)}
          helperText={touched?.lastName && errors?.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />

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
          label="Image Url"
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
          label="Bio"
          name="bio"
          id="bio"
          variant="outlined"
          multiline
          maxRows={4}
          value={values.bio}
          error={touched?.bio && Boolean(errors?.bio)}
          helperText={touched?.bio && errors?.bio}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <TextField
          id="password"
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          value={values.password}
          error={touched?.password && Boolean(errors?.password)}
          helperText={touched?.password && errors?.password}
          onChange={handleChange}
          onBlur={handleBlur}
          InputProps={{
            endAdornment: (
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
            ),
          }}
          required
        />

        <TextField
          id="password2"
          name="password2"
          label="Confirm Password"
          type={showPassword2 ? "text" : "password"}
          variant="outlined"
          value={values.password2}
          error={touched?.password2 && Boolean(errors?.password2)}
          helperText={touched?.password2 && errors?.password2}
          onChange={handleChange}
          onBlur={handleBlur}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => {
                    setShowPassword2(!showPassword2);
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                  edge="end"
                >
                  {showPassword2 ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          required
        />

        <LoadingButton variant="contained" type="submit" loading={loading}>
          Submit
        </LoadingButton>
      </Stack>
    </Form>
  );
};

export default RegisterForm;
