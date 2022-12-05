import { get, post } from '../api.ts';
import { useState, useEffect } from 'preact/hooks';

export default function UserCard({ id }) {
	const [tag, setTag] = useState(null);
	const [topUpProgress, setTopUpProgress] = useState('');
	if(!id) id = window.location.search.substr(1);

	function getTag() {
		get(`tag/${encodeURIComponent(id)}`).then(tag => {
			setTag(tag)
		});
	}

	useEffect(_ => {
		getTag();
	}, []);

	if(tag === null) {
		return <p>Loading...</p>;
	}
	if(!tag.name) {
		return <p class='error'>No data found</p>
	}

	function doTopUp(tagId, amount) {
		setTopUpProgress('Topping up...');

		post(`tag/${tagId}/topUp`, {
			'amount': amount
		}).then(_ => {
			setTopUpProgress('Top-up OK!');
			getTag();
		}).catch(e => {
			setTopUpProgress(e);
		})
	}

	return (<>
		<h1>{tag.name}</h1>
		<p>Balance: {tag.balance}</p>
		{ localStorage.authLevel && localStorage.authLevel.includes('TAGS_TOPUP') ?
		<form id='top-up' onSubmit={e=>{e.preventDefault(); doTopUp(id, document.querySelector('#top-up-amount').value)}}>
			<h1>Top up</h1>
			<input id='top-up-amount' type='number' placeholder='Token count' value='0' />
			<button type='submit' disabled={!!topUpProgress}>{!topUpProgress ? 'Add tokens' : topUpProgress}</button>
		</form> : '' }
	</>);
}
