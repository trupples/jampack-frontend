import './TagsList.css';
import { useState, useEffect } from 'preact/hooks';
import { get, post } from '../api.ts';
import fuzzysort from 'fuzzysort'

export default function TagsList() {
	const [tags, setTags] = useState([]);
	const [search, setSearch] = useState("");
	const [topUp, setTopUp] = useState(null);
	const [topUpProgress, setTopUpProgress] = useState("");

	function changeTopUp(x) {
		setTopUpProgress('');
		setTopUp(x);
	}

	function refreshTags() {
		get('tags').then(({tags}) => setTags(tags));
	}

	useEffect(refreshTags, []);

	function doTopUp(tagId, amount) {
		setTopUpProgress('Topping up...');

		post(`tag/${tagId}/topUp`, {
				'amount': amount
		}).then(_ => {
			setTopUpProgress('OK!');
			refreshTags();
		}).catch(e => {
			setTopUpProgress(e);
		})
	}

	const filteredTags = fuzzysort.go(search, tags, {
		key: 'name',
		all: true
	});

	const topUpTag = topUp ? tags.filter(tag=>tag.id == topUp)[0] : null;

	return <div id='tags-list'>
		<input type='text' placeholder='Search' onInput={e => setSearch(e.target.value)} />
		<table>
			<thead>
				<tr><th>Name</th><th>Balance</th></tr>
			</thead>
			<tbody>
			{ filteredTags.map(tag => {
				const hname = search ? fuzzysort.highlight(tag, (m, i) => (<b>{m}</b>)) : tag.obj.name;

				return (
					<tr class='tag-card'>
						<td class='tag-name'>{hname}</td>
						<td class='tag-balance'>{tag.obj.balance}</td>
						<td class='top-up'><button onClick={_=>changeTopUp(tag.obj.id)}>Top up!</button></td>
					</tr>
				);
			}) }
			</tbody>
		</table>
		{
			topUpTag ? (<>
				<div id='top-up-blackout' onClick={_=>changeTopUp(null)}></div>
				<form id='top-up-modal' onSubmit={e=>{e.preventDefault(); doTopUp(topUpTag.id, document.querySelector('#top-up-amount').value)}}>
					<h1>Top up</h1>
					<h2>{topUpTag.name} ({topUpTag.id})</h2>
					
					<p>Current balance: {topUpTag.balance}</p>

					<input id='top-up-amount' type='number' placeholder='Token count' value='0' />
					<button type='submit' disabled={!!topUpProgress}>{!topUpProgress ? 'Add tokens' : topUpProgress}</button>
				</form>
			</>) : []
		}
	</div>;
}
