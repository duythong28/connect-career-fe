import axios from "../client/axios";
import { ProfileResponse } from "../types/auth.types";
import { updateUserInfoDto, UserResponse } from "../types/users.types";
const API_URL = "/users";

const updateUserInfo = async (
  data: updateUserInfoDto
): Promise<UserResponse> => {
  const response = await axios.patch(`${API_URL}/me`, data);
  return response.data;
};

export { updateUserInfo };
