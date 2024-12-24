import { Avatar, Container, Stack, Typography } from "@mui/material";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import { useTheme } from "@mui/styles";
import { Formik } from "formik";
import useAuthCall from "../hooks/useAuthCall";
import { object, string, number, date, InferType, ref } from "yup";
import { Helmet } from "react-helmet";
import PwResetForm from "../components/auth/PwResetForm";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { authResetLoading } from "../features/authSlice";

const PwResetRequest = () => {
  const theme = useTheme();
  const { pwReset } = useAuthCall();
  const dispatch = useDispatch();

  const resetRequestSchema = object({
    email: string()
      .email("Email is not valid.")
      .required("You must enter your email."),
  });

  useEffect(() => {
    dispatch(authResetLoading);
  }, []);

  return (
    <>
      <Helmet>
        <title>BlogApp - Password Reset Request</title>
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
            <PsychologyAltIcon size="30" />
          </Avatar>
          <Typography
            variant="h4"
            align="center"
            color={theme.palette.success.dark}
          >
            Password Reset
          </Typography>
          <Formik
            initialValues={{
              email: "",
            }}
            validationSchema={resetRequestSchema}
            onSubmit={(values, actions) => {
              pwReset(values);
            }}
            component={(props) => <PwResetForm {...props} />}
          />
        </Stack>
      </Container>
    </>
  );
};

export default PwResetRequest;
