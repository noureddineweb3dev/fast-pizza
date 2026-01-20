import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowUpDown, Star, TrendingUp, DollarSign } from 'lucide-react';
import { getMenu } from '../../services/apiRestaurant';
import { getPizzaAverageRating } from '../../store/globalRatingsSlice';
import MenuItem from './MenuItem';
import MenuHero from './MenuHero';

function Menu() {
  const menu = useLoaderData();
  const [sortBy, setSortBy] = useState('default');

  // Get sorted menu based on selection
  const sortedMenu = getSortedMenu(menu, sortBy, useSelector);

  return (
    <>
      <MenuHero />

      {/* Sort Controls */}
      <section className="mb-6">
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <ArrowUpDown className="w-5 h-5" />
              <span className="font-semibold">Sort by:</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <SortButton
                active={sortBy === 'default'}
                onClick={() => setSortBy('default')}
                icon={<Star className="w-4 h-4" />}
                label="Default"
              />

              <SortButton
                active={sortBy === 'rating-high'}
                onClick={() => setSortBy('rating-high')}
                icon={<TrendingUp className="w-4 h-4" />}
                label="Top Rated"
              />

              <SortButton
                active={sortBy === 'rating-low'}
                onClick={() => setSortBy('rating-low')}
                icon={<TrendingUp className="w-4 h-4 rotate-180" />}
                label="Lowest Rated"
              />

              <SortButton
                active={sortBy === 'price-low'}
                onClick={() => setSortBy('price-low')}
                icon={<DollarSign className="w-4 h-4" />}
                label="Price: Low to High"
              />

              <SortButton
                active={sortBy === 'price-high'}
                onClick={() => setSortBy('price-high')}
                icon={<DollarSign className="w-4 h-4" />}
                label="Price: High to Low"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Menu Grid */}
      <section className="py-8">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedMenu.map((pizza) => (
            <MenuItem pizza={pizza} key={pizza.id} />
          ))}
        </ul>
      </section>
    </>
  );
}

// SORT BUTTON COMPONENT

function SortButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
        active ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}

// SORTING LOGIC

function getSortedMenu(menu, sortBy, useSelector) {
  let sorted = [...menu];

  switch (sortBy) {
    case 'rating-high':
      // Sort by average rating (highest first)
      sorted.sort((a, b) => {
        const ratingA = useSelector(getPizzaAverageRating(a.id));
        const ratingB = useSelector(getPizzaAverageRating(b.id));

        // Pizzas with no ratings go to end
        if (ratingA === 0) return 1;
        if (ratingB === 0) return -1;

        return ratingB - ratingA;
      });
      break;

    case 'rating-low':
      // Sort by average rating (lowest first)
      sorted.sort((a, b) => {
        const ratingA = useSelector(getPizzaAverageRating(a.id));
        const ratingB = useSelector(getPizzaAverageRating(b.id));

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

// LOADER

export async function loader() {
  return await getMenu();
}

export default Menu;
