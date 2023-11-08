import { Avatar, Box, Divider, Typography } from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import { mainColor } from "../../../../constants/colors";
import { AIImage } from "../../../../constants/images";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { selectUser } from "../../../../redux/slices/messageSlice";
import { messageActions } from "../../../../actions/messageAction";
import { RootState } from "../../../../redux/store";
import { socket } from "../../../../utils/api/socketConfirm";
import { useEffect } from "react";

const AIData = {
  user: {
    _id: "AI",
    name: "AI tư vấn",
    avatar: AIImage,
  },
  lastMessage: "",
  time: "now",
  seen: true,
};

const data = [
  {
    user: {
      id: "654367fa7a19c5bddd7a1edb",
      name: "Hỗ trợ",
      avatar:
        "https://e7.pngegg.com/pngimages/381/746/png-clipart-customer-service-technical-support-help-desk-customer-support-management-miscellaneous-service-thumbnail.png",
    },
    lastMessage: "24/7",
    time: "10:11",
    seen: false,
  },
];

const ListItem = (data: any) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.user.user);

  const handleSelect = () => {
    dispatch(selectUser(data));
    dispatch(messageActions.get({ from: user?._id!, to: data.user.id }));
  };

  useEffect(() => {
    socket.on("message-recieve", (data) => {
      user &&
        dispatch(
          messageActions.get({
            from: data.from,
            to: data.to,
          })
        );
    });
  }, [dispatch, user]);

  return (
    <Box sx={{ cursor: "pointer" }} onClick={handleSelect}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          paddingTop: 2,
          pr: 2,
        }}
      >
        <Avatar src={data.user?.avatar} />
        <Box width={"100%"}>
          <Box
            width={"100%"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography fontWeight={600}>
              {data.user.name.length > 10
                ? data.user.name.slice(0, 10) + "..."
                : data.user.name}
            </Typography>
            {data.seen && (
              <Box component={"li"} sx={{ color: mainColor }}></Box>
            )}
            <Typography
              fontWeight={600}
              color={"#777"}
              fontSize={13}
              fontStyle={"italic"}
            >
              {data.time}
            </Typography>
          </Box>
          <Typography fontSize={14} color={!data.seen ? "#555" : "#000"}>
            {data.lastMessage.length > 16
              ? data.lastMessage.slice(0, 16) + "..."
              : data.lastMessage}
          </Typography>
        </Box>
      </Box>
      <Divider variant="middle" sx={{ pt: 1 }} />
    </Box>
  );
};

function List() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
        <ListIcon />
        <Typography fontWeight={600}>Danh sách</Typography>
      </Box>
      <Box sx={{ overflowY: "auto", height: "90%" }}>
        <ListItem {...AIData} />
        {data.map((d, i) => (
          <ListItem {...d} key={i} />
        ))}
      </Box>
    </Box>
  );
}

export default List;
