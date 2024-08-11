import InjectLayout from './layout';
import SirenCustomView from '@/router/core/CustomView';

function App() {
  return (
    <>
      <InjectLayout></InjectLayout>
      <SirenCustomView />
    </>
  );
}

export default App;
