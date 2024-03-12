import API from '@/configs/api';
import { SESSION_STORAGE } from '@/constants';
import { AppDispatch } from '@/lib/store';
import ProcessingState from '@/types/processing-state.enum';
import { ProfileResponsesType } from '@/types/profile-responses.interface';
import { errorResponse } from '@/utils';
import { createSlice } from '@reduxjs/toolkit';

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    status: ProcessingState.UNDEFINED as ProcessingState,
    data: {} as ProfileResponsesType,
    error: '',
  },
  reducers: {
    setProfileData(
      state,
      action: { payload: { data: ProfileResponsesType }; type: string },
    ) {
      state.data = action.payload.data;
    },
    setProfileStatus(
      state,
      action: { payload: { status: ProcessingState }; type: string },
    ) {
      state.status = action.payload.status;
    },
    setProfileError(
      state,
      action: { payload: { error: string }; type: string },
    ) {
      state.error = action.payload.error;
    },
  },
});

const fetchProfile = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(setProfileStatus({ status: ProcessingState.IN_PROGRESS }));
    dispatch(setProfileError({ error: '' }));

    try {
      const response = await API.getUserProfile();
      const eData = response?.data?.data?.user || {};
      sessionStorage.setItem(SESSION_STORAGE.PROFILE, JSON.stringify(eData));
      dispatch(setProfileData({ data: eData }));
    } catch (err) {
      dispatch(setProfileData({ data: {} as ProfileResponsesType }));
      dispatch(
        setProfileError({
          error: `${new Date().toLocaleString()} - ${errorResponse(err)}`,
        }),
      );
    } finally {
      dispatch(setProfileStatus({ status: ProcessingState.FAILURE }));
    }
  };
};

export { fetchProfile };
export const { setProfileData, setProfileError, setProfileStatus } =
  profileSlice.actions;
export default profileSlice.reducer;
