export const getCurrentTime = () => {
  const current = new Date();
  const hours = current.getHours().toString().padStart(2, '0');
  const minutes = current.getMinutes().toString().padStart(2, '0');
  const seconds = current.getSeconds().toString().padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};
