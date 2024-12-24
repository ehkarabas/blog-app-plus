import { toastErrorNotify } from "./ToastNotify";

const ErrorCatcherOld = (error, pathname = "") => {
  console.log("🔭 ~ ErrorCatcher ~ error ➡ ➡ ", error);
  let err;
  if (
    error?.response?.status === 400 &&
    pathname === "/auth/resend_activation/"
  ) {
    err = `Error 400: This is not a registered account or your account has been activated already.`;
  } else {
    err = error?.response
      ? `Error ${error?.response?.status}: ${
          typeof error?.response?.data === "string" &&
          (error?.response?.data).startsWith("<")
            ? error?.response.statusText
            : typeof error?.response?.data === "string" &&
              (error?.response?.data).startsWith("redirect_uri")
            ? error?.response?.data
            : error?.response?.data[Object.keys(error?.response?.data)[0]]
        }`
      : `Error : ${error?.message || error?.name}`;
  }
  toastErrorNotify(err);
  return err;
};

const ErrorCatcher = (error, functionName) => {
  console.log("ErrorCatcher ran");
  if (!error?.message) {
    error.message = "Deletion Error";
  }
  console.error(
    `🔭 ~ ${functionName} ErrorCatcher ~ error ➡ ➡ `,
    error.message
  );
  toastErrorNotify(error.message);
  return error.message;
};

export default ErrorCatcher;
