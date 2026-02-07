export function formatCurrency(value) {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}
  }).format(value);
}

export function getSortedMenu(menu, sortBy, ratings) {
  let sorted = [...menu];

  const getRating = (id) => ratings[id]?.average || 0;

  switch (sortBy) {
    case 'rating-high':
      // Sort by average rating (highest first)
      sorted.sort((a, b) => {
        const ratingA = getRating(a.id);
        const ratingB = getRating(b.id);

        // Pizzas with no ratings go to end
        if (ratingA === 0) return 1;
        if (ratingB === 0) return -1;

        return ratingB - ratingA;
      });
      break;

    case 'rating-low':
      // Sort by average rating (lowest first)
      sorted.sort((a, b) => {
        const ratingA = getRating(a.id);
        const ratingB = getRating(b.id);

        // Pizzas with no ratings go to end
        if (ratingA === 0) return 1;
        if (ratingB === 0) return -1;

        return ratingA - ratingB;
      });
      break;

    case 'price-low':
      // Sort by price (low to high)
      sorted.sort((a, b) => a.unitPrice - b.unitPrice);
      break;

    case 'price-high':
      // Sort by price (high to low)
      sorted.sort((a, b) => b.unitPrice - a.unitPrice);
      break;

    case 'default':
    default:
      // Keep original order
      break;
  }

  return sorted;
}
