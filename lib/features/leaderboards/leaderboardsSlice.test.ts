import { fetchLeaderboards } from './leaderboardsSlice';
import API from '@/configs/api';
import {
  setLeaderboardsList,
  setLeaderboardsLoading,
  setLeaderboardsError,
} from './leaderboardsSlice';
import { LeaderboardType } from '@/types/leaderboards-responses.interface';
import { expect } from '@jest/globals';

/**
 * test scenario for leaderboardsSlice Thunk
 *
 * - fetchLeaderboards thunk function
 *  - should dispatch action correctly when data fetching success
 *  - should dispatch action correctly when data fetching failed
 *
 */

// Mocking API module
jest.mock('@/configs/api', () => ({
  getLeaderBoards: jest.fn(),
}));

const mockedLeaderboards: LeaderboardType[] = [
  {
    user: {
      id: 'user-mQhLzINW_w5TxxYf',
      name: 'Dimas Saputra',
      email: 'dimas@dicoding.com',
      avatar:
        'https://ui-avatars.com/api/?name=Dimas Saputra&background=random',
    },
    score: 25,
  },
  {
    user: {
      id: 'user-aROWej8yYA1sOfHN',
      name: 'Dicoding',
      email: 'admin@dicoding.com',
      avatar: 'https://ui-avatars.com/api/?name=Dicoding&background=random',
    },
    score: 0,
  },
];

describe('fetchLeaderboards thunk function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch action correctly when data fetching success', async () => {
    const dispatch = jest.fn();

    (API.getLeaderBoards as jest.Mock).mockResolvedValueOnce({
      data: { data: { leaderboards: mockedLeaderboards } },
    });

    await fetchLeaderboards()(dispatch);

    expect(API.getLeaderBoards).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(
      setLeaderboardsLoading({ loading: true }),
    );
    expect(dispatch).toHaveBeenCalledWith(setLeaderboardsError({ error: '' }));
    expect(dispatch).toHaveBeenCalledWith(
      setLeaderboardsList({ list: mockedLeaderboards }),
    );
    expect(dispatch).toHaveBeenCalledWith(
      setLeaderboardsLoading({ loading: false }),
    );
  });

  it('should dispatch action correctly when data fetching failed', async () => {
    const dispatch = jest.fn();
    const errorMessage = '500 Server Error';
    (API.getLeaderBoards as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage),
    );

    await fetchLeaderboards()(dispatch);

    expect(API.getLeaderBoards).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(
      setLeaderboardsLoading({ loading: true }),
    );
    expect(dispatch).toHaveBeenCalledWith(setLeaderboardsError({ error: '' }));
    expect(dispatch).toHaveBeenCalledWith(setLeaderboardsList({ list: [] }));
    expect(dispatch).toHaveBeenCalledWith(
      setLeaderboardsError({ error: expect.any(String) as unknown as string }),
    );
    expect(dispatch).toHaveBeenCalledWith(
      setLeaderboardsLoading({ loading: false }),
    );
  });
});
