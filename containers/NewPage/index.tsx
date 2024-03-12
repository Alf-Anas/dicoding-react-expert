'use client';

import React, { useEffect, useState } from 'react';
import { Button, Input, Space, Typography } from 'antd';
import { useMessage } from '@/provider/MessageProvider';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import ProcessingState from '@/types/processing-state.enum';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import {
  fetchNewThread,
  setNewThreadStatus,
} from '@/lib/features/threads/new/newThreadSlice';
import { ROUTE } from '@/constants';
import { ArrowLeftOutlined } from '@ant-design/icons';

export default function NewPage() {
  const { messageApi } = useMessage();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const dispatch = useAppDispatch();
  const { error, status } = useAppSelector((state) => state.newThread);
  const [inputData, setInputData] = useState({
    title: '',
    category: '',
    body: '',
  });

  function onClickPost() {
    if (!inputData.title || !inputData.body) {
      messageApi?.error('Title and Body must not empty!');
      return;
    }
    dispatch(
      fetchNewThread({
        title: inputData.title,
        category: inputData.category,
        body: inputData.body,
      }),
    );
  }

  useEffect(() => {
    if (status === ProcessingState.SUCCESS) {
      dispatch(setNewThreadStatus({ status: ProcessingState.UNDEFINED }));
      messageApi?.success('Thread created!');
      router.push(ROUTE.HOME);
    }
  }, [status]);

  useEffect(() => {
    if (error) {
      messageApi?.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated === 'unauthenticated') {
      router.push(ROUTE.LOGIN);
    }
  }, [isAuthenticated]);

  function onClickBack() {
    router.push(ROUTE.HOME);
  }

  return (
    <Space direction='vertical' className='w-full p-4' size='middle'>
      <Button icon={<ArrowLeftOutlined />} size='small' onClick={onClickBack}>
        Back
      </Button>
      <Typography.Title level={4} className='mt-0 text-start'>
        New Thread
      </Typography.Title>
      <Input
        placeholder='Title'
        size='large'
        value={inputData.title}
        onChange={(e) => {
          setInputData((oldState) => ({ ...oldState, title: e.target.value }));
        }}
      />
      <Input
        placeholder='Category (Optional)'
        size='large'
        value={inputData.category}
        onChange={(e) => {
          setInputData((oldState) => ({
            ...oldState,
            category: e.target.value,
          }));
        }}
      />
      <Input.TextArea
        size='large'
        value={inputData.body}
        onChange={(e) => {
          setInputData((oldState) => ({
            ...oldState,
            body: e.target.value,
          }));
        }}
        rows={4}
      />
      <Button
        type='primary'
        size='large'
        className='w-full'
        onClick={onClickPost}
        loading={status === ProcessingState.IN_PROGRESS}
      >
        Post
      </Button>
    </Space>
  );
}
