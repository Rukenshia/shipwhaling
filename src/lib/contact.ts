// Set this public URL at build time after the SNS subscription has been confirmed.
export const contactEndpoint = (import.meta.env.VITE_CONTACT_ENDPOINT ?? '').trim();
