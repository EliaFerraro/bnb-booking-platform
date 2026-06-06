import "../style/main.css"; // I tuoi stili globali
import { NextIntlClientProvider } from "next-intl";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Questo è solo un guscio invisibile, non mettere componenti qui
    <html lang="en">
      <body className="m-0 p-0 antialiased">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
