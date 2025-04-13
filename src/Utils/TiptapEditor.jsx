import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";

import {
  FaBold,
  FaItalic,
  FaFillDrip,
  FaHighlighter,
} from "react-icons/fa";
import { useState } from "react";
   // eslint-disable-next-line react/prop-types
const MenuBar = ({ editor }) => {
  const [textColor, setTextColor] = useState("#ef4444");
  const [highlightColor, setHighlightColor] = useState("#facc15");

  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-800 border border-gray-700 rounded-t-md">
      {/* Bold */}
      <button
        // eslint-disable-next-line react/prop-types
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-700 ${
          // eslint-disable-next-line react/prop-types
          editor.isActive("bold") ? "bg-gray-700" : ""
        }`}
        title="Bold"
      >
        <FaBold />
      </button>

      {/* Italic */}
      <button
         // eslint-disable-next-line react/prop-types
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-700 ${
             // eslint-disable-next-line react/prop-types
          editor.isActive("italic") ? "bg-gray-700" : ""
        }`}
        title="Italic"
      >
        <FaItalic />
      </button>

      {/* Text Color */}
      <label className="flex items-center gap-1 text-sm text-white">
        <FaFillDrip />
        <input
          type="color"
          value={textColor}
          onChange={(e) => {
            const color = e.target.value;
            setTextColor(color);
               // eslint-disable-next-line react/prop-types
            editor.chain().focus().setColor(color).run();
          }}
          className="w-6 h-6 p-0 border-none bg-transparent cursor-pointer"
          title="Text Color"
        />
      </label>

      {/* Background Highlight Color */}
      <label className="flex items-center gap-1 text-sm text-white">
        <FaHighlighter />
        <input
          type="color"
          value={highlightColor}
          onChange={(e) => {
            const color = e.target.value;
            setHighlightColor(color);
               // eslint-disable-next-line react/prop-types
            editor.chain().focus().setHighlight({ color }).run();
          }}
          className="w-6 h-6 p-0 border-none bg-transparent cursor-pointer"
          title="Highlight Background"
        />
      </label>
    </div>
  );
};

// eslint-disable-next-line react/prop-types
const TiptapEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }), // this allows different colors
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert bg-gray-800 p-3 rounded-b-md border border-gray-700 focus:outline-none min-h-[150px] text-white",
      },
    },
  });

  return (
    <div className="w-full">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
