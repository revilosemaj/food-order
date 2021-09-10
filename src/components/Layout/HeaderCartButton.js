import { useContext, useState, useEffect } from "react";
import CartContext from "../../store/cart-context";
import CartIcon from "../Cart/CartIcon";
import classes from './HeaderCartButton.module.css';

const HeaderCartButton = (props) => {
    const [btnCartIsHighlighted, setBtnCartIsHighlighted] = useState(false);
    const { items } = useContext(CartContext);
    const numberOfCartItems = items.reduce((currNumber, item) => currNumber + item.amount, 0);
    const btnClasses = `${classes.button} ${btnCartIsHighlighted ? classes.bump : ''}`;

    useEffect(() => {
        if (items.length === 0) {
            return;
        }

        setBtnCartIsHighlighted(true);

        const timer = setTimeout(() => {
            setBtnCartIsHighlighted(false);
        }, 300);

        return () => {
            clearTimeout(timer);
        }
    }, [items]);

    return <button className={btnClasses} onClick={props.onClick}>
        <span className={classes.icon}>
            <CartIcon />
        </span>
        <span>Your Cart</span>
        <span className={classes.badge}>{numberOfCartItems}</span>
    </button>
}

export default HeaderCartButton