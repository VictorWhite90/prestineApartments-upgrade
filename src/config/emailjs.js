// EmailJS Configuration - Uses environment variables
// For local development: Create .env.local file (not committed to Git)
// For production: Set in Hostinger Dashboard -> Environment Variables
export const emailjsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateIdClient: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CLIENT,
  templateIdCompany: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_COMPANY,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
};



