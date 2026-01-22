import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { getMenu } from '../../services/apiRestaurant';
import { getAllGlobalRatings } from '../../store/globalRatingsSlice';
import MenuItem from './MenuItem';
import MenuHero from './MenuHero';
import MenuControls from './MenuControls';

function Menu() {
  const menu = useLoaderData();
  const [sortBy, setSortBy] = useState('default');
  const [activeCategory, setActiveCategory] = useState('all');
  const globalRatings = useSelector(getAllGlobalRatings);

  // 1. Filter Menu by Category
  const filteredMenu =
    activeCategory === 'all'
      ? menu
      : menu.filter((item) => item.category === activeCategory);

  // 2. Sort the Filtered Menu
  const sortedMenu = getSortedMenu(filteredMenu, sortBy, globalRatings);

  return (
    <>
      <MenuHero />

      <MenuControls
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Menu Grid */}
      <section className="py-8 min-h-[50vh]">
        <motion.ul
          layout
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {sortedMenu.map((pizza) => (
              <MenuItem pizza={pizza} key={pizza.id} />
            ))}
          </AnimatePresence>
        </motion.ul>

        {sortedMenu.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">No items found in this category.</p>
            <button
              onClick={() => setActiveCategory('all')}
              className="mt-4 text-red-500 hover:underline"
            >
              View all items
            </button>
          </div>
        )}
      </section>
    </>
  );
}

// REMOVED OLD LOCAL SORT BUTTON COMPONENT (Moved to MenuControls)

// SORTING LOGIC

function getSortedMenu(menu, sortBy, ratings) {
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

// LOADER

export async function loader() {
  return await getMenu();
}

export default Menu;
