import "../style/main.css"; // I tuoi stili globali

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="m-0 p-0 antialiased">{children}</body>
    </html>
  );
}
