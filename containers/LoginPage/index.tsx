'use client';

import React, { useEffect, useState } from 'react';
import { Button, Input, Space, Typography } from 'antd';
import Link from 'next/link';
import { useMessage } from '@/provider/MessageProvider';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchLogin } from '@/lib/features/login/loginSlice';
import ProcessingState from '@/types/processing-state.enum';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { ROUTE } from '@/constants';
import { fetchProfile } from '@/lib/features/profile/profileSlice';

export default function LoginPage() {
  const { messageApi } = useMessage();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const dispatch = useAppDispatch();
  const { error, status } = useAppSelector((state) => state.login);
  const [inputData, setInputData] = useState({ email: '', password: '' });

  function onClickLogin() {
    if (!inputData.email || !inputData.password) {
      messageApi?.error('Email and Password must not empty!');
      return;
    }
    dispatch(
      fetchLogin({ email: inputData.email, password: inputData.password }),
    );
  }

  useEffect(() => {
    if (status === ProcessingState.SUCCESS) {
      dispatch(fetchProfile());
      router.push(ROUTE.PROFILE);
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
        LOGIN
      </Typography.Title>
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
        onClick={onClickLogin}
        loading={status === ProcessingState.IN_PROGRESS}
      >
        Login
      </Button>
      <Typography.Text className='mt-0'>
        Didn`t have an account?
        <Link href='/register' className='ml-1 !text-primary-color'>
          Register Here
        </Link>
      </Typography.Text>
    </Space>
  );
}
