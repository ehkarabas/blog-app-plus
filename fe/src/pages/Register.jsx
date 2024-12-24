import { Avatar, Container, Stack, Typography } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useTheme } from "@mui/styles";
import RegisterForm from "../components/auth/RegisterForm";
import { Formik } from "formik";
import useAuthCall from "../hooks/useAuthCall";
import { object, string, number, date, InferType, ref } from "yup";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authResetLoading } from "../features/authSlice";

const Register = () => {
  const theme = useTheme();
  const { register } = useAuthCall();
  const dispatch = useDispatch();

  const isValidUrl = (url) => {
    try {
      new URL(url);
    } catch (e) {
      return false;
    }
    return true;
  };

  const registerSchema = object({
    username: string()
      .min(5, "Username must be at least 5 characters.")
      .max(20, "Username must be at most 20 characters.")
      .required("You must enter your username."),
    firstName: string()
      .min(2, "First name must be at least 2 characters.")
      .max(20, "First name must be at most 20 characters.")
      .required("You must enter your first name."),
    lastName: string()
      .min(2, "Last name must be at least 2 characters.")
      .max(20, "Last name must be at most 20 characters.")
      .required("You must enter your last name."),
    email: string()
      .email("Email is not valid.")
      .required("You must enter your email."),
    image: string().test("is-url-valid", "URL is not valid", (value) =>
      isValidUrl(value)
    ),
    bio: string()
      .min(10, "Bio must be at least 10 characters.")
      .max(100, "Bio must be at most 100 characters."),
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
    password2: string()
      .oneOf([ref("password"), null], "Passwords must match.")
      .required("You must confirm your password."),
  });

  useEffect(() => {
    dispatch(authResetLoading);
  }, []);

  return (
    <>
      <Helmet>
        <title>BlogApp - Register</title>
      </Helmet>

      <Container maxWidth="sm">
        <Stack justifyContent="center" spacing={2} p={2}>
          <Avatar
            sx={{
              backgroundColor: "warning.light",
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
            color={theme.palette.warning.light}
          >
            Register
          </Typography>
          <Formik
            initialValues={{
              username: "",
              firstName: "",
              lastName: "",
              email: "",
              image: "",
              bio: "",
              password: "",
              password2: "",
            }}
            validationSchema={registerSchema}
            onSubmit={(values, actions) => {
              register(values);
            }}
            component={(props) => <RegisterForm {...props} />}
          />
          <Typography>
            Already have an account?{" "}
            <Link to="/login" className="text-red-600">
              Sign in
            </Link>
          </Typography>
        </Stack>
      </Container>
    </>
  );
};

export default Register;
