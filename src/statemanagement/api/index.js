// fetch data from api
import axios from 'axios'
let baseURL;
// check if not production
if (process.env.NODE_ENV !== 'production') {
    baseURL = process.env.REACT_APP_BASE_URL_LOCAL;
} else {
    baseURL = process.env.REACT_APP_BASE_URL;
}
axios.defaults.withCredentials = true;
function normalizeBaseURL(raw) {
    if (!raw) return null;
    let v = String(raw).trim();
    // strip surrounding quotes
    v = v.replace(/^['"]|['"]$/g, '');
    // if contains whitespace/newlines, pick a reasonable token
    const tokens = v.split(/\s+/).filter(Boolean);
    if (tokens.length > 1) {
        // prefer tokens that look like a hostname (contain a dot) or known hosts
        const prefer = tokens.find(t => /railway|heroku|vercel|up\.railway|api|backend|http/i.test(t) || t.includes('.')) || tokens[0];
        v = prefer;
        console.warn('REACT_APP_BASE_URL contains multiple tokens; using:', v, 'original:', raw);
    }
    // if contains concatenated path like 'netlify.app/other.host', try to extract the host-like part
    if (v.includes('/') && !/^https?:\/\//i.test(v)) {
        const parts = v.split('/').map(p => p.trim()).filter(Boolean);
        // pick part that contains a dot and not the current origin if possible
        const hostPart = parts.find(p => p.includes('.') && !p.includes('netlify')) || parts.find(p => p.includes('.')) || parts[parts.length - 1];
        if (hostPart && hostPart !== v) {
            console.warn('REACT_APP_BASE_URL looks concatenated; extracted host part:', hostPart, 'from', raw);
            v = hostPart;
        }
    }
    if (!/^https?:\/\//i.test(v)) v = `https://${v}`;
    return v;
}

const normalizedRaw = normalizeBaseURL(baseURL);
if (!normalizedRaw) {
    console.warn('REACT_APP_BASE_URL is not set. Requests will be relative to current origin. Raw value:', baseURL);
}
baseURL = normalizedRaw;
console.info('API baseURL=', baseURL, 'NODE_ENV=', process.env.NODE_ENV);
// recreate API with normalized baseURL
const normalizedAPI = axios.create({ baseURL });
// copy defaults (withCredentials) and interceptors from the original pattern
normalizedAPI.defaults.withCredentials = true;

// attach Authorization interceptor
normalizedAPI.interceptors.request.use(req => {
    const token = localStorage.getItem('authenticate');
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
}, error => {
    return Promise.reject(error.message);
});

export default normalizedAPI;