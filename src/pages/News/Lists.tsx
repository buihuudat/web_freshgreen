import { Box, Typography } from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";
import NewsItem from "../../components/common/NewsItem";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";

const NewsLists = () => {
  const newsList = useAppSelector((state: RootState) => state.news.newsList);

  return (
    <Box>
      <Box
        display={"flex"}
        flexDirection={"row"}
        alignItems={"center"}
        gap={3}
        fontFamily={"Nunito"}
      >
        <StoreIcon sx={{ fontSize: 60 }} color="success" />
        <Typography fontWeight={600} fontSize={32}>
          Blog List
        </Typography>
      </Box>
      <Box display={"flex"} flexDirection={"column"} gap={3}>
        {newsList.map((news, index) => (
          <NewsItem news={news} key={index} />
        ))}
      </Box>
    </Box>
  );
};

export default NewsLists;