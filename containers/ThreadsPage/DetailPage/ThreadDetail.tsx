'use client';

import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card, Space, Tag, Typography } from 'antd';
import { useMessage } from '@/provider/MessageProvider';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import dayjs from 'dayjs';
import { LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import { ProfileResponsesType } from '@/types/profile-responses.interface';
import { ThreadDetailResponsesType } from '@/types/thread-detail-responses.interface';
import VoteState from '@/types/vote-state.enum';
import { fetchThreadVote } from '@/lib/features/threads/detail/voteThreadSlice';
import ProcessingState from '@/types/processing-state.enum';

export default function ThreadDetail({
  thread,
  profile,
}: {
  thread: ThreadDetailResponsesType;
  profile: ProfileResponsesType | undefined;
}) {
  const userProfileId = profile?.id || '';

  const [listVoteUp, setListVoteUp] = useState<string[]>([]);
  const [listVoteDown, setListVoteDown] = useState<string[]>([]);

  const { messageApi } = useMessage();

  const dispatch = useAppDispatch();
  const { error, status } = useAppSelector((state) => state.voteThread);

  function resetListVote() {
    setListVoteUp(thread.upVotesBy);
    setListVoteDown(thread.downVotesBy);
  }

  useEffect(() => {
    resetListVote();
  }, [thread]);

  function isVoteUp() {
    if (listVoteUp.includes(userProfileId)) {
      return true;
    }
    return false;
  }
  function isVoteDown() {
    if (listVoteDown.includes(userProfileId)) {
      return true;
    }
    return false;
  }

  function voteUpCount() {
    let count = listVoteUp.length;
    if (!count) return undefined;
    return ` ${count}`;
  }

  function voteDownCount() {
    let count = listVoteDown.length;
    if (!count) return undefined;
    return ` ${count}`;
  }

  function runVoteDispatch(state: VoteState) {
    dispatch(
      fetchThreadVote({ threadId: thread.id, vote: state, refetch: 'detail' }),
    );
  }

  function onClickVote(state: VoteState) {
    if (!userProfileId) {
      messageApi?.error('Please login to vote!');
      return;
    }
    if (state === VoteState.UP) {
      if (listVoteUp.includes(userProfileId)) {
        setListVoteUp((oldState) => {
          const newState = oldState.filter((item) => item !== userProfileId);
          return newState;
        });
        runVoteDispatch(VoteState.NEUTRAL);
      } else {
        setListVoteUp((oldState) => {
          const newState = [...oldState, userProfileId];
          return newState;
        });
        setListVoteDown((oldState) => {
          const newState = oldState.filter((item) => item !== userProfileId);
          return newState;
        });
        runVoteDispatch(VoteState.UP);
      }
    } else if (state === VoteState.DOWN) {
      if (listVoteDown.includes(userProfileId)) {
        setListVoteDown((oldState) => {
          const newState = oldState.filter((item) => item !== userProfileId);
          return newState;
        });

        runVoteDispatch(VoteState.NEUTRAL);
      } else {
        setListVoteDown((oldState) => {
          const newState = [...oldState, userProfileId];
          return newState;
        });
        setListVoteUp((oldState) => {
          const newState = oldState.filter((item) => item !== userProfileId);
          return newState;
        });

        runVoteDispatch(VoteState.DOWN);
      }
    }
  }

  useEffect(() => {
    if (error) {
      messageApi?.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (status === ProcessingState.FAILURE) {
      resetListVote();
    }
  }, [status]);

  return (
    <Card
      title={
        <Space direction='horizontal'>
          <Avatar src={thread.owner.avatar} size='large' />
          <div className='grid'>
            <Typography.Text strong>{thread.owner.name}</Typography.Text>
            <Typography.Text className='font-light text-xs'>
              {dayjs(thread.createdAt).format('HH:mm, DD MMM YYYY')}
            </Typography.Text>
          </div>
        </Space>
      }
      bordered
      extra={
        thread.category ? (
          <Tag color='volcano'>#{thread.category}</Tag>
        ) : undefined
      }
    >
      <Space direction='vertical' className='w-full' size={[0, 0]}>
        <Typography.Title level={3} className='my-0'>
          {thread.title}
        </Typography.Title>
        <div dangerouslySetInnerHTML={{ __html: thread.body || '' }} />
        <Space direction='horizontal' className='mt-2'>
          <Button
            type={isVoteUp() ? 'primary' : undefined}
            ghost={isVoteUp() ? true : undefined}
            icon={<LikeOutlined />}
            size='small'
            onClick={() => onClickVote(VoteState.UP)}
          >
            {voteUpCount()}
          </Button>
          <Button
            type={isVoteDown() ? 'primary' : undefined}
            ghost={isVoteDown() ? true : undefined}
            icon={<DislikeOutlined />}
            size='small'
            onClick={() => onClickVote(VoteState.DOWN)}
          >
            {voteDownCount()}
          </Button>
        </Space>
      </Space>
    </Card>
  );
}
