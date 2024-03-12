export enum ProcessingState {
  UNDEFINED,
  IN_PROGRESS,
  SUCCESS,
  FAILURE,
  BG_PROGRESS,
}

export const isProcessingSuccess = (processingState: ProcessingState) =>
  ProcessingState.SUCCESS === processingState;
export const isProcessingFailure = (processingState: ProcessingState) =>
  ProcessingState.FAILURE === processingState;

export default ProcessingState;
