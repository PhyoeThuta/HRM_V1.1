import React, { useRef, useEffect } from 'react';

export default function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const exec = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    handleInput();
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden flex flex-col h-full">
      <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 p-2 flex flex-wrap gap-2 items-center">
        <button type="button" onClick={() => exec('formatBlock', 'H1')} className="px-2 py-1 text-sm bg-white dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 font-bold">H1</button>
        <button type="button" onClick={() => exec('formatBlock', 'H2')} className="px-2 py-1 text-sm bg-white dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 font-bold">H2</button>
        <button type="button" onClick={() => exec('bold')} className="px-2 py-1 text-sm bg-white dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 font-bold">B</button>
        <button type="button" onClick={() => exec('italic')} className="px-2 py-1 text-sm bg-white dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 italic">I</button>
        <button type="button" onClick={() => exec('insertUnorderedList')} className="px-2 py-1 text-sm bg-white dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">• List</button>
        <button type="button" onClick={() => exec('insertOrderedList')} className="px-2 py-1 text-sm bg-white dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">1. List</button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="flex-1 p-4 bg-white dark:bg-gray-900 overflow-y-auto focus:outline-none prose dark:prose-invert max-w-none"
        style={{ minHeight: '300px' }}
      />
    </div>
  );
}
