import { NavigateOptions, useNavigate } from "react-router-dom";
import { ProductType } from "../../types/productType";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Rating,
  Typography,
} from "@mui/material";
import { mainColor, secColor } from "../../utils/Constants/colors";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { moneyFormat } from "../../utils/handlers/moneyFormat";
import { memo, useCallback, useEffect, useState } from "react";
import { InitialShop, ShopType } from "../../types/shopType";
import { shopAPI } from "../../utils/api/shopApi";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { cartActions } from "../../actions/cartActions";
import { RootState } from "../../redux/store";
import { favoriteActions } from "../../actions/favoriteActions";
interface ProductCardType {
  product: ProductType;
  fast?: boolean;
  width?: number;
}

const ProductCard = memo(
  ({ product, fast = false, width = 400 }: ProductCardType) => {
    const [shopInfo, setShopInfo] = useState<ShopType>(InitialShop);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const userId = useAppSelector((state: RootState) => state.user.user)._id;
    const stateShopInfo = { shopInfo } as NavigateOptions;
    const stateProduct = { product } as NavigateOptions;

    useEffect(() => {
      const getShopInfo = async () => {
        try {
          const rs = await shopAPI.get(product.shop);
          setShopInfo(rs.data);
        } catch (error) {
          return false;
        }
      };
      getShopInfo();
    }, [product.shop]);

    const handleAddCart = useCallback(() => {
      dispatch(
        cartActions.addProductToCart({
          userId: userId as string,
          product: { ...product, count: 1 },
        })
      );
    }, [product, userId, dispatch]);

    const handleAddFavorite = () => {
      dispatch(
        favoriteActions.update({
          userId: userId as string,
          productId: product._id as string,
        })
      );
    };

    const handleCompare = () => {};

    return (
      <Paper
        variant="outlined"
        sx={{
          ":hover": {
            outline: `1px solid ${mainColor}`,
          },
          borderRadius: 5,
          width,
        }}
      >
        <Box
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"space-between"}
          height={35}
        >
          {product?.discount > 0 && (
            <Typography
              p={1}
              fontSize={12}
              bgcolor={secColor}
              sx={{
                borderTopLeftRadius: 20,
                borderBottomRightRadius: 20,
                width: 60,
                color: "white",
                fontWeight: 600,
              }}
              align="center"
            >
              -{product.discount}%
            </Typography>
          )}

          {/* product fast */}
          {fast && (
            <Typography
              p={1}
              fontSize={12}
              bgcolor={mainColor}
              sx={{
                borderTopRightRadius: 20,
                borderBottomLeftRadius: 20,
                width: 120,
                color: "white",
                fontWeight: 600,
                right: 0,
                float: "right",
                ml: "auto",
              }}
              align="center"
            >
              đã bán: {product.sold}
            </Typography>
          )}
        </Box>

        <img
          src={product.images[0]}
          alt={product.title}
          style={{
            width: "100%",
            height: 400,
            objectFit: "cover",
            cursor: "pointer",
          }}
          onClick={() =>
            navigate(`/san-pham/details/` + product.title, {
              state: stateProduct,
            })
          }
        />

        <Box p={2} display={"flex"} flexDirection={"column"} gap={1}>
          <Typography
            fontSize={11}
            color={"#555"}
            sx={{ textTransform: "capitalize" }}
          >
            {product.category}
          </Typography>
          <Typography
            onClick={() =>
              navigate(`/san-pham/details/` + product.title, {
                state: stateProduct,
              })
            }
            fontWeight={600}
            fontSize={18}
            sx={{
              cursor: "pointer",
              textDecoration: "none",
              color: "#000",
              height: 45,
              textTransform: "capitalize",
            }}
          >
            {product.title}
          </Typography>
          <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
            <Rating
              name="half-rating"
              defaultValue={product.star.count}
              precision={0.5}
              readOnly
            />
            <Typography fontSize={12} color={"#555"}>
              {" "}
              ({product.star.count})
            </Typography>
          </Box>
          <Typography fontSize={13} color={"#555"}>
            Bán bởi
            <b
              style={{
                color: mainColor,
                cursor: "pointer",
                textTransform: "capitalize",
              }}
              onClick={() =>
                navigate("/cua-hang/" + product.shop, { state: stateShopInfo })
              }
            >
              {" "}
              {shopInfo.name}
            </b>
          </Typography>

          {/* price */}
          <Box
            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            flexWrap={"wrap"}
          >
            <Typography fontSize={30} color={mainColor} fontWeight={600}>
              {moneyFormat(product.lastPrice)}
              <span
                style={{
                  fontSize: 25,
                  color: "#ddd",
                  textDecoration: "line-through",
                }}
              >
                {moneyFormat(product.price)}
              </span>
            </Typography>
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={handleAddCart}
            >
              <AddShoppingCartIcon /> Thêm
            </Button>
          </Box>
        </Box>
        <Box
          p={1}
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"space-around"}
        >
          <IconButton
            color="error"
            title="Thêm sản phẩm yêu thích"
            onClick={handleAddFavorite}
          >
            <FavoriteBorderIcon />
          </IconButton>
          <IconButton color="primary" title="So sánh" onClick={handleCompare}>
            <ShuffleIcon />
          </IconButton>
        </Box>
      </Paper>
    );
  }
);

export default ProductCard;
