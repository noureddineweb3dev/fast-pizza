import Container from '../../layout/Container';

function MenuHero() {
  return (
    <section className="bg-gradient-to-r from-red-700 to-red-600 text-white rounded-xl mb-8">
      <Container className="py-12 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Freshly Baked. Fast Delivered.</h1>

        <p className="mx-auto mt-4 max-w-xl text-white/90">
          Choose from our handcrafted pizzas made with fresh ingredients and delivered hot to your
          door.
        </p>
      </Container>
    </section>
  );
}

export default MenuHero;
