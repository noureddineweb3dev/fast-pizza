import { useNavigation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Container from './Container';
import AnimatedOutlet from '../ui/AnimatedOutlet';
import PageSkeleton from '../ui/PageSkeleton';

function AppLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-6">
        <Container>{isLoading ? <PageSkeleton /> : <AnimatedOutlet />}</Container>
      </main>

      <Footer />
    </div>
  );
}

export default AppLayout;
