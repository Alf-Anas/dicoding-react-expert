'use client';

import React, { useEffect, useState } from 'react';
import { Button, Input, Space, Typography } from 'antd';
import { ROUTE } from '@/constants';
import useAuth from '@/hooks/useAuth';
import { useMessage } from '@/provider/MessageProvider';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import Link from 'next/link';
import ProcessingState from '@/types/processing-state.enum';
import { fetchThreadComment } from '@/lib/features/threads/detail/commentThreadSlice';

export default function CommentBox({ threadId }: { threadId: string }) {
  const { messageApi } = useMessage();
  const { isAuthenticated } = useAuth();

  const dispatch = useAppDispatch();
  const { error, status } = useAppSelector((state) => state.commentThread);
  const [inputData, setInputData] = useState({
    content: '',
  });

  function onClickComment() {
    if (!inputData.content) {
      messageApi?.error('Comment must not empty!');
      return;
    }
    dispatch(
      fetchThreadComment({
        content: inputData.content,
        threadId,
      }),
    );
  }

  useEffect(() => {
    if (status === ProcessingState.SUCCESS) {
      setInputData({ content: '' });
    }
  }, [status]);

  useEffect(() => {
    if (error) {
      messageApi?.error(error);
    }
  }, [error]);

  return (
    <Space direction='vertical' className='w-full p-4' size='middle'>
      {isAuthenticated === 'authenticated' && (
        <>
          <Input.TextArea
            size='middle'
            value={inputData.content}
            onChange={(e) => {
              setInputData((oldState) => ({
                ...oldState,
                content: e.target.value,
              }));
            }}
            rows={4}
          />
          <Button
            type='primary'
            size='middle'
            className='w-full'
            onClick={onClickComment}
            loading={status === ProcessingState.IN_PROGRESS}
          >
            Comment
          </Button>
        </>
      )}

      {isAuthenticated === 'unauthenticated' && (
        <Typography.Text>
          <Link href={ROUTE.LOGIN} className='!text-primary-color'>
            Login
          </Link>{' '}
          to comment
        </Typography.Text>
      )}
    </Space>
  );
}
