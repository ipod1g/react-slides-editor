import ReactDOM from 'react-dom/client';
import './global.css';
import '@/components/slideEditor/Quill/quill.css';
import Editor from './pages/editor';
import MobileLock from './components/shared/MobileLock';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <main className="w-full h-full">
    <MobileLock />
    <Editor />
  </main>
);
