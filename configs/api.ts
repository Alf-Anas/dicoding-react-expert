import axios from 'axios';
import { SESSION_STORAGE } from '@/constants';

const HOST_PUBLIC = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const HOST = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

HOST.interceptors.request.use(
  (config) => {
    const tokenCookie = sessionStorage.getItem(SESSION_STORAGE.TOKEN);
    if (tokenCookie) {
      config.headers['Authorization'] = 'Bearer ' + tokenCookie;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

const API = {
  postRegisterUser: ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    return HOST_PUBLIC.post(`/register`, { email, password, name });
  },

  postLoginUser: ({ email, password }: { email: string; password: string }) => {
    return HOST_PUBLIC.post(`/login`, { email, password });
  },

  getAllUsers: () => {
    return HOST_PUBLIC.get(`/users`);
  },

  getUserProfile: () => {
    return HOST.get(`/users/me`);
  },

  postCreateThread: ({
    title,
    body,
    category,
  }: {
    title: string;
    body: string;
    category?: string;
  }) => {
    return HOST.post(`/threads`, { title, category, body });
  },

  getAllThreads: () => {
    return HOST_PUBLIC.get(`/threads`);
  },

  getThreadById: (id: string) => {
    return HOST_PUBLIC.get(`/threads/${id}`);
  },

  postCreateComment: ({
    thread_id,
    content,
  }: {
    thread_id: string;
    content: string;
  }) => {
    return HOST.post(`/threads/${thread_id}/comments`, { content });
  },

  postThreadUpVote: (thread_id: string) => {
    return HOST.post(`/threads/${thread_id}/up-vote`);
  },
  postThreadDownVote: (thread_id: string) => {
    return HOST.post(`/threads/${thread_id}/down-vote`);
  },
  postThreadNeutralVote: (thread_id: string) => {
    return HOST.post(`/threads/${thread_id}/neutral-vote`);
  },

  postCommentUpVote: ({
    thread_id,
    comment_id,
  }: {
    thread_id: string;
    comment_id: string;
  }) => {
    return HOST.post(`/threads/${thread_id}/comments/${comment_id}/up-vote`);
  },
  postCommentDownVote: ({
    thread_id,
    comment_id,
  }: {
    thread_id: string;
    comment_id: string;
  }) => {
    return HOST.post(`/threads/${thread_id}/comments/${comment_id}/down-vote`);
  },
  postCommentNeutralVote: ({
    thread_id,
    comment_id,
  }: {
    thread_id: string;
    comment_id: string;
  }) => {
    return HOST.post(
      `/threads/${thread_id}/comments/${comment_id}/neutral-vote`,
    );
  },

  getLeaderBoards: () => {
    return HOST_PUBLIC.get(`/leaderboards`);
  },
};

export default API;
