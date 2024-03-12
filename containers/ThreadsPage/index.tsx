'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Divider,
  Flex,
  FloatButton,
  Skeleton,
  Space,
  Tag,
  Typography,
} from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { ROUTE } from '@/constants';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { useMessage } from '@/provider/MessageProvider';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchListThreads } from '@/lib/features/threads/list/listThreadsSlice';
import { ThreadsResponsesType } from '@/types/threads-responses.interface';
import ThreadBox from './ThreadBox';
import ProcessingState from '@/types/processing-state.enum';

export default function ThreadsPage() {
  const router = useRouter();

  const firstLoadRef = useRef(true);
  const { messageApi } = useMessage();
  const { isAuthenticated, profile } = useAuth();

  const dispatch = useAppDispatch();
  const {
    error,
    status,
    list: listThreads,
    categories,
  } = useAppSelector((state) => state.listThreads);

  const [filterThread, setFilterThread] = useState<ThreadsResponsesType[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (!firstLoadRef.current) return;
    dispatch(fetchListThreads());
    firstLoadRef.current = false;
  }, []);

  useEffect(() => {
    if (error) {
      messageApi?.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setFilterThread(listThreads);
    } else {
      const filteredData = listThreads.filter((item) =>
        selectedCategories.includes(item.category),
      );
      setFilterThread(filteredData);
    }
  }, [listThreads, selectedCategories]);

  const handleChangeCategories = (tag: string, checked: boolean) => {
    const nextSelectedCategories = checked
      ? [...selectedCategories, tag]
      : selectedCategories.filter((t) => t !== tag);

    setSelectedCategories(nextSelectedCategories);
  };

  function onClickNew() {
    router.push(ROUTE.NEW);
  }

  return (
    <Space direction='vertical' className='p-4 w-full'>
      <Typography.Title level={4} className='mt-0 text-start'>
        Open Thread
      </Typography.Title>
      <Divider className='my-0' />
      {categories.length > 0 && (
        <>
          <Typography.Text strong>Category</Typography.Text>
          <Flex gap='small' wrap='wrap' align='center'>
            {categories.map((tag) => (
              <Tag.CheckableTag
                key={tag}
                checked={selectedCategories.includes(tag)}
                onChange={(checked) => handleChangeCategories(tag, checked)}
                className='text-sm py-1 px-2'
              >
                #{tag}
              </Tag.CheckableTag>
            ))}
          </Flex>
          <Divider className='my-0' />
        </>
      )}

      {status === ProcessingState.IN_PROGRESS && <Skeleton />}

      {filterThread.map((thread) => {
        return <ThreadBox key={thread.id} thread={thread} profile={profile} />;
      })}

      {isAuthenticated === 'authenticated' && (
        <FloatButton
          icon={<PlusCircleOutlined />}
          type='primary'
          onClick={onClickNew}
        />
      )}
    </Space>
  );
}
