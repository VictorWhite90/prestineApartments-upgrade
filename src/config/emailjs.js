// EmailJS Configuration - Uses environment variables
// For local development: Create .env.local file (not committed to Git)
// For production: Set in Vercel Dashboard -> Environment Variables
export const emailjsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_p6y1fke',
  templateIdClient: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CLIENT || 'template_vvm744y',
  templateIdCompany: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_COMPANY || 'template_iyygb2u',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '2ZNOdi6QPItTHItBO',
};



