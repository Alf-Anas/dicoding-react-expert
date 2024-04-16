import reducer, {
  setVoteThreadError,
  setVoteThreadStatus,
} from './voteThreadSlice';
import { ProcessingState } from '@/types/processing-state.enum';
import { expect } from '@jest/globals';

/**
 * test scenario for voteThreadSlice Reducer
 *
 * - vote-thread slice reducers
 *  - should handle setVoteThreadStatus IN_PROGRESS
 *  - should handle setVoteThreadStatus SUCCESS
 *  - should handle setVoteThreadStatus FAILURE
 *  - should handle setVoteThreadError
 *
 */

describe('vote-thread slice reducers', () => {
  const initialState = {
    status: ProcessingState.UNDEFINED,
    error: '',
  };

  it('should handle setVoteThreadStatus IN_PROGRESS', () => {
    const newState = reducer(
      initialState,
      setVoteThreadStatus({ status: ProcessingState.IN_PROGRESS }),
    );
    expect(newState.status).toEqual(ProcessingState.IN_PROGRESS);
    expect(newState.error).toEqual('');
  });

  it('should handle setVoteThreadStatus SUCCESS', () => {
    const newState = reducer(
      initialState,
      setVoteThreadStatus({ status: ProcessingState.SUCCESS }),
    );
    expect(newState.status).toEqual(ProcessingState.SUCCESS);
    expect(newState.error).toEqual('');
  });

  it('should handle setVoteThreadStatus FAILURE', () => {
    const newState = reducer(
      initialState,
      setVoteThreadStatus({ status: ProcessingState.FAILURE }),
    );
    expect(newState.status).toEqual(ProcessingState.FAILURE);
    expect(newState.error).toEqual('');
  });

  it('should handle setVoteCommentError', () => {
    const errorMessage = 'An error occurred';
    const newState = reducer(
      initialState,
      setVoteThreadError({ error: errorMessage }),
    );
    expect(newState.error).toEqual(errorMessage);
    expect(newState.status).toEqual(ProcessingState.UNDEFINED);
  });
});
