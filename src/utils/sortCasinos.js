// utils/sortCasinos.js
export function sortCasinos(casinos) {
  const getNextReset = (casino) => {
    if (!casino.resetTime) return Infinity;

    const [hours, minutes] = casino.resetTime.split(":").map(Number);
    let target = new Date();

    // If casino has lastClaimed, base next reset off that
    if (casino.lastClaimed) {
      target = new Date(casino.lastClaimed);
      target.setHours(hours, minutes, 0, 0);
      if (target <= new Date(casino.lastClaimed)) {
        target.setDate(target.getDate() + 1);
      }
    } else {
      target.setHours(hours, minutes, 0, 0);
      if (target <= new Date()) {
        target.setDate(target.getDate() + 1);
      }
    }

    return target.getTime();
  };

  return [...casinos].sort((a, b) => {
    const aReset = getNextReset(a);
    const bReset = getNextReset(b);

    if (aReset === bReset) {
      // fallback: alphabetical by name
      return a.name.localeCompare(b.name);
    }
    return aReset - bReset;
  });
}
