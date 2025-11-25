// utils/sortCasinos.js

/**
 * Compute the next reset timestamp for a given casino card.
 * - If lastClaimed exists, base the next reset off that timestamp + picker time.
 * - Otherwise, use today's picker time (roll forward if already passed).
 */
function getNextReset(casino) {
  if (!casino.resetTime) return Infinity;

  const [hours, minutes] = casino.resetTime.split(":").map(Number);
  let target;

  if (casino.lastClaimed) {
    target = new Date(casino.lastClaimed);
    target.setHours(hours, minutes, 0, 0);

    // If the reset time has already passed relative to lastClaimed, roll forward
    if (target <= new Date(casino.lastClaimed)) {
      target.setDate(target.getDate() + 1);
    }
  } else {
    target = new Date();
    target.setHours(hours, minutes, 0, 0);

    // If reset time already passed today, roll forward to tomorrow
    if (target <= new Date()) {
      target.setDate(target.getDate() + 1);
    }
  }

  return target.getTime();
}

/**
 * Sort casinos by next reset time (soonest first).
 * If two casinos have the same reset time, sort alphabetically by name.
 */
export function sortCasinos(casinos) {
  return [...casinos].sort((a, b) => {
    const aReset = getNextReset(a);
    const bReset = getNextReset(b);

    if (aReset === bReset) {
      return a.name.localeCompare(b.name);
    }
    return aReset - bReset;
  });
}
