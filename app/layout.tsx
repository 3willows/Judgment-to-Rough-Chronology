import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const defaultUrl = process.env.URL
  ? `https://${process.env.URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Chronology of a Judgment",
  description: "Create an instant draft chronology of a judgment",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
              <div className="flex flex-col gap-20 max-w-5xl p-5">{children}</div>
            </div>

            {/* Footer with restricted height */}
            <footer className="w-full flex items-center justify-center border-t mx-auto text-center gap-8 py-12">
              <p>
              The information displayed here is licensed under the <a
                href="https://caselaw.nationalarchives.gov.uk/open-justice-licence"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              > Open Justice - Licence v1.0.
              </a></p>
            </footer>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}