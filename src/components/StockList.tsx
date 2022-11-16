import './StockList.css';
import { useState, useEffect } from 'preact/hooks';
import { get } from '../api.ts';

export default function StockList() {
	const [stock, setStock] = useState([]);

	useEffect(_ => {
		console.log('salut')
		get('stock').then(resp => {
			const stock = resp.items;

			setStock(resp.items)
		});
	}, []);

	function changeImage(itemId) {
		console.log('Change image for ', itemId)
	}

	return <div id="StockList">
		<h1>Stock - this page does not yet work. Use SQL biatch</h1>
		
		{ !stock.length ? 'Loading...' : '' }
		<ul>
			{ stock.map((item) => {
				console.log(item)
				return <li class='item-card'>
					<form onSubmit={e => e.preventDefault()}>
						<button onClick={_=>changeImage(item.id)} class='item-image'><img width='200' src={`${import.meta.env.PUBLIC_APIURL}/item/${item.id}.jpg`} /></button>
						<input class='item-name' type='text' name='name' value={item.name}></input>
						<input class='item-cost' type='number' name='cost' value={item.cost}></input>
						<span class='item-sold'>Sold: {item.sold}</span>
						<div class='buttons'><button disable='disable'>Update</button><button style='background: #ff808040'>Delete</button></div>
					</form>
				</li>;
			}) }
		</ul>
		<div class='item-card'>
		<h1>Add new item</h1>
		<form onSubmit={e => e.preventDefault()}>
			<button onClick={_=>changeImage(null)} class='item-image'><img width='200' src='/newphoto.png' /></button>
			<label class='item-name'>Name: <input type='text' name='name'></input></label>
			<label class='item-cost'>Cost: <input type='number' name='cost'></input></label>
			<div class='buttons'><button disable='disable'>Add new item</button></div>
		</form>
		</div>
	</div>;
}