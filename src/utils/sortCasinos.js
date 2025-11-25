function getNextReset(casino) {
  if (!casino.resetTime) return null;
  const [hours, minutes] = casino.resetTime.split(":").map(Number);
  let target = casino.lastClaimed ? new Date(casino.lastClaimed) : new Date();
  target.setHours(hours, minutes, 0, 0);
  if (target <= (casino.lastClaimed ? new Date(casino.lastClaimed) : new Date())) {
    target.setDate(target.getDate() + 1);
  }
  return target;
}

export function sortCasinos(casinos, mode = "timeLeft") {
  const now = Date.now();

  return casinos
    .map((c, index) => ({ ...c, _index: index })) // tag with original index
    .sort((a, b) => {
      const aTarget = getNextReset(a);
      const bTarget = getNextReset(b);

      const aLeft = aTarget ? aTarget.getTime() - now : Infinity;
      const bLeft = bTarget ? bTarget.getTime() - now : Infinity;

      if (mode === "timeLeft") {
        if (aLeft !== bLeft) return aLeft - bLeft;
        return a._index - b._index; // preserve original order
      }
      if (mode === "resetTime") {
        const aReset = aTarget?.getTime() || Infinity;
        const bReset = bTarget?.getTime() || Infinity;
        if (aReset !== bReset) return aReset - bReset;
        return a._index - b._index; // preserve original order
      }
      if (mode === "alpha") {
        const nameCompare = a.name.localeCompare(b.name);
        if (nameCompare !== 0) return nameCompare;
        return a._index - b._index; // preserve original order
      }
      return aLeft - bLeft;
    })
    .map(({ _index, ...c }) => c); // strip helper index
}
