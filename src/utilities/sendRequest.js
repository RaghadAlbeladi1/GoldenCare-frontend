export default async function sendRequest(url, method = 'GET', payload) {
	let accessToken = localStorage.getItem('accessToken');
	const refreshToken = localStorage.getItem('refreshToken');

	const requestOptions = { method: method };
	requestOptions.headers = {};

	if (accessToken) {
		requestOptions.headers['Authorization'] = `Bearer ${accessToken}`;
	}

	if (payload) {
		requestOptions.headers['Content-Type'] = 'application/json';
		requestOptions.body = JSON.stringify(payload);
	}

	try {
		const response = await fetch(`http://localhost:8000${url}`, requestOptions);
		
		if (response.status === 401 && refreshToken) {
			try {
				const refreshResponse = await fetch('http://localhost:8000/users/token/refresh/', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ refresh: refreshToken })
				});
				
				if (refreshResponse.ok) {
					const newTokenData = await refreshResponse.json();
					localStorage.setItem('accessToken', newTokenData.access);
					accessToken = newTokenData.access;
					
					requestOptions.headers.Authorization = `Bearer ${accessToken}`;
					const retryResponse = await fetch(`http://localhost:8000${url}`, requestOptions);
					
					if (!retryResponse.ok) {
						const errorData = await retryResponse.json().catch(() => ({ error: `HTTP ${retryResponse.status}: ${retryResponse.statusText}` }));
						throw errorData;
					}
					return await retryResponse.json();
				} else {
					const refreshError = await refreshResponse.json().catch(() => ({ error: "Refresh failed" }));
					localStorage.removeItem('accessToken');
					localStorage.removeItem('refreshToken');
					throw { error: 'Session expired. Please login again.', status: 401 };
				}
			} catch (refreshError) {
				localStorage.removeItem('accessToken');
				localStorage.removeItem('refreshToken');
				throw { error: 'Session expired. Please login again.', status: 401 };
			}
		}
		
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}: ${response.statusText}` }));
			throw errorData;
		}
		return await response.json();
	} catch (error) {
		if (error instanceof TypeError && error.message.includes('fetch')) {
			throw new Error("Failed to fetch. Please make sure the backend server is running on http://localhost:8000");
		}
		throw error;
	}
}


