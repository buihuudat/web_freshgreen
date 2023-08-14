import { createAsyncThunk } from "@reduxjs/toolkit";
import { userApi } from "../utils/api/userApi";
import { NotificationToast } from "../utils/handlers/NotificationToast";
import { UserType } from "../types/userType";

export interface changeAvatarProps {
  _id: string | undefined;
  image: string;
}

export const userActions = {
  changeAvatar: async (data: changeAvatarProps) => {
    try {
      const res = await userApi.changeAvatar(data);
      NotificationToast({ message: res.data.message, type: "success" });
      return true;
    } catch (error) {
      NotificationToast({ message: "Avatar update failure", type: "error" });
      throw error;
    }
  },
  userUpdate: createAsyncThunk(
    "user/update",
    async (data: UserType, thunkAPI) => {
      try {
        const res = await userApi.updateUser(data);
        NotificationToast({ message: "Cập nhật thành công", type: "success" });
        return res.data;
      } catch (error: any) {
        NotificationToast({ message: "Cập nhật thất bại", type: "error" });
        if (error.data) return thunkAPI.rejectWithValue(error.data);
        throw error;
      }
    }
  ),

  delete: async (data: string) => {
    try {
      await userApi.deleteUser(data);
      NotificationToast({
        message: "Đã xóa người dùng thành công",
        type: "success",
      });
      return true;
    } catch (error) {
      NotificationToast({
        message: "Không thể xóa người dùng này",
        type: "error",
      });
      throw error;
    }
  },

  getUsers: createAsyncThunk("user/gets", async () => {
    try {
      const res = await userApi.getUsers();
      return res.data;
    } catch (error) {
      throw error;
    }
  }),

  getUser: async (_id: string) => {
    try {
      const res = await userApi.getUser(_id);
      return res.data;
    } catch (error: any) {
      throw error;
    }
  },
};