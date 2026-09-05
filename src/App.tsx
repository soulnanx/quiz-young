import { HashRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Quiz } from './pages/Quiz';
import { Result } from './pages/Result';
import { Compare } from './pages/Compare';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/resultado" element={<Result />} />
        <Route path="/comparar" element={<Compare />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
