import API from '@/configs/api';
import {
  setProfileData,
  setProfileStatus,
  setProfileError,
  fetchProfile,
} from './profileSlice';
import { ProfileResponsesType } from '@/types/profile-responses.interface';
import ProcessingState from '@/types/processing-state.enum';
import { SESSION_STORAGE } from '@/constants';
import { expect } from '@jest/globals';

/**
 * test scenario for profileSlice Thunk
 *
 * - fetchProfile thunk function
 *  - should dispatch action correctly when data fetching success
 *  - should dispatch action correctly when data fetching failed
 *
 */

// Mocking API module
jest.mock('@/configs/api', () => ({
  getUserProfile: jest.fn(),
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

const mockedProfile: ProfileResponsesType = {
  id: 'user-71mAK0kXjg3NOAUX',
  name: 'user01',
  email: 'user01@mail.com',
  avatar: 'https://ui-avatars.com/api/?name=user01&background=random',
};

describe('fetchProfile thunk function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch action correctly when data fetching success', async () => {
    const dispatch = jest.fn();

    (API.getUserProfile as jest.Mock).mockResolvedValueOnce({
      data: { data: { user: mockedProfile } },
    });

    await fetchProfile()(dispatch);

    expect(API.getUserProfile).toHaveBeenCalled();
    expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
      SESSION_STORAGE.PROFILE,
      JSON.stringify(mockedProfile),
    );
    expect(dispatch).toHaveBeenCalledWith(
      setProfileStatus({ status: ProcessingState.IN_PROGRESS }),
    );
    expect(dispatch).toHaveBeenCalledWith(setProfileError({ error: '' }));
    expect(dispatch).toHaveBeenCalledWith(
      setProfileData({ data: mockedProfile }),
    );
    expect(dispatch).toHaveBeenCalledWith(
      setProfileStatus({ status: ProcessingState.FAILURE }),
    );
  });

  it('should dispatch action correctly when data fetching failed', async () => {
    const dispatch = jest.fn();
    const errorMessage = '500 Server Error';
    (API.getUserProfile as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage),
    );

    await fetchProfile()(dispatch);

    expect(API.getUserProfile).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(
      setProfileStatus({ status: ProcessingState.IN_PROGRESS }),
    );
    expect(dispatch).toHaveBeenCalledWith(setProfileError({ error: '' }));
    expect(dispatch).toHaveBeenCalledWith(
      setProfileData({ data: {} as ProfileResponsesType }),
    );
    expect(dispatch).toHaveBeenCalledWith(
      setProfileError({ error: expect.any(String) as unknown as string }),
    );
    expect(dispatch).toHaveBeenCalledWith(
      setProfileStatus({ status: ProcessingState.FAILURE }),
    );
  });
});
