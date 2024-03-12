import API from '@/configs/api';
import { AppDispatch } from '@/lib/store';
import ProcessingState from '@/types/processing-state.enum';
import { errorResponse } from '@/utils';
import { createSlice } from '@reduxjs/toolkit';
import { fetchThreadDetail } from './detailThreadSlice';

const commentThreadSlice = createSlice({
  name: 'comment-thread',
  initialState: {
    status: ProcessingState.UNDEFINED as ProcessingState,
    error: '',
  },
  reducers: {
    setCommentThreadStatus(
      state,
      action: { payload: { status: ProcessingState }; type: string },
    ) {
      state.status = action.payload.status;
    },
    setCommentThreadError(
      state,
      action: { payload: { error: string }; type: string },
    ) {
      state.error = action.payload.error;
    },
  },
});

const fetchThreadComment = ({
  content,
  threadId,
}: {
  content: string;
  threadId: string;
}) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setCommentThreadStatus({ status: ProcessingState.IN_PROGRESS }));
    dispatch(setCommentThreadError({ error: '' }));

    try {
      await API.postCreateComment({ content, thread_id: threadId });
      dispatch(setCommentThreadStatus({ status: ProcessingState.SUCCESS }));
      dispatch(fetchThreadDetail(threadId, true));
    } catch (err) {
      dispatch(setCommentThreadStatus({ status: ProcessingState.FAILURE }));
      dispatch(
        setCommentThreadError({
          error: `${new Date().toLocaleString()} - ${errorResponse(err)}`,
        }),
      );
    }
  };
};

export { fetchThreadComment };
export const { setCommentThreadStatus, setCommentThreadError } =
  commentThreadSlice.actions;
export default commentThreadSlice.reducer;
