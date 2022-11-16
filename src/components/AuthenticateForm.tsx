import './AuthenticateForm.css';
import { post } from '../api.ts';
import { useState, useEffect } from 'preact/hooks';

export default function AuthenticateForm() {
	const [error, setError] = useState("");

	useEffect(_ => {
		setError((new URLSearchParams(window.location.search)).get("error") || "");
	}, []);

	const auth = (e) => {
		e.preventDefault();

		post("authenticate", {'totp': codeInput.value}).then(resp => {
			if('error' in resp) {
				setError(resp[error]);
			} else {
				window.location = '/';
			}
		});
	}

	return (
		<form onSubmit={auth}>
			{ error ? <div class="error">{error}</div> : "" }
			<p>Authenticate to JAMpack using the Time-based One Time Password you were given</p>
			<input type="text" size="6" id="codeInput" placeholder="code" />
			<button type="submit">Authenticate</button>
		</form>
	);
}
