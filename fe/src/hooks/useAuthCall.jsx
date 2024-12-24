import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchFail,
  fetchStart,
  fetchSuccess,
  loginSuccess,
  logoutSuccess,
  registerSuccess,
} from "../features/authSlice";
import { toastErrorNotify, toastSuccessNotify } from "../helper/ToastNotify";
import useAxios from "./useAxios";
import ErrorCatcher from "../helper/ErrorCatch";

const useAuthCall = () => {
  const { axiosPublic, axiosWithToken, axiosWithJWT } = useAxios();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth);

  const login = async (userInfo) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosPublic.post(`api/auth/login/`, userInfo);
      if (data.error) {
        ErrorCatcher(data, "login");
      } else {
        dispatch(loginSuccess(data));
        toastSuccessNotify("Logged in successfully.");
        navigate("/");
      }
    } catch (error) {
      console.error("🔭 ~ login ~ error ➡ ➡ ", error);
      const err = `Error ${error.response.status}: ${
        error.response?.data?.message ?? error.response?.statusText
      }`;
      dispatch(fetchFail(err));
      toastErrorNotify(err);
    }
  };

  const logout = async () => {
    dispatch(fetchStart());
    try {
      // token header ile iletiliyor bu nedenle post degil get atiliyor, get her zaman daha guvenlidir
      const { data } = await axiosWithToken.get(
        `api/auth/logout/`
        // {
        // headers: {
        //   Authorization: currentUser.token,
        //   "Content-Type": "application/json",
        //   },
        // }
      );
      if (data.error) {
        ErrorCatcher(data, "logout");
      } else {
        dispatch(logoutSuccess());
        navigate("/");
        toastSuccessNotify("Logged out.");
      }
    } catch (error) {
      console.error("🔭 ~ logout ~ error ➡ ➡ ", error);
      const err = `Error ${error.response.status}: ${
        error.response?.data?.message ?? error.response?.statusText
      }`;
      dispatch(fetchFail(err));
      toastErrorNotify(err);
    }
  };

  const register = async (newUser) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosPublic.post(`api/users/register/`, newUser);
      if (data.error) {
        ErrorCatcher(data, "register");
      } else {
        dispatch(registerSuccess(data));
        toastSuccessNotify("Registration successful!");
        navigate("/");
      }
    } catch (error) {
      console.error("🔭 ~ register ~ error ➡ ➡ ", error);
      const err = `Error ${error.response.status}: ${
        error.response?.data?.message ?? error.response?.statusText
      }`;
      dispatch(fetchFail(err));
      toastErrorNotify(err);
    }
  };

  const pwReset = async (email) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosPublic.post(
        `api/auth/password/reset/`,
        email
      );

      if (data.error) {
        ErrorCatcher(data, "pwReset");
      } else {
        console.log(data);

        dispatch(fetchSuccess());
        toastSuccessNotify(
          "If you entered your account's email correct, an email has sent to you. Check your email."
        );
        navigate("/login");
      }
    } catch (error) {
      console.error("🔭 ~ pwReset ~ error ➡ ➡ ", error);
      const err = `Error ${error.response.status}: ${
        error.response?.data?.message ?? error.response?.statusText
      }`;
      console.log(error);
      dispatch(fetchFail(err));
      toastErrorNotify(err);
    }
  };

  const pwResetConfirm = async (obj) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosPublic.post(
        `api/auth/password/reset/confirm/${obj.uid}/${obj.token}/`,
        obj
      );

      if (data.error) {
        ErrorCatcher(data, "pwResetConfirm");
      } else {
        console.log(data);

        dispatch(fetchSuccess());
        toastSuccessNotify("Your password has been successfully reset!");
        navigate("/login");
      }
    } catch (error) {
      console.log("🔭 ~ pwResetConfirm ~ error ➡ ➡ ", error);
      const err = `Error ${error.response.status}: ${
        error.response?.data?.message ?? error.response?.statusText
      }`;
      dispatch(fetchFail(err));
      toastErrorNotify(err);
    }
  };

  return { login, logout, register, pwReset, pwResetConfirm };
};

export default useAuthCall;
