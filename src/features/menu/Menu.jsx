import { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { getMenu } from '../../services/apiRestaurant';
import { getAllGlobalRatings, fetchAllRatingsFromBackend } from '../../store/globalRatingsSlice';
import { getSortedMenu } from '../../utils/helpers';
import MenuItem from './MenuItem';
import MenuHero from './MenuHero';
import MenuControls from './MenuControls';

function Menu() {
  const dispatch = useDispatch();
  const menu = useLoaderData();
  const [sortBy, setSortBy] = useState('default');
  const [activeCategory, setActiveCategory] = useState('all');
  const globalRatings = useSelector(getAllGlobalRatings);

  // Fetch global ratings from backend on mount
  useEffect(() => {
    dispatch(fetchAllRatingsFromBackend());
  }, [dispatch]);

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

// LOADER

export async function loader() {
  return await getMenu();
}

export default Menu;
