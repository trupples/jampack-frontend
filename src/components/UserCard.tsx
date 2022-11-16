import { get } from '../api.ts';
import { useState, useEffect } from 'preact/hooks';

export default function UserCard({ id }) {
	const [tag, setTag] = useState(null);
	if(!id) id = window.location.search.substr(1);

	useEffect(_ => {
		get(`tag/${encodeURIComponent(id)}`).then(tag => {
			setTag(tag)
		});
	}, []);

	if(tag === null) {
		return <p>Loading...</p>;
	}
	if(!tag.name) {
		return <p class='error'>No data found</p>
	}

	return (<>
		<h1>{tag.name}</h1>
		<p>Balance: {tag.balance}</p>
	</>);
}
