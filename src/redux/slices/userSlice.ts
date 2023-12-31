import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { userActions } from "../../actions/userActions";
import { FulfilledAction, PendingAction, RejectedAction } from "./silceType";
import { InitialUser, UserType } from "../../types/userType";
import { removeItem } from "../../utils/handlers/tokenHandler";

export interface UserStateProps {
  users: UserType[];
  user: UserType | null;
  isLoading: boolean;
  error: boolean;
  errMsg: string;
  userViewData: UserType;
}

const initialState: UserStateProps = {
  users: [],
  user: null,
  isLoading: false,
  error: false,
  errMsg: "",
  userViewData: InitialUser,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserReducer: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },
    userChangeAvatar: (
      state,
      action: PayloadAction<{ _id: string; avatar: string }>
    ) => {
      if (state.user) {
        state.user.avatar = action.payload?.avatar;
      }
    },
    deleteUser: (
      state,
      action: PayloadAction<{ _id: string | null | undefined }>
    ) => {
      state.users.filter((user) => !(user._id === action.payload._id));
    },
    setViewUserData: (state, action: PayloadAction<UserType>) => {
      state.userViewData = action.payload;
    },
    logout: (state) => {
      state.user = InitialUser;
      removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userActions.getUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(userActions.userUpdate.fulfilled, (state, action) => {
        if (state.user?._id === action.payload._id) state.user = action.payload;
        state.userViewData = action.payload;
      })
      .addCase(userActions.verifyEmail.fulfilled, (state, action) => {
        if (!action.payload) return;
        state.user!.verifyEmail = true;
      })
      .addCase(userActions.verifyPhone.fulfilled, (state, action) => {
        if (!action.payload) return;
        state.user!.verifyPhone = true;
      })
      .addMatcher<PendingAction>(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.isLoading = true;
        }
      )
      .addMatcher<FulfilledAction | RejectedAction>(
        (action) =>
          action.type.endsWith("/fulfilled") ||
          action.type.endsWith("/rejected"),
        (state) => {
          state.isLoading = false;
        }
      );
  },
});

export const {
  setUserReducer,
  userChangeAvatar,
  deleteUser,
  setViewUserData,
  logout,
} = userSlice.actions;
export default userSlice.reducer;
