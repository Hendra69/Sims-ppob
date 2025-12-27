import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../Features/userSlice';
import homeReducer from "../Features/homeSlice";
import topupReducer from "../Features/topupSlice";
import transactionReducer from "../Features/transactionSlice";
import historyReducer from "../Features/transactionHistorySlice";
import accountReducer from "../Features/accountSlice"; 






export default configureStore({
    reducer: {
        user: userReducer,
        home: homeReducer,
        topup: topupReducer,
        transaction: transactionReducer,
        history: historyReducer,
        account: accountReducer,


    },
});