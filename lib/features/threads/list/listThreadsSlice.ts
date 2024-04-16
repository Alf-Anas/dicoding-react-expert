import API from '@/configs/api';
import { AppDispatch } from '@/lib/store';
import ProcessingState from '@/types/processing-state.enum';
import { ProfileResponsesType } from '@/types/profile-responses.interface';
import {
  ThreadsResponsesType,
  ThreadsWithUserType,
} from '@/types/threads-responses.interface';
import { errorResponse } from '@/utils';
import { createSlice } from '@reduxjs/toolkit';

const listThreadsSlice = createSlice({
  name: 'list-threads',
  initialState: {
    status: ProcessingState.UNDEFINED,
    list: [] as ThreadsWithUserType[],
    users: [] as ProfileResponsesType[],
    error: '',
    categories: [] as string[],
  },
  reducers: {
    setThreadsList(
      state,
      action: { payload: { list: ThreadsWithUserType[] }; type: string },
    ) {
      state.list = action.payload.list;
    },
    setUsers(
      state,
      action: { payload: { list: ProfileResponsesType[] }; type: string },
    ) {
      state.users = action.payload.list;
    },
    setCategories(
      state,
      action: { payload: { list: string[] }; type: string },
    ) {
      state.categories = action.payload.list;
    },
    setListThreadsStatus(
      state,
      action: { payload: { status: ProcessingState }; type: string },
    ) {
      state.status = action.payload.status;
    },
    setListThreadsError(
      state,
      action: { payload: { error: string }; type: string },
    ) {
      state.error = action.payload.error;
    },
  },
});

const fetchListThreads = (bgProcess?: boolean) => {
  return async (dispatch: AppDispatch) => {
    dispatch(
      setListThreadsStatus({
        status: bgProcess
          ? ProcessingState.BG_PROGRESS
          : ProcessingState.IN_PROGRESS,
      }),
    );
    dispatch(setListThreadsError({ error: '' }));

    try {
      const response = await API.getAllThreads();
      const eData: ThreadsResponsesType[] = response?.data?.data?.threads || [];

      const responseUsers = await API.getAllUsers();
      const eDataUsers: ProfileResponsesType[] =
        responseUsers?.data?.data?.users || [];

      const threadsWithUser: ThreadsWithUserType[] = eData.map((item) => {
        return {
          ...item,
          user: eDataUsers.find((user) => user.id === item.ownerId),
        };
      });
      const listCategory = eData.map((item) => item.category);
      const uniqueCategory = [...new Set(listCategory)];
      dispatch(setThreadsList({ list: threadsWithUser }));
      dispatch(setUsers({ list: eDataUsers }));
      dispatch(setCategories({ list: uniqueCategory }));
      dispatch(setListThreadsStatus({ status: ProcessingState.SUCCESS }));
    } catch (err) {
      dispatch(setCategories({ list: [] }));
      dispatch(setThreadsList({ list: [] }));
      dispatch(
        setListThreadsError({
          error: `${new Date().toLocaleString()} - ${errorResponse(err)}`,
        }),
      );
      dispatch(setListThreadsStatus({ status: ProcessingState.FAILURE }));
    }
  };
};

export { fetchListThreads };
export const {
  setThreadsList,
  setListThreadsStatus,
  setListThreadsError,
  setCategories,
  setUsers,
} = listThreadsSlice.actions;
export default listThreadsSlice.reducer;
