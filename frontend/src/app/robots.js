export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/portal/'],
      },
    ],
    sitemap: 'https://devclasses.vercel.app/sitemap.xml',
  }
}
