import API from '@/configs/api';
import {
  fetchNewThread,
  setNewThreadError,
  setNewThreadStatus,
} from './newThreadSlice';
import ProcessingState from '@/types/processing-state.enum';
import { expect } from '@jest/globals';

/**
 * test scenario for newThreadSlice Thunk
 *
 * - fetchNewThread thunk function
 *  - should dispatch action correctly when data fetching success
 *  - should dispatch action correctly when data fetching failed
 *
 */

// Mocking API module
jest.mock('@/configs/api', () => ({
  postCreateThread: jest.fn(),
}));

const mockedInputData = {
  title: 'My Title',
  category: 'my-category',
  body: 'My Body...',
};

describe('fetchNewThread thunk function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch action correctly when data fetching success', async () => {
    const dispatch = jest.fn();
    (API.postCreateThread as jest.Mock).mockResolvedValueOnce(undefined);

    await fetchNewThread({
      title: mockedInputData.title,
      body: mockedInputData.body,
      category: mockedInputData.category,
    })(dispatch);

    expect(API.postCreateThread).toHaveBeenCalledWith({
      title: mockedInputData.title,
      body: mockedInputData.body,
      category: mockedInputData.category,
    });
    expect(dispatch).toHaveBeenCalledWith(
      setNewThreadStatus({ status: ProcessingState.IN_PROGRESS }),
    );
    expect(dispatch).toHaveBeenCalledWith(setNewThreadError({ error: '' }));
    expect(dispatch).toHaveBeenCalledWith(
      setNewThreadStatus({ status: ProcessingState.SUCCESS }),
    );
  });

  it('should dispatch action correctly when data fetching failed', async () => {
    const dispatch = jest.fn();
    const errorMessage = '500 Server Error';
    (API.postCreateThread as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage),
    );

    await fetchNewThread({
      title: mockedInputData.title,
      body: mockedInputData.body,
      category: mockedInputData.category,
    })(dispatch);

    expect(API.postCreateThread).toHaveBeenCalledWith({
      title: mockedInputData.title,
      body: mockedInputData.body,
      category: mockedInputData.category,
    });
    expect(dispatch).toHaveBeenCalledWith(
      setNewThreadStatus({ status: ProcessingState.IN_PROGRESS }),
    );
    expect(dispatch).toHaveBeenCalledWith(setNewThreadError({ error: '' }));
    expect(dispatch).toHaveBeenCalledWith(
      setNewThreadStatus({ status: ProcessingState.SUCCESS }),
    );
    expect(dispatch).toHaveBeenCalledWith(
      setNewThreadError({ error: expect.any(String) as unknown as string }),
    );
  });
});
