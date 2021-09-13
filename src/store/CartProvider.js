import { useReducer } from "react";
import CartContext from "./cart-context";

const defaultState = {
    items: [],
    totalAmount: 0
}

const cartReducer = (state, action) => {
    if (action.type === "ADD") {
        const updatedTotalAmount = state.totalAmount + action.item.price * action.item.amount;

        const existingCartItemIndex = state.items.findIndex(item => item.id === action.item.id);
        const existingCartItem = state.items[existingCartItemIndex];
        let updatedItems;

        if (existingCartItem) {
            const updatedItem = {
                ...existingCartItem,
                amount: existingCartItem.amount + action.item.amount
            }

            updatedItems = [...state.items];
            updatedItems[existingCartItemIndex] = updatedItem
        } else {
            updatedItems = state.items.concat(action.item);
        }

        return {
            items: updatedItems,
            totalAmount: updatedTotalAmount
        }
    }

    if (action.type === "REMOVE") {
        const existingCartItemIndex = state.items.findIndex(item => item.id === action.id);
        const existingCartItem = state.items[existingCartItemIndex];
        let updatedTotalAmount = state.totalAmount - state.items[existingCartItemIndex].price;
        let updatedItems;

        if (existingCartItem.amount === 1) {
            updatedItems = state.items.filter(item => item.id !== action.id);
        } else {
            const updatedItem = {
                ...state.items[existingCartItemIndex],
                amount: existingCartItem.amount - 1
            }

            updatedItems = [...state.items];
            updatedItems[existingCartItemIndex] = updatedItem;
        }

        if (state.totalAmount < 1) {
            updatedTotalAmount = 0;
        }

        return {
            items: updatedItems,
            totalAmount: updatedTotalAmount
        }
    }

    if (action.type === 'CLEAR') {
        return defaultState;
    }

    return defaultState;
}

const CartProvider = props => {
    const [cartState, dispatchCart] = useReducer(cartReducer, defaultState)
    const addCartItemHandler = item => {
        dispatchCart({ type: "ADD", item: item });
    }

    const removeCartItemHandler = id => {
        dispatchCart({ type: "REMOVE", id: id });
    }

    const clearCartItemHandler = () => {
        dispatchCart({ type: "CLEAR" });
    }

    const cartContext = {
        items: cartState.items,
        totalAmount: cartState.totalAmount,
        addItems: addCartItemHandler,
        removeItems: removeCartItemHandler,
        clearItems: clearCartItemHandler
    }

    return <CartContext.Provider value={cartContext}>
        {props.children}
    </CartContext.Provider>
}

export default CartProvider;