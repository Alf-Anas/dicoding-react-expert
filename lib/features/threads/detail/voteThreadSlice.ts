import API from '@/configs/api';
import { AppDispatch } from '@/lib/store';
import ProcessingState from '@/types/processing-state.enum';
import { errorResponse } from '@/utils';
import { createSlice } from '@reduxjs/toolkit';
import { fetchThreadDetail } from './detailThreadSlice';
import VoteState from '@/types/vote-state.enum';
import { fetchListThreads } from '../list/listThreadsSlice';

const voteThreadSlice = createSlice({
  name: 'vote-thread',
  initialState: {
    status: ProcessingState.UNDEFINED as ProcessingState,
    error: '',
  },
  reducers: {
    setVoteThreadStatus(
      state,
      action: { payload: { status: ProcessingState }; type: string },
    ) {
      state.status = action.payload.status;
    },
    setVoteThreadError(
      state,
      action: { payload: { error: string }; type: string },
    ) {
      state.error = action.payload.error;
    },
  },
});

const fetchThreadVote = ({
  vote,
  threadId,
  refetch,
}: {
  vote: VoteState;
  threadId: string;
  refetch?: 'detail' | 'list';
}) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setVoteThreadStatus({ status: ProcessingState.IN_PROGRESS }));
    dispatch(setVoteThreadError({ error: '' }));

    try {
      if (vote === VoteState.UP) {
        await API.postThreadUpVote(threadId);
      } else if (vote === VoteState.DOWN) {
        await API.postThreadDownVote(threadId);
      } else {
        await API.postThreadNeutralVote(threadId);
      }
      dispatch(setVoteThreadStatus({ status: ProcessingState.SUCCESS }));
      if (refetch === 'detail') {
        dispatch(fetchThreadDetail(threadId, true));
      } else if (refetch === 'list') {
        dispatch(fetchListThreads(true));
      }
    } catch (err) {
      dispatch(setVoteThreadStatus({ status: ProcessingState.FAILURE }));
      dispatch(
        setVoteThreadError({
          error: `${new Date().toLocaleString()} - ${errorResponse(err)}`,
        }),
      );
    }
  };
};

export { fetchThreadVote };
export const { setVoteThreadStatus, setVoteThreadError } =
  voteThreadSlice.actions;
export default voteThreadSlice.reducer;
