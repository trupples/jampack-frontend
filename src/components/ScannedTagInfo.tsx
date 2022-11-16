import './ScannedTagInfo.css';

export default function ScannedTagInfo() {
	const uid = window.location.search.substr(1).toLowerCase();
	if(!uid) {
		window.location = '/';
	}

	//const tagData = await (await fetch(`/api/tags/${uid}`)).json();

	const pendingPurchase = localStorage.getItem('pendingPurchase');
	if(!pendingPurchase) {
		console.log('No pending purchase');
	}

	return (<div id="scanned-tag-info">
		<h1>Scanned tag</h1>
		<p>UID: <kbd>{uid}</kbd></p>
	</div>);
}
