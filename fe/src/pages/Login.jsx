import { Avatar, Container, Stack, Typography } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useTheme } from "@mui/styles";
import { Formik } from "formik";
import useAuthCall from "../hooks/useAuthCall";
import { object, string, number, date, InferType, ref } from "yup";
import { Link } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import { Helmet } from "react-helmet";
import { authResetLoading } from "../features/authSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

const Login = () => {
  const theme = useTheme();
  const { login } = useAuthCall();
  const dispatch = useDispatch();

  const loginSchema = object({
    email: string()
      .email("Email is not valid.")
      .required("You must enter your email."),
    password: string()
      .min(8, "Password must be at least 8 characters.")
      .max(20, "Password must be at most 20 characters.")
      .matches(/\d+/, "Must contain at least 1 digit.")
      .matches(/[a-z]+/, "Must contain at least 1 lowercase.")
      .matches(/[A-Z]+/, "Must contain at least 1 uppercase.")
      .matches(
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/,
        "Must contain at least 1 special character."
      )
      .required("You must enter your password."),
  });

  useEffect(() => {
    dispatch(authResetLoading);
  }, []);

  return (
    <>
      <Helmet>
        <title>BlogApp - Login</title>
      </Helmet>

      <Container maxWidth="sm">
        <Stack justifyContent="center" spacing={2} p={2}>
          <Avatar
            sx={{
              backgroundColor: "success.dark",
              m: "auto !important",
              width: 40,
              height: 40,
            }}
          >
            <LockIcon size="30" />
          </Avatar>
          <Typography
            variant="h4"
            align="center"
            color={theme.palette.success.dark}
          >
            Login
          </Typography>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={loginSchema}
            onSubmit={(values, actions) => {
              login(values);
            }}
            component={(props) => <LoginForm {...props} />}
          />
          <Typography>
            Don't have an account?{" "}
            <Link to="/register" className="text-red-600">
              Sign up
            </Link>
          </Typography>
          {/* <Typography>
            Forgot your password?{" "}
            <Link to="/password/reset/" className="text-red-600">
              Reset Password
            </Link>
          </Typography> */}
        </Stack>
      </Container>
    </>
  );
};

export default Login;
