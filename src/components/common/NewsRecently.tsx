import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Box, Button, Typography } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { mainColor } from "../../utils/Constants/colors";
import { NavigateOptions, useNavigate } from "react-router-dom";
import { NewsType } from "../../types/newsType";
import { formatDateInput } from "../../utils/handlers/formatDateInput";

const NewsRecently = ({ news }: { news: NewsType }) => {
  const navigate = useNavigate();
  const state = { news } as NavigateOptions;

  return (
    <Box width={"45%"}>
      {/* <img
        src={news.image}
        alt={news.title}
        style={{
          width: "100%",
          height: 130,
          objectFit: "cover",
          borderRadius: 5,
        }}
      /> */}

      <Typography
        fontWeight={600}
        sx={{
          cursor: "pointer",
          color: "#000",
          textTransform: "capitalize",
          ":hover": {
            color: mainColor,
          },
        }}
        component={Button}
        onClick={() => navigate(news.title, { state })}
      >
        {news.title}
      </Typography>

      <Box
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
      >
        <Typography fontSize={15}>
          <CalendarMonthIcon sx={{ fontSize: 14, color: mainColor }} />
          {formatDateInput(news.createdAt)}
        </Typography>
        <Typography fontSize={15}>
          <RemoveRedEyeIcon sx={{ fontSize: 14, color: mainColor }} />
          {news.viewCount}
        </Typography>
      </Box>
    </Box>
  );
};

export default NewsRecently;