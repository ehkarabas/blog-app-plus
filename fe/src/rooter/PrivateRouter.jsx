import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { toastWarnNotify } from "../helper/ToastNotify";

const PrivateRouter = () => {
  const { currentUser } = useSelector((state) => state.auth);
  !currentUser &&
    toastWarnNotify(
      "You must login first to send a like/comment or access whole blog."
    );
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRouter;
