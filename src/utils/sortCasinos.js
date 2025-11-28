import { sortingStrategies } from "./sortingStrategies";

export function sortCasinos(casinos, mode = "timeLeft") {
  const sortFn = sortingStrategies[mode] || sortingStrategies.timeLeft;

  return casinos
    .map((c, index) => ({ ...c, _index: index })) // Tag with original index
    .sort(sortFn)
    .map(({ _index, ...c }) => c); // Strip helper index
}
