'use client';
import StoreProvider from './StoreProvider';
import { ConfigProvider } from 'antd';
import MessageProvider from './MessageProvider';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: any) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

export default function TestProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#aa0000',
          },
        }}
      >
        <MessageProvider>{children}</MessageProvider>
      </ConfigProvider>
    </StoreProvider>
  );
}
