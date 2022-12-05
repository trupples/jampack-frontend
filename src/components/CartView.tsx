import { useStore } from '@nanostores/preact';
import { cartItems, removeFromCart, disableCart, disableCartFlag } from '../cartStore.ts';
import { useState, useEffect } from 'preact/hooks';
import { post } from '../api.ts';
import './CartView.css';

export default function CartView() {
	const $cartItems = useStore(cartItems);
	const [status, setStatus] = useState('Pay');
	const [modal, setModal] = useState(null);

	function scanned() {
		if(!(localStorage.scanTime > Date.now() - 5000)) return;

		window.removeEventListener('storage', scanned);

		const id = localStorage.scan;
		delete localStorage.scan;
		delete localStorage.scanTime;

		post('checkout', {
			user: id,
			iids: Object.values($cartItems).map(({ item, quantity }) => item.id),
			qtys: Object.values($cartItems).map(({ item, quantity }) => quantity),
		}).then(({ message, prev_balance, current_balance }) => {
			setModal(<><h1>Accepted!</h1><p>{message}</p><p>Previous balance: {prev_balance}</p><p>Current balance: {current_balance}</p></>);
		}, ({ error, current_balance }) => {
			setModal(<><h1>Error!</h1><p>{error}</p><p>Balance: {current_balance}</p></>);
		});
	}

	function checkout() {
		disableCart();
		setStatus('Scan to pay');
		localStorage.needScan = true;
		window.addEventListener('storage', scanned);
	}

	let total = 0;

	return <>
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
		{ modal ? <><div id="checkout-modal">
			{ modal }
			<a href='#' onclick={_=>window.location.reload()}>Ok, refresh</a>
		</div><div id="checkout-modal-backdrop"></div></> : '' }
	</>;
}
