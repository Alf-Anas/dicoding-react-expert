import API from '@/configs/api';
import { AppDispatch } from '@/lib/store';
import { LeaderboardType } from '@/types/leaderboards-responses.interface';
import { errorResponse } from '@/utils';
import { createSlice } from '@reduxjs/toolkit';

const leaderboardsSlice = createSlice({
  name: 'leaderboards',
  initialState: {
    loading: false,
    list: [] as LeaderboardType[],
    error: '',
  },
  reducers: {
    setLeaderboardsList(
      state,
      action: { payload: { list: LeaderboardType[] }; type: string },
    ) {
      state.list = action.payload.list;
    },
    setLeaderboardsLoading(
      state,
      action: { payload: { loading: boolean }; type: string },
    ) {
      state.loading = action.payload.loading;
    },
    setLeaderboardsError(
      state,
      action: { payload: { error: string }; type: string },
    ) {
      state.error = action.payload.error;
    },
  },
});

const fetchLeaderboards = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLeaderboardsLoading({ loading: true }));
    dispatch(setLeaderboardsError({ error: '' }));

    try {
      const response = await API.getLeaderBoards();
      const eData = response?.data?.data?.leaderboards || [];
      dispatch(setLeaderboardsList({ list: eData }));
    } catch (err) {
      dispatch(setLeaderboardsList({ list: [] }));
      dispatch(
        setLeaderboardsError({
          error: `${new Date().toLocaleString()} - ${errorResponse(err)}`,
        }),
      );
    } finally {
      dispatch(setLeaderboardsLoading({ loading: false }));
    }
  };
};

export { fetchLeaderboards };
export const {
  setLeaderboardsList,
  setLeaderboardsLoading,
  setLeaderboardsError,
} = leaderboardsSlice.actions;
export default leaderboardsSlice.reducer;
