import './FinishPayment.css';
import { useState } from 'preact/hooks';
import { post } from '../api.ts';

export default function FinishPayment({ id }) {
	const [checkoutItems, setCheckoutItems] = useState(null);
	const [status, setStatus] = useState('Paying...');
	const [error, setError] = useState(null);
	if(!id) id = window.location.search.substr(1);

	if(localStorage['checkout'] && !checkoutItems) {
		const checkoutItems = Array.from(JSON.parse(localStorage['checkout']));
		console.log(checkoutItems)
		setCheckoutItems(checkoutItems);

		post('checkout', {
			user: id,
			iids: checkoutItems.map(({ item, quantity }) => item.id),
			qtys: checkoutItems.map(({ item, quantity }) => quantity),
		}).catch(err => {
			setError(err);
		}).then(resp => {
			setStatus(resp.message);
			delete localStorage['checkout'];
		});
	}

	if(!checkoutItems) return '';

	let total = 0;
	return <div id="cart-items">
		<hr/>
		<table>
		{ Object.values(checkoutItems).map(({ item, quantity }) => {
			total += quantity * item.cost;

			return ( <tr>
				<td class="qty">{quantity}</td>
				<td class="name">{item.name}</td>
				<td class="total">{quantity * item.cost}</td>
			</tr> );
		}) }
		</table>
		<b>Total: {total}</b>
		{error ? <p class='error'>Payment error: {error}</p> : status ? <><p class='status'>{status}</p><a href='/sell'>Go back to /sell</a></> : ''}
	</div>;
}
