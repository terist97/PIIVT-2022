import { configureStore } from "@reduxjs/toolkit";

export interface ICartStoreData {
    role: "visitor" | "user" | "administrator";
    identity: string;
    id: number;
    authToken: string;
    refreshToken: string;
}

const DefaultCartStoreData: ICartStoreData = {
    role: "visitor",
    identity: "",
    id: 0,
    authToken: "",
    refreshToken: "",
}

let InitialCartStoreData: ICartStoreData = DefaultCartStoreData;

(() => {
    if (!localStorage.getItem("app-auth-store-data")) {
        return;
    }
    const storedData = JSON.parse(localStorage.getItem("app-auth-store-data") ?? "{}");

    if (typeof storedData !== "object") {
        return;
    }

    InitialCartStoreData = { ...InitialCartStoreData, ...storedData };
})();


type TUpdateRole = { type: "update", key: "role", value: "visitor" | "user" | "administrator" };
type TUpdateId = { type: "update", key: "id", value: number };
type TUpdateStrings = { type: "update", key: "identity" | "authToken" | "refreshToken", value: string };
type TReset = { type: "reset" };

type TCartStoreAction = TUpdateRole | TUpdateId | TUpdateStrings | TReset;

function CartStoreReducer(state: ICartStoreData = InitialCartStoreData, action: TCartStoreAction): ICartStoreData {
    switch (action.type) {
        case "update": return { ...state, [action.key]: action.value } as ICartStoreData;
        case "reset": return { ...DefaultCartStoreData };
        default: return { ...state } as ICartStoreData;
    }
}

const CartStore = configureStore({
    reducer: CartStoreReducer
});

CartStore.subscribe(() => {
    localStorage.setItem('app-auth-store-data', JSON.stringify(CartStore.getState()));
});

export type TCartStoreDispatch = typeof CartStore.dispatch;
export default CartStore;