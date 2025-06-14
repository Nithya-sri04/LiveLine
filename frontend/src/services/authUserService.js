import axios from "./axios/axiosInstance";

const BASE_URL = "/userAuth";

export const loginUser = async (data) => {
    console.log(data);
  const response = await axios.post(`${BASE_URL}/login`, data, {
    withCredentials: true, 
    
  });
  return response.data;
};

export const signupUser = async (data) => {
    const response = await axios.post(`${BASE_URL}/signup`, data);
    return response.data;
  };


export const sendUserOtp = async (email) => {
  const response = await axios.post(`${BASE_URL}/send-otp`, { email });
  return response.data;
};

export const verifyUserOtp = async ({ email, otp }) => {
  const response = await axios.post(`${BASE_URL}/verify-otp`, { email, otp });
  return response.data;
};

  export const logoutUser = async () => {
    const response = await axios.post(
      `${BASE_URL}/logout`,{},{withCredentials: true,}
    );
    return response.data;
  };

