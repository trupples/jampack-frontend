import { useStore } from '@nanostores/preact';
import { cartItems, removeFromCart, disableCart, disableCartFlag } from '../cartStore.ts';
import { useState, useEffect } from 'preact/hooks';
import './CartView.css';

export default function CartView() {
	const $cartItems = useStore(cartItems);
	const [status, setStatus] = useState('Pay');

	useEffect(_ => {delete localStorage['checkout'];}, [])

	function checkout() {
		disableCart();
		localStorage['checkout'] = JSON.stringify(Object.values($cartItems));
		setStatus('Scan to pay');
	}

	let total = 0;

	return (
		<div id="cart-view">
			<h1>Cart</h1>
			<div id="cart-items">
				<table>
				{ Object.values($cartItems).map(({ item, quantity }) => {
					total += quantity * item.cost;

					return ( <tr>
						<td class="rem"><button onClick={_ => removeFromCart(item)}>(&ndash;)</button></td>
						<td class="qty">{quantity}</td>
						<td class="name">{item.name}</td>
						<td class="total">{quantity * item.cost}</td>
					</tr> );
				}) }
				</table>
			</div>
			<button type="submit" disabled={!Object.keys($cartItems).length || disableCartFlag} onClick={checkout}>{status} {total}</button>
		</div>
	);
}
