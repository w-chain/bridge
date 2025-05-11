export const useWait = (timeInMs: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeInMs));
}
