// GEOLOCATION HELPERS

//  * Get user's current position

export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    // Check if geolocation is available
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    // Get current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }

        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000, // 10 seconds
        maximumAge: 0,
      }
    );
  });
}

// Reverse geocode coordinates to address

export async function getAddressFromCoordinates(latitude, longitude) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en', // Get results in English
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch address');
    }

    const data = await response.json();

    // Extract address components
    const address = data.address || {};

    // Build formatted address
    const parts = [];

    // Street
    if (address.road) parts.push(address.road);
    if (address.house_number) parts[0] = `${address.house_number} ${parts[0] || ''}`;

    // City
    if (address.city || address.town || address.village) {
      parts.push(address.city || address.town || address.village);
    }

    // State/Region
    if (address.state) parts.push(address.state);

    // Country
    if (address.country) parts.push(address.country);

    return parts.filter(Boolean).join(', ') || data.display_name;
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error('Failed to convert coordinates to address');
  }
}

// Get user's address using geolocation

export async function getUserAddress() {
  try {
    // Get coordinates
    const { latitude, longitude } = await getCurrentPosition();

    // Convert to address
    const address = await getAddressFromCoordinates(latitude, longitude);

    return {
      success: true,
      address,
      coordinates: { latitude, longitude },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
