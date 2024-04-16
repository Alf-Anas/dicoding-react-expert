import API from '@/configs/api';
import { setLoginStatus, setLoginError, fetchLogin } from './loginSlice';
import ProcessingState from '@/types/processing-state.enum';
import { SESSION_STORAGE } from '@/constants';
import { expect } from '@jest/globals';

/**
 * test scenario for loginSlice Thunk
 *
 * - fetchLogin thunk function
 *  - should dispatch action correctly when data fetching success
 *  - should dispatch action correctly when data fetching failed
 *
 */

// Mocking API module
jest.mock('@/configs/api', () => ({
  postLoginUser: jest.fn(),
}));

// Mocking sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

const mockedInputData = {
  email: 'user01@mail.com',
  password: 'abcd1234',
  token: "qwertyuiopasdfghjklzxcvbnm,12357890-=-p[;./'",
};

describe('fetchLogin thunk function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch action correctly when data fetching success', async () => {
    const dispatch = jest.fn();
    (API.postLoginUser as jest.Mock).mockResolvedValueOnce({
      data: { data: { token: mockedInputData.token } },
    });

    await fetchLogin({
      email: mockedInputData.email,
      password: mockedInputData.password,
    })(dispatch);

    expect(API.postLoginUser).toHaveBeenCalledWith({
      email: mockedInputData.email,
      password: mockedInputData.password,
    });
    expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
      SESSION_STORAGE.TOKEN,
      mockedInputData.token,
    );
    expect(dispatch).toHaveBeenCalledWith(
      setLoginStatus({ status: ProcessingState.IN_PROGRESS }),
    );
    expect(dispatch).toHaveBeenCalledWith(setLoginError({ error: '' }));
    expect(dispatch).toHaveBeenCalledWith(
      setLoginStatus({ status: ProcessingState.SUCCESS }),
    );
  });

  it('should dispatch action correctly when data fetching failed', async () => {
    const dispatch = jest.fn();
    const errorMessage = '500 Server Error';
    (API.postLoginUser as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage),
    );

    await fetchLogin({
      email: mockedInputData.email,
      password: mockedInputData.password,
    })(dispatch);

    expect(API.postLoginUser).toHaveBeenCalledWith({
      email: mockedInputData.email,
      password: mockedInputData.password,
    });
    expect(sessionStorageMock.removeItem).toHaveBeenCalledWith(
      SESSION_STORAGE.TOKEN,
    );
    expect(dispatch).toHaveBeenCalledWith(
      setLoginStatus({ status: ProcessingState.IN_PROGRESS }),
    );
    expect(dispatch).toHaveBeenCalledWith(setLoginError({ error: '' }));
    expect(dispatch).toHaveBeenCalledWith(
      setLoginStatus({ status: ProcessingState.FAILURE }),
    );
    expect(dispatch).toHaveBeenCalledWith(
      setLoginError({ error: expect.any(String) as unknown as string }),
    );
  });
});
