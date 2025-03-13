export const HttpError = (status = 500, message = 'Internal server error!') => {
  const error = new Error(message);
  error.status = status;
  return error;
};
