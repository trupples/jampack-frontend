export function post(location, data) {
	return fetch(import.meta.env.PUBLIC_APIURL + '/' + location, {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: Object.entries(data).map(([k, v]) => {
			if(Array.isArray(v)) {
				return v.map(item => encodeURIComponent(k) + '[]=' + encodeURIComponent(item)).join('&');
			} else {
				return encodeURIComponent(k) + '=' + encodeURIComponent(v);
			}
		}).join('&')
	}).then(resp => resp.json()).then(resp => {
		console.log(resp);
		if(resp.error)
			if(resp.error.includes('auth'))
				window.location = '/auth?error=' + encodeURIComponent(resp['error']);
			else
				throw resp;
		return resp;
	});
}

export function get(location, data) {
	return fetch(import.meta.env.PUBLIC_APIURL + '/' + location, {
		'method': 'GET',
		credentials: 'include',
	}).then(resp => resp.json()).then(resp => {
		if(resp.error)
			if(resp.error.includes('auth'))
				window.location = '/auth?error=' + encodeURIComponent(resp['error']);
			else
				throw resp;
		return resp;
	});
}
