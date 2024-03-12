'use client';

import React, { useEffect, useRef } from 'react';
import { Button, Divider, Skeleton, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { ROUTE } from '@/constants';
import { useRouter } from 'next/navigation';
import { useMessage } from '@/provider/MessageProvider';
import useAuth from '@/hooks/useAuth';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchThreadDetail } from '@/lib/features/threads/detail/detailThreadSlice';
import ThreadDetail from './ThreadDetail';
import ThreadComment from './ThreadComment';
import CommentBox from './CommentBox';
import ProcessingState from '@/types/processing-state.enum';

export default function ThreadsDetailPage({ threadId }: { threadId: string }) {
  const router = useRouter();

  const firstLoadRef = useRef(true);
  const { messageApi } = useMessage();
  const { profile } = useAuth();

  const dispatch = useAppDispatch();
  const { error, status, detail } = useAppSelector(
    (state) => state.detailThread,
  );

  useEffect(() => {
    if (!firstLoadRef.current) return;
    dispatch(fetchThreadDetail(threadId));
    firstLoadRef.current = false;
  }, []);

  useEffect(() => {
    if (error) {
      messageApi?.error(error);
    }
  }, [error]);

  function onClickBack() {
    router.push(ROUTE.HOME);
  }

  return (
    <Space direction='vertical' className='w-full p-4' size='middle'>
      <Button icon={<ArrowLeftOutlined />} size='small' onClick={onClickBack}>
        Back
      </Button>

      {status === ProcessingState.IN_PROGRESS && <Skeleton />}

      {detail && status !== ProcessingState.IN_PROGRESS && (
        <>
          <ThreadDetail thread={detail} profile={profile} />
          <Divider className='!my-0'>
            Comments ({detail.comments.length || 0})
          </Divider>
          <CommentBox threadId={threadId} />
          {detail.comments.map((comment) => {
            return (
              <ThreadComment
                key={comment.id}
                comment={comment}
                profile={profile}
                threadId={threadId}
              />
            );
          })}
        </>
      )}
    </Space>
  );
}
