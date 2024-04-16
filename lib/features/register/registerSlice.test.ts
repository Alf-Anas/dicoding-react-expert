import API from '@/configs/api';
import {
  setRegisterStatus,
  setRegisterError,
  fetchRegister,
} from './registerSlice';
import ProcessingState from '@/types/processing-state.enum';
import { SESSION_STORAGE } from '@/constants';
import { expect } from '@jest/globals';

/**
 * test scenario for registerSlice Thunk
 *
 * - fetchRegister thunk function
 *  - should dispatch action correctly when data fetching success
 *  - should dispatch action correctly when data fetching failed
 *
 */

// Mocking API module
jest.mock('@/configs/api', () => ({
  postRegisterUser: jest.fn(),
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
  name: 'User 01',
  token: "qwertyuiopasdfghjklzxcvbnm,12357890-=-p[;./'",
};

describe('fetchRegister thunk function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch action correctly when data fetching success', async () => {
    const dispatch = jest.fn();

    (API.postRegisterUser as jest.Mock).mockResolvedValueOnce({
      data: { data: { token: mockedInputData.token } },
    });

    await fetchRegister({
      email: mockedInputData.email,
      password: mockedInputData.password,
      name: mockedInputData.name,
    })(dispatch);

    expect(API.postRegisterUser).toHaveBeenCalledWith({
      email: mockedInputData.email,
      password: mockedInputData.password,
      name: mockedInputData.name,
    });
    expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
      SESSION_STORAGE.TOKEN,
      mockedInputData.token,
    );
    expect(dispatch).toHaveBeenCalledWith(
      setRegisterStatus({ status: ProcessingState.IN_PROGRESS }),
    );
    expect(dispatch).toHaveBeenCalledWith(setRegisterError({ error: '' }));
    expect(dispatch).toHaveBeenCalledWith(
      setRegisterStatus({ status: ProcessingState.SUCCESS }),
    );
  });

  it('should dispatch action correctly when data fetching failed', async () => {
    const dispatch = jest.fn();
    const errorMessage = '500 Server Error';
    (API.postRegisterUser as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage),
    );

    await fetchRegister({
      email: mockedInputData.email,
      password: mockedInputData.password,
      name: mockedInputData.name,
    })(dispatch);

    expect(API.postRegisterUser).toHaveBeenCalledWith({
      email: mockedInputData.email,
      password: mockedInputData.password,
      name: mockedInputData.name,
    });
    expect(sessionStorageMock.removeItem).toHaveBeenCalledWith(
      SESSION_STORAGE.TOKEN,
    );
    expect(dispatch).toHaveBeenCalledWith(
      setRegisterStatus({ status: ProcessingState.IN_PROGRESS }),
    );
    expect(dispatch).toHaveBeenCalledWith(setRegisterError({ error: '' }));
    expect(dispatch).toHaveBeenCalledWith(
      setRegisterStatus({ status: ProcessingState.FAILURE }),
    );
    expect(dispatch).toHaveBeenCalledWith(
      setRegisterError({ error: expect.any(String) as unknown as string }),
    );
  });
});
