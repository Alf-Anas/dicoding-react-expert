'use client';

import React, { useEffect, useRef } from 'react';
import { Avatar, List, Skeleton, Typography } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchLeaderboards } from '@/lib/features/leaderboards/leaderboardsSlice';
import { useMessage } from '@/provider/MessageProvider';

export default function LeaderBoardsPage() {
  const firstLoadRef = useRef(true);
  const { messageApi } = useMessage();

  const dispatch = useAppDispatch();
  const {
    error,
    loading,
    list: listLeaderboard,
  } = useAppSelector((state) => state.leaderboards);

  useEffect(() => {
    if (!firstLoadRef.current) return;
    dispatch(fetchLeaderboards());
    firstLoadRef.current = false;
  }, []);

  useEffect(() => {
    if (error) {
      messageApi?.error(error);
    }
  }, [error]);

  return (
    <div className='px-2'>
      <Typography.Title level={3} className='mt-0'>
        LeaderBoards
      </Typography.Title>
      {loading ? (
        <Skeleton />
      ) : (
        <List
          itemLayout='horizontal'
          dataSource={listLeaderboard}
          header={
            <List.Item
              className='!py-0'
              extra={
                <>
                  <StarOutlined className='mr-2' /> Score
                </>
              }
            >
              <List.Item.Meta title='User' />
            </List.Item>
          }
          renderItem={(item) => (
            <List.Item extra={item.score}>
              <List.Item.Meta
                avatar={<Avatar src={item.user.avatar} />}
                title={item.user.name}
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
}
