import reducer, {
  setCommentThreadError,
  setCommentThreadStatus,
} from './commentThreadSlice';
import { ProcessingState } from '@/types/processing-state.enum';
import { expect } from '@jest/globals';

/**
 * test scenario for commentThreadSlice Reducer
 *
 * - comment-thread slice reducers
 *  - should handle setCommentThreadStatus IN_PROGRESS
 *  - should handle setCommentThreadStatus SUCCESS
 *  - should handle setCommentThreadStatus FAILURE
 *  - should handle setCommentThreadError
 *
 */

describe('vote-comment slice reducers', () => {
  const initialState = {
    status: ProcessingState.UNDEFINED,
    error: '',
  };

  it('should handle setCommentThreadStatus IN_PROGRESS', () => {
    const newState = reducer(
      initialState,
      setCommentThreadStatus({ status: ProcessingState.IN_PROGRESS }),
    );
    expect(newState.status).toEqual(ProcessingState.IN_PROGRESS);
    expect(newState.error).toEqual('');
  });

  it('should handle setCommentThreadStatus SUCCESS', () => {
    const newState = reducer(
      initialState,
      setCommentThreadStatus({ status: ProcessingState.SUCCESS }),
    );
    expect(newState.status).toEqual(ProcessingState.SUCCESS);
    expect(newState.error).toEqual('');
  });

  it('should handle setCommentThreadStatus FAILURE', () => {
    const newState = reducer(
      initialState,
      setCommentThreadStatus({ status: ProcessingState.FAILURE }),
    );
    expect(newState.status).toEqual(ProcessingState.FAILURE);
    expect(newState.error).toEqual('');
  });

  it('should handle setCommentThreadError', () => {
    const errorMessage = 'An error occurred';
    const newState = reducer(
      initialState,
      setCommentThreadError({ error: errorMessage }),
    );
    expect(newState.error).toEqual(errorMessage);
    expect(newState.status).toEqual(ProcessingState.UNDEFINED);
  });
});
