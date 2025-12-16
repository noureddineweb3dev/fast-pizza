import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Container from './Container';

function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-6">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </div>
  );
}
export default AppLayout;
