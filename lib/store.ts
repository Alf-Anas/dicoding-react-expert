import { configureStore } from '@reduxjs/toolkit';
import loginSlice from './features/login/loginSlice';
import leaderboardsSlice from './features/leaderboards/leaderboardsSlice';
import registerSlice from './features/register/registerSlice';
import profileSlice from './features/profile/profileSlice';
import newThreadSlice from './features/threads/new/newThreadSlice';
import listThreadsSlice from './features/threads/list/listThreadsSlice';
import detailThreadSlice from './features/threads/detail/detailThreadSlice';
import commentThreadSlice from './features/threads/detail/commentThreadSlice';
import voteThreadSlice from './features/threads/detail/voteThreadSlice';
import voteCommentSlice from './features/threads/detail/voteCommentSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      leaderboards: leaderboardsSlice,
      login: loginSlice,
      register: registerSlice,
      profile: profileSlice,
      newThread: newThreadSlice,
      listThreads: listThreadsSlice,
      detailThread: detailThreadSlice,
      commentThread: commentThreadSlice,
      voteThread: voteThreadSlice,
      voteComment: voteCommentSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
