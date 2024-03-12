'use client';

import React, { useEffect, useState } from 'react';
import { Button, Input, Space, Typography } from 'antd';
import Link from 'next/link';
import { useMessage } from '@/provider/MessageProvider';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import ProcessingState from '@/types/processing-state.enum';
import { fetchRegister } from '@/lib/features/register/registerSlice';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { ROUTE } from '@/constants';

export default function RegisterPage() {
  const { messageApi } = useMessage();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const dispatch = useAppDispatch();
  const { error, status } = useAppSelector((state) => state.register);
  const [inputData, setInputData] = useState({
    email: '',
    password: '',
    name: '',
  });

  function onClickRegister() {
    if (!inputData.email || !inputData.password || !inputData.name) {
      messageApi?.error('Name, Email and Password must not empty!');
      return;
    }
    dispatch(
      fetchRegister({
        email: inputData.email,
        password: inputData.password,
        name: inputData.name,
      }),
    );
  }

  useEffect(() => {
    if (status === ProcessingState.SUCCESS) {
      messageApi?.success('Register succeded, please login to continue!');
      router.push(ROUTE.LOGIN);
    }
  }, [status]);

  useEffect(() => {
    if (error) {
      messageApi?.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated === 'authenticated') {
      router.push(ROUTE.PROFILE);
    }
  }, [isAuthenticated]);
  return (
    <Space direction='vertical' className='w-full p-4' size='middle'>
      <Typography.Title level={4} className='mt-0 text-center'>
        REGISTER
      </Typography.Title>
      <Input
        placeholder='Name'
        size='large'
        value={inputData.name}
        onChange={(e) => {
          setInputData((oldState) => ({ ...oldState, name: e.target.value }));
        }}
      />
      <Input
        type='Email'
        placeholder='Email'
        size='large'
        value={inputData.email}
        onChange={(e) => {
          setInputData((oldState) => ({
            ...oldState,
            email: e.target.value,
          }));
        }}
      />
      <Input
        type='Password'
        placeholder='Password'
        size='large'
        value={inputData.password}
        onChange={(e) => {
          setInputData((oldState) => ({
            ...oldState,
            password: e.target.value,
          }));
        }}
      />
      <Button
        type='primary'
        size='large'
        className='w-full'
        onClick={onClickRegister}
        loading={status === ProcessingState.IN_PROGRESS}
      >
        Register
      </Button>
      <Typography.Text className='mt-0'>
        Already have an account?
        <Link href='/login' className='ml-1 !text-primary-color'>
          Login Here
        </Link>
      </Typography.Text>
    </Space>
  );
}
