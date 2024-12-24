import { jwtDecode } from "jwt-decode";
import { toastErrorNotify } from "./ToastNotify";

export const decodeToken = async (token, logout = false) => {
  try {
    return jwtDecode(token);
  } catch (err) {
    if (logout) {
      await logout();
    }
    console.error("Failed to decode token: ", err);
    toastErrorNotify(err);
    return null;
  }
};

export const tokenHasExpired = async (token, logout = false) => {
  if (!token) {
    return true;
  }

  try {
    const decodedToken = await decodeToken(token, logout);
    const currentTime = Date.now() / 1000;

    return decodedToken && decodedToken.exp < currentTime;
  } catch (error) {
    console.error("Error while checking token expiration: ", error);
    return true;
  }
};
