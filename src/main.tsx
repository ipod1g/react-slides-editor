import ReactDOM from 'react-dom/client';
import './global.css';
import '@/components/slideEditor/Quill/quill.css';
import Editor from './pages/editor';

ReactDOM.createRoot(document.getElementById('root')!).render(<Editor />);
