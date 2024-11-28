declare global {
  interface ApiResponse<T> {
    status: string;
    message: string;
    data: T;
  }
}

export { ApiResponse };
