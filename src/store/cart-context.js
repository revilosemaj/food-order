import { createContext } from 'react';

const CartContext = createContext({
    items: [],
    totalAmount: 0,
    addItems: item => { },
    removeItems: id => { }
})

export default CartContext;