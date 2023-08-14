import { createSlice } from "@reduxjs/toolkit";
import { InitialProduct, ProductType } from "../../types/productType";
import { productActions } from "../../actions/productActions";
import { FulfilledAction, PendingAction, RejectedAction } from "./silceType";

interface InitialStateProps {
  products: Array<ProductType>;
  product: ProductType;
  shopProducts: {
    products: ProductType[];
    totalProducts: number;
  };
  totalProducts: number;
  loading: boolean;
  modal: {
    data?: ProductType;
    open: boolean;
  };
}

const initialState: InitialStateProps = {
  products: [],
  product: InitialProduct,
  shopProducts: { products: [], totalProducts: 0 },
  totalProducts: 0,
  loading: false,
  modal: {
    data: undefined,
    open: false,
  },
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProductModal: (state, action) => {
      state.modal = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(productActions.gets.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.totalProducts = action.payload.totalProducts;
      })
      .addCase(productActions.get.fulfilled, (state, action) => {
        state.product = action.payload;
      })
      .addCase(productActions.create.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(productActions.update.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        if (index !== 1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(productActions.delete.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (product) => product._id === action.meta.arg._id
        );
        state.products.splice(index, 1);
      })
      .addCase(productActions.getShopProducts.fulfilled, (state, action) => {
        state.shopProducts = action.payload;
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
          state.loading = false;
        }
      );
  },
});

export const { setProductModal } = productSlice.actions;
export default productSlice.reducer;
function produce(state: (draftState: any) => void, arg1: unknown) {
  throw new Error("Function not implemented.");
}