import {
  Box,
  TextField,
  Typography,
  IconButton,
  Divider,
  Chip,
  Button,
} from "@mui/material";
import { LoginBg } from "../../constants/images";
import { LoadingButton } from "@mui/lab";
import { Link, useNavigate } from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useState } from "react";
import { mainColor } from "../../constants/colors";
import { LoginType } from "../../types/authType";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { authActions } from "../../actions/authActions";
import { RootState } from "../../redux/store";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { loginWithGoogle } from "../../utils/handlers/loginWithGoogle";
import { NotificationToast } from "../../utils/handlers/NotificationToast";
import { loginWithFacebook } from "../../utils/handlers/loginWithFacebook";
import { LoginModal } from "./LoginModal";
import { setLoginModal } from "../../redux/slices/authSlice";

const InitialErrText: { phone: string; password: string } = {
  phone: "",
  password: "",
};

const Login = () => {
  const [isShowPass, setIsShowPass] = useState(false);
  const [errText, setErrText] = useState(InitialErrText);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state: RootState) => state.auth.loading);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: LoginType = {
      phone: formData.get("username") as string,
      password: formData.get("password") as string,
    };

    setErrText(InitialErrText);

    await dispatch(authActions.login(data))
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch((err: any) => {
        err?.errors &&
          err.errors.forEach((e: any) => {
            switch (e.path) {
              case "phone":
                setErrText((prev) => ({
                  ...prev,
                  phone: e.msg,
                }));
                break;
              case "password":
                setErrText((prev) => ({
                  ...prev,
                  password: e.msg,
                }));
                break;
              default:
                break;
            }
          });
      });
  };

  const handleGoogleLogin = async () => {
    const res: any = await loginWithGoogle();
    await dispatch(authActions.google(res.data))
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch((error: any) => {
        if (error.type === "email_existed") {
          dispatch(
            setLoginModal({
              open: true,
              message: error.message,
              data: res.data.email,
            })
          );
        }
      });
  };

  const handleFacebookLogin = async () => {
    const res: any = await loginWithFacebook();

    await dispatch(authActions.facebook(res.data))
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch((error: any) => {
        NotificationToast({ message: error.message, type: "error" });
      });
  };

  return (
    <Box
      display={{ sm: "flex", xs: "column" }}
      flexDirection={"row"}
      justifyContent={"space-around"}
    >
      <img
        src={LoginBg}
        alt="login bg"
        style={window.innerWidth < 600 ? { width: "100%" } : {}}
      />
      <Box
        display={"flex"}
        flexDirection={"column"}
        width={{ sm: 500, xs: "100%" }}
        component={"form"}
        onSubmit={handleSubmit}
      >
        <Typography fontWeight={600} fontSize={30}>
          Đăng nhập
        </Typography>
        <TextField
          label="Tên tài khoản/ Số điện thoại/ Email"
          name="username"
          margin="normal"
          sx={{ width: { sm: 400, xs: "100%" } }}
          required
          error={errText.phone !== ""}
          helperText={errText.phone}
        />
        <Box
          display={"flex"}
          flexDirection={"row"}
          gap={1}
          alignItems={"center"}
        >
          <TextField
            label="Mật khẩu"
            name="password"
            margin="normal"
            type={isShowPass ? "text" : "password"}
            autoComplete="false"
            sx={{ width: { sm: 400, xs: "100%" } }}
            required
            error={errText.password !== ""}
            helperText={errText.password}
          />
          <IconButton onClick={() => setIsShowPass(!isShowPass)}>
            <RemoveRedEyeIcon
              sx={{ color: isShowPass ? mainColor : "normal" }}
            />
          </IconButton>
        </Box>
        <LoadingButton
          variant="contained"
          color="success"
          sx={{ mt: 2, width: { sm: 400, xs: "100%" } }}
          type="submit"
          loading={loading}
        >
          Đăng nhập
        </LoadingButton>

        <Divider variant="middle" sx={{ width: "70%", pt: 2 }}>
          <Chip label="Hoặc đăng nhập bằng" />
        </Divider>
        {/* login with social */}
        <Box sx={{ display: "flex", justifyContent: "start", gap: 5, pt: 2 }}>
          <Button
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
            }}
            variant="outlined"
            onClick={handleGoogleLogin}
          >
            <GoogleIcon />
            <Typography fontSize={22} fontWeight={600}>
              Google
            </Typography>
          </Button>
          <Button
            onClick={handleFacebookLogin}
            sx={{ display: "flex", gap: 1, alignItems: "center" }}
            variant="contained"
          >
            <FacebookIcon />
            <Typography fontSize={22} fontWeight={600}>
              Facebook
            </Typography>
          </Button>
        </Box>

        <Link
          to={"/quen-mat-khau"}
          style={{
            fontWeight: 600,
            color: mainColor,
            paddingTop: 10,
            textDecoration: "none",
          }}
        >
          Quên mật khẩu?
        </Link>
        <Typography>
          Bạn chưa có tài khoản?{" "}
          <Link
            to={"/dang-ky"}
            style={{
              textDecoration: "none",
              fontWeight: 600,
              color: mainColor,
            }}
          >
            Đăng ký ngay
          </Link>
        </Typography>
      </Box>
      <LoginModal />
    </Box>
  );
};

export default Login;
