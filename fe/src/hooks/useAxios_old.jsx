import axios from "axios";
import { useSelector } from "react-redux";

const useAxios = () => {
  const BASE_URL = process.env.REACT_APP_API_URL;
  const { token } = useSelector((state) => state.auth);

  const axiosPublic = axios.create({
    baseURL: BASE_URL,
  });

  const axiosWithToken = axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: `Token ${token}` },
  });

  return { axiosWithToken, axiosPublic };
};

export default useAxios;
