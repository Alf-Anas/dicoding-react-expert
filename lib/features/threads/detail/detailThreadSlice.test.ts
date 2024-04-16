import API from '@/configs/api';
import reducer, {
  setThreadDetail,
  setThreadsStatus,
  setThreadsError,
  fetchThreadDetail,
} from './detailThreadSlice';
import ProcessingState from '@/types/processing-state.enum';
import { expect } from '@jest/globals';
import { ThreadDetailResponsesType } from '@/types/thread-detail-responses.interface';

/**
 * test scenario for detailThreadSlice Thunk
 *
 * - fetchThreadDetail thunk function
 *  - should dispatch action correctly when data fetching success
 *  - should dispatch action correctly when data fetching failed
 *
 * - detail-threads slice reducers
 *  - should handle setThreadDetail
 *  - should handle setThreadsStatus IN_PROGRESS
 *  - should handle setThreadsStatus SUCCESS
 *  - should handle setThreadsStatus FAILURE
 *  - should handle setThreadsError
 *
 */

// Mocking API module
jest.mock('@/configs/api', () => ({
  getThreadById: jest.fn(),
}));

const mockedDetailResponse: ThreadDetailResponsesType = {
  id: 'thread-01',
  title: 'Thread Title',
  body: 'Thread Body...',
  createdAt: '2023-01-29T07:30:45Z',
  owner: {
    id: 'user-001',
    name: 'user 001',
    avatar: 'https://ui-avatars.com/api/?name=User 001&background=random',
  },
  category: 'my-category',
  comments: [],
  upVotesBy: [],
  downVotesBy: [],
};

const threadId = mockedDetailResponse.id;

describe('fetchThreadDetail thunk function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch action correctly when data fetching success', async () => {
    const dispatch = jest.fn();

    const mockedResponse = {
      data: { data: { detailThread: mockedDetailResponse } },
    };
    (API.getThreadById as jest.Mock).mockResolvedValueOnce(mockedResponse);

    await fetchThreadDetail(threadId)(dispatch);

    expect(API.getThreadById).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(
      setThreadsStatus({ status: ProcessingState.IN_PROGRESS }),
    );
    expect(dispatch).toHaveBeenCalledWith(setThreadsError({ error: '' }));
    expect(dispatch).toHaveBeenCalledWith(
      setThreadDetail({ data: mockedDetailResponse }),
    );
    expect(dispatch).toHaveBeenCalledWith(
      setThreadsStatus({ status: ProcessingState.SUCCESS }),
    );
  });

  it('should dispatch action correctly when data fetching failed', async () => {
    const dispatch = jest.fn();

    const errorMessage = '500 Server Error';
    (API.getThreadById as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage),
    );

    await fetchThreadDetail(threadId)(dispatch);

    expect(API.getThreadById).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(
      setThreadsStatus({ status: ProcessingState.IN_PROGRESS }),
    );
    expect(dispatch).toHaveBeenCalledWith(setThreadsError({ error: '' }));
    expect(dispatch).toHaveBeenCalledWith(setThreadDetail({ data: undefined }));
    expect(dispatch).toHaveBeenCalledWith(
      setThreadsError({ error: expect.any(String) as unknown as string }),
    );
    expect(dispatch).toHaveBeenCalledWith(
      setThreadsStatus({ status: ProcessingState.FAILURE }),
    );
  });
});

describe('detail-threads slice reducers', () => {
  const initialState = {
    status: ProcessingState.UNDEFINED,
    error: '',
    detail: undefined,
  };

  it('should handle setThreadDetail', () => {
    const newState = reducer(
      initialState,
      setThreadDetail({ data: mockedDetailResponse }),
    );
    expect(newState.detail).toEqual(mockedDetailResponse);
    expect(newState.error).toEqual('');
    expect(newState.status).toEqual(ProcessingState.UNDEFINED);
  });

  it('should handle setThreadsStatus IN_PROGRESS', () => {
    const newState = reducer(
      initialState,
      setThreadsStatus({ status: ProcessingState.IN_PROGRESS }),
    );
    expect(newState.status).toEqual(ProcessingState.IN_PROGRESS);
    expect(newState.error).toEqual('');
    expect(newState.detail).toEqual(undefined);
  });

  it('should handle setThreadsStatus SUCCESS', () => {
    const newState = reducer(
      initialState,
      setThreadsStatus({ status: ProcessingState.SUCCESS }),
    );
    expect(newState.status).toEqual(ProcessingState.SUCCESS);
    expect(newState.error).toEqual('');
    expect(newState.detail).toEqual(undefined);
  });

  it('should handle setThreadsStatus FAILURE', () => {
    const newState = reducer(
      initialState,
      setThreadsStatus({ status: ProcessingState.FAILURE }),
    );
    expect(newState.status).toEqual(ProcessingState.FAILURE);
    expect(newState.error).toEqual('');
    expect(newState.detail).toEqual(undefined);
  });

  it('should handle setThreadsError', () => {
    const errorMessage = 'An error occurred';
    const newState = reducer(
      initialState,
      setThreadsError({ error: errorMessage }),
    );
    expect(newState.error).toEqual(errorMessage);
    expect(newState.status).toEqual(ProcessingState.UNDEFINED);
    expect(newState.detail).toEqual(undefined);
  });
});
