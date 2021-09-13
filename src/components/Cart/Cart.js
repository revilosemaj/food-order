import { useContext, useState, Fragment } from 'react';
import Modal from '../UI/Modal/Modal';
import CartContext from '../../store/cart-context';
import CartItem from './CartItem';
import classes from './Cart.module.css';
import Checkout from './Checkout';

const { REACT_APP_FIREBASE_API } = process.env;

const Cart = props => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [didSubmit, setDidSubmit] = useState(false);
    const [isCheckout, setIsCheckout] = useState(false)
    const cartCtx = useContext(CartContext);
    const cartTotalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
    const hasItems = cartCtx.items.length > 0;

    const cartItemAddHandler = item => {
        cartCtx.addItems(item)
    }

    const cartItemRemoveHandler = id => {
        cartCtx.removeItems(id);
    }

    const orderHandler = () => {
        setIsCheckout(true)
    }

    const confirmOrderHandler = userData => {
        setIsSubmitting(true);
        fetch(`${REACT_APP_FIREBASE_API}orders.json`, {
            method: 'POST',
            body: JSON.stringify({
                userData: userData,
                orders: cartCtx.items
            })
        });

        setIsSubmitting(false);
        setDidSubmit(true);
        cartCtx.clearItems();
    }

    const cartItems = <ul className={classes['cart-items']}>
        {
            cartCtx.items.map(item =>
                <CartItem
                    key={item.id}
                    {...item}
                    onAdd={cartItemAddHandler.bind(null, item)}
                    onRemove={cartItemRemoveHandler.bind(null, item.id)}
                />
            )
        }
    </ul>

    const modalActions = <div className={classes.actions}>
        <button className={classes['button--alt']} onClick={props.onClose}>Close</button>
        {hasItems && <button className={classes.button} onClick={orderHandler}>Order</button>}
    </div>

    const cartItemsModalContent = <Fragment>
        {cartItems}
        <div className={classes.total}>
            <span>Total Amount</span>
            <span>{cartTotalAmount}</span>
        </div>
        {isCheckout && <Checkout onConfirm={confirmOrderHandler} onCancel={props.onClose} />}
        {!isCheckout && modalActions}
    </Fragment>

    const isSubmittingModalContent = <p>Sending data...</p>;
    const didSubmitModalContent = <Fragment>
        <p>Sending data successfully!</p>
        <div className={classes.actions}>
            <button className={classes.button} onClick={props.onClose}>Close</button>
        </div>
    </Fragment>;

    return (
        <Modal onClose={props.onClose}>
            {!isSubmitting && !didSubmit && cartItemsModalContent}
            {isSubmitting && isSubmittingModalContent}
            {!isSubmitting && didSubmit && didSubmitModalContent}
        </Modal>
    )
}

export default Cart;