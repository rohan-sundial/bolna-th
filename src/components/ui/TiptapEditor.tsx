import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import cx from "classnames";
import {
  Bold,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  title: string;
}

function ToolbarButton({
  onClick,
  isActive,
  children,
  title,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cx(
        "p-1.5 rounded",
        "transition-colors",
        isActive
          ? "bg-terracotta-100 text-terracotta-700"
          : "text-charcoal-500 hover:bg-cream-200 hover:text-charcoal-700",
      )}
    >
      {children}
    </button>
  );
}

export function TiptapEditor({
  content,
  onChange,
  placeholder = "",
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cx(
          "prose prose-sm max-w-none",
          "min-h-[80px] p-3",
          "focus:outline-none",
          "text-charcoal-700",
          "[&_p]:my-1",
          "[&_h1]:text-lg [&_h1]:font-semibold [&_h1]:my-2",
          "[&_h2]:text-base [&_h2]:font-semibold [&_h2]:my-1.5",
          "[&_h3]:text-sm [&_h3]:font-semibold [&_h3]:my-1",
          "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1",
          "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1",
          "[&_li]:my-0.5",
        ),
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [editor, content]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={cx(
        "border border-cream-300 rounded-md",
        "bg-white",
        "overflow-hidden",
        "h-full flex flex-col",
      )}
    >
      {/* Toolbar */}
      <div
        className={cx(
          "flex items-center gap-0.5 px-2 py-1.5",
          "border-b border-cream-300/50",
          "bg-cream-50/50",
          "shrink-0",
        )}
      >
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-4 bg-cream-300 mx-1" />

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-4 bg-cream-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0 overflow-auto">
        <EditorContent
          editor={editor}
          className="h-full [&>.tiptap]:h-full [&>.tiptap]:overflow-auto"
        />
      </div>
    </div>
  );
}
