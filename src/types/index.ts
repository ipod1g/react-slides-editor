import Quill, {
  // QuillOptionsStatic,
  ClipboardStatic,
  History,
  KeyboardStatic,
} from 'quill';

export interface QuillInstance extends Quill {
  clipboard: ClipboardStatic;
  container: Element & { innerHTML: string };
  // options: QuillOptionsStatic;
  root: HTMLDivElement;
  keyboard: KeyboardStatic;
  history: History;
}
