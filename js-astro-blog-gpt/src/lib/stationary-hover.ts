/** A movement restarts the dwell time, including movement within the same item. */
export function stationaryHover<T>(delay: number, onDwell: (item: T) => void) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const cancel = () => {
    clearTimeout(timer);
    timer = undefined;
  };
  return {
    cancel,
    move(item: T) {
      cancel();
      timer = setTimeout(() => {
        timer = undefined;
        onDwell(item);
      }, delay);
    },
  };
}
