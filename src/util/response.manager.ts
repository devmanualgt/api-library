export const response = (status: boolean, message: string, records?: any) => {
  try {
    return {
      status,
      message,
      records,
    };
  } catch (error) {
    return error;
  }
};
