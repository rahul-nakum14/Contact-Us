export const successResponse = (message: string, data: unknown = null) => ({
    success: true,
    message,
    data,
  });
  
  export const errorResponse = (message: string, error: unknown = null) => ({
    success: false,
    message,
    error,
  });
  