import { HashRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Quiz } from './pages/Quiz';
import { Result } from './pages/Result';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/resultado" element={<Result />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
