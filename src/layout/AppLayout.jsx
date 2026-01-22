import { useNavigation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Container from './Container';
import AnimatedOutlet from '../ui/AnimatedOutlet';
import PageSkeleton from '../ui/PageSkeleton';

import BackToTop from '../ui/BackToTop';

function AppLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-12">
        <Container>{isLoading ? <PageSkeleton /> : <AnimatedOutlet />}</Container>
      </main>

      <BackToTop />
      <Footer />
    </div>
  );
}

export default AppLayout;
