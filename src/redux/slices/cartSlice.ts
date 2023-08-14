import { createSlice } from "@reduxjs/toolkit";
import {
  getItem,
  removeItem,
  setItem,
} from "../../utils/handlers/tokenHandler";
import { cartActions } from "../../actions/cartActions";
import { FulfilledAction, PendingAction, RejectedAction } from "./silceType";
import { CartType, InitialCart, ProductCartType } from "../../types/cartType";

interface InitialType {
  data: CartType;
  loading: boolean;
}
const initialState: InitialType = {
  data: getItem("cart") || InitialCart,
  loading: false,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.data = InitialCart;
      removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(cartActions.getCart.fulfilled, (state, action) => {
        if (action.payload) {
          state.data = action.payload;
          setItem("cart", action.payload);
        }
      })
      .addCase(cartActions.addProductToCart.fulfilled, (state, action) => {
        if (!action.payload) return;

        const productsInCart: ProductCartType[] = state.data?.products || [];
        const indexProduct = productsInCart.findIndex(
          (product) => product._id === action.meta.arg.product._id
        );

        let cartProductUpdate = [...productsInCart];
        // if product existed in cart
        if (indexProduct !== -1) {
          cartProductUpdate[indexProduct] = {
            ...cartProductUpdate[indexProduct],
            count: cartProductUpdate[indexProduct].count + 1,
          };
        } else {
          cartProductUpdate.push(action.meta.arg.product);
        }
        state.data = { ...state.data, products: cartProductUpdate };
      })
      .addCase(cartActions.downCountProduct.fulfilled, (state, action) => {
        if (!action.payload) return;
        const indexProduct = state.data.products.findIndex(
          (product) => product._id === action.meta.arg.productId
        );
        let currentProduct = { ...state.data.products[indexProduct] };
        currentProduct = { ...currentProduct, count: currentProduct.count - 1 };
        if (currentProduct.count > 0) {
          state.data.products[indexProduct] = currentProduct;
        } else {
          state.data.products.splice(indexProduct, 1);
        }
        setItem("cart", state.data);
      })
      .addCase(cartActions.upCountProduct.fulfilled, (state, action) => {
        if (!action.payload) return;
        const updatedProducts = state.data.products.map((product) => {
          if (product._id === action.meta.arg.productId) {
            return {
              ...product,
              count: product.count + 1,
            };
          }
          return product;
        });

        const updatedCart = {
          ...state.data,
          products: updatedProducts,
        };

        setItem("cart", updatedCart);

        return {
          ...state,
          data: updatedCart,
        };
      })
      .addCase(cartActions.removeProduct.fulfilled, (state, action) => {
        if (!action.payload) return;
        const indexProduct = state.data.products.findIndex(
          (product) => product._id === action.meta.arg.productId
        );

        state.data.products.splice(indexProduct, 1);
        setItem("cart", state.data);
      })
      .addMatcher<PendingAction>(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher<FulfilledAction | RejectedAction>(
        (action) =>
          action.type.endsWith("/fulfilled") ||
          action.type.endsWith("/rejected"),
        (state) => {
          state.loading = true;
        }
      );
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;