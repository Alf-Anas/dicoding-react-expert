import type { Metadata } from 'next';
import './globals.css';
import { ConfigProvider } from 'antd';
import MainLayout from '@/components/MainLayout';
import MessageProvider from '@/provider/MessageProvider';
import StoreProvider from '@/provider/StoreProvider';

export const metadata: Metadata = {
  title: 'Open Forum',
  description: 'Open Forum is a forum app to discuss everything.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#aa0000',
          },
        }}
      >
        <MessageProvider>
          <html lang='en'>
            <body>
              <MainLayout>{children}</MainLayout>
            </body>
          </html>
        </MessageProvider>
      </ConfigProvider>
    </StoreProvider>
  );
}
