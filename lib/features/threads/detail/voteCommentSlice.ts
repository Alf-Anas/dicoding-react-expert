import API from '@/configs/api';
import { AppDispatch } from '@/lib/store';
import ProcessingState from '@/types/processing-state.enum';
import { errorResponse } from '@/utils';
import { createSlice } from '@reduxjs/toolkit';
import VoteState from '@/types/vote-state.enum';
import { fetchThreadDetail } from './detailThreadSlice';

const voteCommentSlice = createSlice({
  name: 'vote-comment',
  initialState: {
    status: ProcessingState.UNDEFINED as ProcessingState,
    error: '',
  },
  reducers: {
    setVoteCommentStatus(
      state,
      action: { payload: { status: ProcessingState }; type: string },
    ) {
      state.status = action.payload.status;
    },
    setVoteCommentError(
      state,
      action: { payload: { error: string }; type: string },
    ) {
      state.error = action.payload.error;
    },
  },
});

const fetchCommentVote = ({
  vote,
  threadId,
  commentId,
}: {
  vote: VoteState;
  threadId: string;
  commentId: string;
}) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setVoteCommentStatus({ status: ProcessingState.IN_PROGRESS }));
    dispatch(setVoteCommentError({ error: '' }));

    try {
      if (vote === VoteState.UP) {
        await API.postCommentUpVote({
          thread_id: threadId,
          comment_id: commentId,
        });
      } else if (vote === VoteState.DOWN) {
        await API.postCommentDownVote({
          thread_id: threadId,
          comment_id: commentId,
        });
      } else {
        await API.postCommentNeutralVote({
          thread_id: threadId,
          comment_id: commentId,
        });
      }
      dispatch(setVoteCommentStatus({ status: ProcessingState.SUCCESS }));
      dispatch(fetchThreadDetail(threadId, true));
    } catch (err) {
      dispatch(setVoteCommentStatus({ status: ProcessingState.FAILURE }));
      dispatch(
        setVoteCommentError({
          error: `${new Date().toLocaleString()} - ${errorResponse(err)}`,
        }),
      );
    }
  };
};

export { fetchCommentVote };
export const { setVoteCommentStatus, setVoteCommentError } =
  voteCommentSlice.actions;
export default voteCommentSlice.reducer;
