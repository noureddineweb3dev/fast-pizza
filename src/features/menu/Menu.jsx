import { useLoaderData } from 'react-router-dom';
import { getMenu } from '../../services/apiRestaurant';
import MenuItem from './MenuItem';
import MenuHero from './MenuHero';

function Menu() {
  const menu = useLoaderData();
  return (
    <>
      <MenuHero />
      <section className="py-8">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {menu.map((pizza) => (
            <MenuItem pizza={pizza} key={pizza.id} />
          ))}
        </ul>
      </section>
    </>
  );
}

export async function loader() {
  return await getMenu();
}

export default Menu;
