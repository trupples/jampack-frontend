import './ItemsList.css';
import { addToCart } from '../cartStore.ts';
import { useState, useEffect } from 'preact/hooks';
import { get } from '../api.ts';

export default function ItemsList() {
	const [items, setItems] = useState([]);
	
	useEffect(_=> get('items').then(({items}) => setItems(items)), []);

	return (
		<ul id='items-list'>
			{ items.map(item => (
				<li class='item-card'>
					<button onClick={_ => addToCart(item)}>
						<img src={`${import.meta.env.PUBLIC_APIURL}/item/${item.id}.jpg`} width='200' />
						<span class='item-name'>{item.name}</span>
						<span class='item-price'>{item.cost}</span>
					</button>
				</li>
			)) }
			{ items ? '' : 'Loading...'}
		</ul>
	);
}
