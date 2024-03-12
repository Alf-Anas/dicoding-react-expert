import API from '@/configs/api';
import { SESSION_STORAGE } from '@/constants';
import { AppDispatch } from '@/lib/store';
import ProcessingState from '@/types/processing-state.enum';
import { errorResponse } from '@/utils';
import { createSlice } from '@reduxjs/toolkit';

const registerSlice = createSlice({
  name: 'register',
  initialState: {
    status: ProcessingState.UNDEFINED as ProcessingState,
    error: '',
  },
  reducers: {
    setRegisterStatus(
      state,
      action: { payload: { status: ProcessingState }; type: string },
    ) {
      state.status = action.payload.status;
    },
    setRegisterError(
      state,
      action: { payload: { error: string }; type: string },
    ) {
      state.error = action.payload.error;
    },
  },
});

const fetchRegister = ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setRegisterStatus({ status: ProcessingState.IN_PROGRESS }));
    dispatch(setRegisterError({ error: '' }));

    try {
      const response = await API.postRegisterUser({ email, password, name });
      const eToken = response?.data?.data?.token || '';
      sessionStorage.setItem(SESSION_STORAGE.TOKEN, eToken);
      dispatch(setRegisterStatus({ status: ProcessingState.SUCCESS }));
    } catch (err) {
      sessionStorage.removeItem(SESSION_STORAGE.TOKEN);
      dispatch(setRegisterStatus({ status: ProcessingState.FAILURE }));
      dispatch(
        setRegisterError({
          error: `${new Date().toLocaleString()} - ${errorResponse(err)}`,
        }),
      );
    }
  };
};

export { fetchRegister };
export const { setRegisterStatus, setRegisterError } = registerSlice.actions;
export default registerSlice.reducer;
