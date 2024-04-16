import reducer, {
  setVoteCommentStatus,
  setVoteCommentError,
} from './voteCommentSlice';
import { ProcessingState } from '@/types/processing-state.enum';
import { expect } from '@jest/globals';

/**
 * test scenario for voteCommentSlice Reducer
 *
 * - vote-comment slice reducers
 *  - should handle setVoteCommentStatus IN_PROGRESS
 *  - should handle setVoteCommentStatus SUCCESS
 *  - should handle setVoteCommentStatus FAILURE
 *  - should handle setVoteCommentError
 *
 */

describe('vote-comment slice reducers', () => {
  const initialState = {
    status: ProcessingState.UNDEFINED,
    error: '',
  };

  it('should handle setVoteCommentStatus IN_PROGRESS', () => {
    const newState = reducer(
      initialState,
      setVoteCommentStatus({ status: ProcessingState.IN_PROGRESS }),
    );
    expect(newState.status).toEqual(ProcessingState.IN_PROGRESS);
    expect(newState.error).toEqual('');
  });

  it('should handle setVoteCommentStatus SUCCESS', () => {
    const newState = reducer(
      initialState,
      setVoteCommentStatus({ status: ProcessingState.SUCCESS }),
    );
    expect(newState.status).toEqual(ProcessingState.SUCCESS);
    expect(newState.error).toEqual('');
  });

  it('should handle setVoteCommentStatus FAILURE', () => {
    const newState = reducer(
      initialState,
      setVoteCommentStatus({ status: ProcessingState.FAILURE }),
    );
    expect(newState.status).toEqual(ProcessingState.FAILURE);
    expect(newState.error).toEqual('');
  });

  it('should handle setVoteCommentError', () => {
    const errorMessage = 'An error occurred';
    const newState = reducer(
      initialState,
      setVoteCommentError({ error: errorMessage }),
    );
    expect(newState.error).toEqual(errorMessage);
    expect(newState.status).toEqual(ProcessingState.UNDEFINED);
  });
});
