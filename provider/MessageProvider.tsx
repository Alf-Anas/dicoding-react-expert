'use client';
import { createContext, useContext } from 'react';
import { message } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';

const MessageContext = createContext<{
  messageApi: MessageInstance | null;
}>({ messageApi: null });

export default function MessageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <MessageContext.Provider value={{ messageApi }}>
      {contextHolder}
      {children}
    </MessageContext.Provider>
  );
}

export function useMessage() {
  const context = useContext(MessageContext);
  return context;
}
