import axios from "../client/axios";
import { updateUserInfoDto, UserResponse, UsersListResponse } from "../types/users.types";
const API_URL = "/users";
const SEARCH_API_URL = "/search";

const updateUserInfo = async (
  data: updateUserInfoDto
): Promise<UserResponse> => {
  const response = await axios.patch(`${API_URL}/me`, data);
  return response.data;
};

const searchUsers = async (query: {
  q: string;
  page?: number;
  limit?: number;
}): Promise<UsersListResponse> => {
  const response = await axios.get(`${SEARCH_API_URL}/people`, {
    params: query ,
  });
  return response.data;
};

export { updateUserInfo, searchUsers };
