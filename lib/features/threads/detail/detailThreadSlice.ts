import API from '@/configs/api';
import { AppDispatch } from '@/lib/store';
import ProcessingState from '@/types/processing-state.enum';
import { ThreadDetailResponsesType } from '@/types/thread-detail-responses.interface';
import { errorResponse } from '@/utils';
import { createSlice } from '@reduxjs/toolkit';

const detailThreadSlice = createSlice({
  name: 'detail-threads',
  initialState: {
    status: ProcessingState.UNDEFINED,
    detail: undefined as ThreadDetailResponsesType | undefined,
    error: '',
  },
  reducers: {
    setThreadDetail(
      state,
      action: {
        payload: { data: ThreadDetailResponsesType | undefined };
        type: string;
      },
    ) {
      state.detail = action.payload.data;
    },
    setThreadsStatus(
      state,
      action: { payload: { status: ProcessingState }; type: string },
    ) {
      state.status = action.payload.status;
    },
    setThreadsError(
      state,
      action: { payload: { error: string }; type: string },
    ) {
      state.error = action.payload.error;
    },
  },
});

const fetchThreadDetail = (threadId: string, bgProcess?: boolean) => {
  return async (dispatch: AppDispatch) => {
    dispatch(
      setThreadsStatus({
        status: bgProcess
          ? ProcessingState.BG_PROGRESS
          : ProcessingState.IN_PROGRESS,
      }),
    );
    dispatch(setThreadsError({ error: '' }));

    try {
      const response = await API.getThreadById(threadId);
      const eData: ThreadDetailResponsesType =
        response?.data?.data?.detailThread || {};

      dispatch(setThreadDetail({ data: eData }));
      dispatch(setThreadsStatus({ status: ProcessingState.SUCCESS }));
    } catch (err) {
      dispatch(setThreadDetail({ data: undefined }));
      dispatch(
        setThreadsError({
          error: `${new Date().toLocaleString()} - ${errorResponse(err)}`,
        }),
      );
      dispatch(setThreadsStatus({ status: ProcessingState.FAILURE }));
    }
  };
};

export { fetchThreadDetail };
export const { setThreadDetail, setThreadsStatus, setThreadsError } =
  detailThreadSlice.actions;
export default detailThreadSlice.reducer;
