declare module '@uiw/react-md-editor' {
  import { ComponentType } from 'react';

  interface MDEditorProps {
    value?: string;
    onChange?: (value?: string) => void;
    preview?: 'live' | 'edit' | 'preview';
    height?: number;
    visibleDragbar?: boolean;
    hideToolbar?: boolean;
    [key: string]: any;
  }

  const MDEditor: ComponentType<MDEditorProps>;

  export default MDEditor;
}
