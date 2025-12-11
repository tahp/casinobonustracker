import casinoData from '../data/casino.json';

function getInitialCasinos() {
  try {
    const savedCasinos = localStorage.getItem('casinos');
    if (savedCasinos) {
      const parsedCasinos = JSON.parse(savedCasinos);
      // Basic validation to ensure it's an array
      if (Array.isArray(parsedCasinos)) {
        return parsedCasinos;
      }
    }
  } catch (error) {
    console.error("Failed to read casinos from localStorage", error);
    // If localStorage is corrupted, fall back to default
  }


  // If no saved data, process the default list from JSON
  return casinoData.map(casino => {
    const newCasino = {
      id: crypto.randomUUID(),
      name: casino.name,
      bonusReady: false,
      lastClaimed: null,
      dateAdded: Date.now(),
      resetTime: '', // Default value
      url: casino.url || '',
    };

    if (typeof casino.resetHourUTC === 'number') {
      // Convert UTC hour to a HH:mm string.
      const hour = String(casino.resetHourUTC).padStart(2, '0');
      newCasino.resetTime = `${hour}:00`;
    }
    // Note: resetIntervalHours from the JSON is not explicitly handled
    // by the existing timer logic. It will default to an empty resetTime,
    // which the user can set manually in the UI.

    return newCasino;
  });
}

export default getInitialCasinos;
