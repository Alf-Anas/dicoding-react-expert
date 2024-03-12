import API from '@/configs/api';
import { SESSION_STORAGE } from '@/constants';
import { AppDispatch } from '@/lib/store';
import ProcessingState from '@/types/processing-state.enum';
import { errorResponse } from '@/utils';
import { createSlice } from '@reduxjs/toolkit';

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    status: ProcessingState.UNDEFINED as ProcessingState,
    error: '',
  },
  reducers: {
    setLoginStatus(
      state,
      action: { payload: { status: ProcessingState }; type: string },
    ) {
      state.status = action.payload.status;
    },
    setLoginError(state, action: { payload: { error: string }; type: string }) {
      state.error = action.payload.error;
    },
  },
});

const fetchLogin = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoginStatus({ status: ProcessingState.IN_PROGRESS }));
    dispatch(setLoginError({ error: '' }));

    try {
      const response = await API.postLoginUser({ email, password });
      const eToken = response?.data?.data?.token || '';
      sessionStorage.setItem(SESSION_STORAGE.TOKEN, eToken);
      dispatch(setLoginStatus({ status: ProcessingState.SUCCESS }));
    } catch (err) {
      sessionStorage.removeItem(SESSION_STORAGE.TOKEN);
      dispatch(setLoginStatus({ status: ProcessingState.FAILURE }));
      dispatch(
        setLoginError({
          error: `${new Date().toLocaleString()} - ${errorResponse(err)}`,
        }),
      );
    }
  };
};

export { fetchLogin };
export const { setLoginStatus, setLoginError } = loginSlice.actions;
export default loginSlice.reducer;
