export const metadata = {
  title: "GEO·SEO Auditor",
  description: "Audit GEO + SEO pentru AI search engines.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body style={{ margin: 0, background: "#07101e" }}>{children}</body>
    </html>
  );
}