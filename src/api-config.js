let backendHost;
const hostname = window && window.location && window.location.hostname;
if (hostname === '{STAGING_HOST}') {
	backendHost = '{STAGING_HOST_URL}';
} else if (hostname === '{PROD_HOST}') {
	backendHost = '{PROD_HOST_URL}';
} else {
	backendHost = 'http://localhost:8000';
}

const apiVersion = 'v1';
export const API_ROOT = `${backendHost}/ehr/${apiVersion}`;