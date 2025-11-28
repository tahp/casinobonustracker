// src/utils/sortingStrategies.js

const getNextReset = (casino) => {
  if (!casino.resetTime) return null;
  const [hours, minutes] = casino.resetTime.split(":").map(Number);
  let target = casino.lastClaimed ? new Date(casino.lastClaimed) : new Date();
  target.setHours(hours, minutes, 0, 0);
  if (target <= (casino.lastClaimed ? new Date(casino.lastClaimed) : new Date())) {
    target.setDate(target.getDate() + 1);
  }
  return target;
};

const timeLeft = (a, b) => {
  const now = Date.now();
  const aTarget = getNextReset(a);
  const bTarget = getNextReset(b);
  const aLeft = aTarget ? aTarget.getTime() - now : Infinity;
  const bLeft = bTarget ? bTarget.getTime() - now : Infinity;
  if (aLeft !== bLeft) return aLeft - bLeft;
  return a._index - b._index;
};

const resetTime = (a, b) => {
  const aTarget = getNextReset(a);
  const bTarget = getNextReset(b);
  const aReset = aTarget?.getTime() || Infinity;
  const bReset = bTarget?.getTime() || Infinity;
  if (aReset !== bReset) return aReset - bReset;
  return a._index - b._index;
};

const alpha = (a, b) => {
  const nameCompare = a.name.localeCompare(b.name);
  if (nameCompare !== 0) return nameCompare;
  return a._index - b._index;
};

export const sortingStrategies = {
  timeLeft,
  resetTime,
  alpha,
};