export function useDayMood() {
  const hour = new Date().getHours();

  if (hour < 12)
    return { speed: 1, energy: 1, label: "morning" };
  if (hour < 18)
    return { speed: 1.4, energy: 1.3, label: "afternoon" };
  return { speed: 0.7, energy: 0.6, label: "evening" };
}
