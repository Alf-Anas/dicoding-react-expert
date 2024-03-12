import API from '@/configs/api';
import { AppDispatch } from '@/lib/store';
import ProcessingState from '@/types/processing-state.enum';
import { errorResponse } from '@/utils';
import { createSlice } from '@reduxjs/toolkit';

const newThreadSlice = createSlice({
  name: 'new-thread',
  initialState: {
    status: ProcessingState.UNDEFINED as ProcessingState,
    error: '',
  },
  reducers: {
    setNewThreadStatus(
      state,
      action: { payload: { status: ProcessingState }; type: string },
    ) {
      state.status = action.payload.status;
    },
    setNewThreadError(
      state,
      action: { payload: { error: string }; type: string },
    ) {
      state.error = action.payload.error;
    },
  },
});

const fetchNewThread = ({
  title,
  category,
  body,
}: {
  title: string;
  category?: string;
  body: string;
}) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setNewThreadStatus({ status: ProcessingState.IN_PROGRESS }));
    dispatch(setNewThreadError({ error: '' }));

    try {
      await API.postCreateThread({ title, body, category });
      dispatch(setNewThreadStatus({ status: ProcessingState.SUCCESS }));
    } catch (err) {
      dispatch(setNewThreadStatus({ status: ProcessingState.FAILURE }));
      dispatch(
        setNewThreadError({
          error: `${new Date().toLocaleString()} - ${errorResponse(err)}`,
        }),
      );
    }
  };
};

export { fetchNewThread };
export const { setNewThreadStatus, setNewThreadError } = newThreadSlice.actions;
export default newThreadSlice.reducer;
