import { Providers } from './providers';
import LayoutWrapper from './layout-wrapper';
import { Poppins, Playfair_Display, Cinzel } from 'next/font/google';
import '../src/index.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cinzel',
  display: 'swap',
});

export const metadata = {
  title: 'Jhumkas by Malti',
  description: 'Premium handcrafted jhumkas and earrings',
};

export default function RootLayout({ children }) {
  return (
    <html 
      lang="en" 
      className={`${poppins.variable} ${playfairDisplay.variable} ${cinzel.variable}`}
    >
      <body suppressHydrationWarning>
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
