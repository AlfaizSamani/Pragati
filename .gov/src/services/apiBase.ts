const PRODUCTION_API_BASE = 'https://pragati-wuh7.onrender.com';
const configuredApiBase = import.meta.env.VITE_API_URL;

export const API_BASE = (configuredApiBase || (import.meta.env.PROD ? PRODUCTION_API_BASE : '')).replace(/\/$/, '');