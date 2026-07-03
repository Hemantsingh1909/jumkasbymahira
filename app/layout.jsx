import { Providers } from './providers';
import LayoutWrapper from './layout-wrapper';
import '../src/index.css';

export const metadata = {
  title: 'Jhumkas by Malti',
  description: 'Premium handcrafted jhumkas and earrings',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
