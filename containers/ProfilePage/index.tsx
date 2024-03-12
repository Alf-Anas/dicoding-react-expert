'use client';

import React, { useEffect } from 'react';
import {
  Avatar,
  Button,
  Descriptions,
  Skeleton,
  Space,
  Spin,
  Typography,
} from 'antd';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchProfile } from '@/lib/features/profile/profileSlice';
import { useMessage } from '@/provider/MessageProvider';
import ProcessingState from '@/types/processing-state.enum';
import { ROUTE, SESSION_STORAGE } from '@/constants';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { messageApi } = useMessage();

  const dispatch = useAppDispatch();
  const {
    error,
    status,
    data: profileData,
  } = useAppSelector((state) => state.profile);

  useEffect(() => {
    if (isAuthenticated === 'authenticated') {
      dispatch(fetchProfile());
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (error) {
      messageApi?.error(error);
    }
  }, [error]);

  function onClickLogin() {
    router.push(ROUTE.LOGIN);
  }
  function onClickLogout() {
    sessionStorage.removeItem(SESSION_STORAGE.TOKEN);
    sessionStorage.removeItem(SESSION_STORAGE.PROFILE);
    window.location.reload();
  }

  return (
    <Space
      direction='vertical'
      className='p-4 py-12 w-full text-center'
      size='large'
    >
      {isAuthenticated === 'unauthenticated' && (
        <>
          <Typography.Title level={4} className='mt-0 text-center'>
            You're not login. Please login to continue.
          </Typography.Title>
          <Button type='primary' size='large' onClick={onClickLogin}>
            Login
          </Button>
        </>
      )}
      {isAuthenticated === 'authenticated' && (
        <>
          <Typography.Title level={4} className='mt-0 text-start'>
            PROFILE
          </Typography.Title>
          {status === ProcessingState.IN_PROGRESS ? (
            <Skeleton />
          ) : (
            <Space
              direction='horizontal'
              size='large'
              className='w-full text-start'
            >
              <Avatar size={60} src={profileData.avatar} />
              <Descriptions
                bordered
                column={1}
                labelStyle={{ fontWeight: 'bold' }}
                className='w-full'
              >
                <Descriptions.Item label='Name'>
                  {profileData.name}
                </Descriptions.Item>
                <Descriptions.Item label='Email'>
                  {profileData.email}
                </Descriptions.Item>
              </Descriptions>
            </Space>
          )}
          <div className='w-full text-end'>
            <Button type='primary' size='large' onClick={onClickLogout}>
              Logout
            </Button>
          </div>
        </>
      )}
      {isAuthenticated === 'loading' && <Spin />}
    </Space>
  );
}
