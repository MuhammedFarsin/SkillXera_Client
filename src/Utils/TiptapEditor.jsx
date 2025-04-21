import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { Mark } from "@tiptap/core";

import { FaBold, FaItalic, FaFillDrip, FaHighlighter } from "react-icons/fa";
import { useEffect, useState } from "react";

// FontSize Extension with responsive classes
const FontSize = Mark.create({
  name: "fontSize",
  
  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: (el) => el.getAttribute('class') || null,
        renderHTML: (attrs) => {
          if (!attrs.class) return {};
          return {
            class: attrs.class,
          };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: 'span[class]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', HTMLAttributes, 0];
  },

  addCommands() {
    return {
      setFontSize:
        (size) =>
        ({ commands }) => {
          return commands.setMark(this.name, { class: size });
        },
    };
  },
});

// Toolbar with updated font size options
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

      {/* Font Size Dropdown - Updated options */}
      <select
        onChange={(e) => {
          const size = e.target.value;
          // eslint-disable-next-line react/prop-types
          editor.chain().focus().setFontSize(size).run();
        }}
        className="p-1 rounded bg-gray-700 text-white text-sm"
        defaultValue=""
        title="Font Size"
      >
        <option value="" disabled>Font Size</option>
        <option value="text-xs lg:text-sm">Extra Small (Body)</option>
        <option value="text-sm lg:text-base">Small (Body)</option>
        <option value="text-xs lg:text-lg">Regular (Body)</option>
        <option value="text-[10px] lg:text-2xl">Button (Body)</option>
        <option value="text-lg lg:text-xl">Medium (Subheading)</option>
        <option value="text-xl lg:text-2xl">Large (Heading 3)</option>
        <option value="text-2xl lg:text-4xl">Extra Large (Heading 2)</option>
        <option value="text-3xl lg:text-6xl">XXL (Heading 1)</option>
      </select>

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

      {/* Highlight Color */}
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

// Main Editor with responsive prose classes
// eslint-disable-next-line react/prop-types
const TiptapEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      FontSize,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert bg-gray-800 p-3 rounded-b-md border border-gray-700 focus:outline-none min-h-[150px] text-white " +
          "prose-sm lg:prose-base " + // Base font size scaling
          "prose-h1:text-3xl lg:prose-h1:text-6xl " + // H1 sizes
          "prose-h2:text-xl lg:prose-h2:text-4xl " + // H2 sizes
          "prose-h3:text-lg lg:prose-h3:text-2xl " + // H3 sizes
          "prose-p:text-base lg:prose-p:text-lg", // Paragraph sizes
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="w-full">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;