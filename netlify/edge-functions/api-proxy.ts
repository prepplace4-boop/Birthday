// Netlify Edge Function for API routing
// This file is used by Netlify for edge computing, not by Next.js build

export default async (req: Request, context: any) => {
  const url = new URL(req.url);
  
  // Proxy API requests to the Next.js server
  if (url.pathname.startsWith("/api/")) {
    return context.rewrite(new Request(url, req));
  }
  
  return context.next();
};

export const config = {
  path: "/api/*",
};
