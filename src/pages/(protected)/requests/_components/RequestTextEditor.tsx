import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { useEffect } from "react";
import type { FieldValues } from "react-hook-form";
import type { Control, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  minHeight?: string;
  lineHeight?: string;
};

export const RequestTextEditor = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Start typing...",
  minHeight = "200px",
  lineHeight = "normal",
}: Props<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const editor = useEditor({
          extensions: [
            StarterKit.configure({
              underline: false,
              heading: {
                levels: [1, 2, 3],
              },
              bulletList: {
                HTMLAttributes: {
                  class: "list-disc pl-6 my-2",
                },
              },
              orderedList: {
                HTMLAttributes: {
                  class: "list-decimal pl-6 my-2",
                },
              },
              listItem: {
                HTMLAttributes: {
                  class: "mb-1",
                },
              },
            }),
            Underline,
          ],
          content: field.value || "",
          onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            field.onChange(html);
          },
          editorProps: {
            attributes: {
              class: "focus:outline-none min-h-[200px] p-4",
            },
          },
        });

        useEffect(() => {
          if (editor && field.value !== editor.getHTML()) {
            editor.commands.setContent(field.value || "");
          }
        }, [editor, field.value]);

        if (!editor) {
          return (
            <div
              className="border rounded p-4 bg-gray-50"
              style={{ minHeight }}
            >
              <div className="animate-pulse text-gray-400">
                Loading editor...
              </div>
            </div>
          );
        }

        const ToolbarButton = ({
          onClick,
          isActive,
          children,
          disabled = false,
        }: {
          onClick: () => void;
          isActive?: boolean;
          children: React.ReactNode;
          disabled?: boolean;
        }) => (
          <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              isActive ? "bg-gray-200 text-blue-600" : "text-gray-600"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {children}
          </button>
        );

        return (
          <FormItem className="gap-1">
            <FormLabel className="text-slate-500">{label}</FormLabel>
            <FormControl>
              <div className="border rounded overflow-hidden">
                {/* Toolbar */}
                <div className="border-b bg-gray-50 p-2 flex items-center gap-1 flex-wrap">
                  <ToolbarButton
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    isActive={editor.isActive("heading", { level: 1 })}
                  >
                    <Heading1 size={16} />
                  </ToolbarButton>

                  <ToolbarButton
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    isActive={editor.isActive("heading", { level: 2 })}
                  >
                    <Heading2 size={16} />
                  </ToolbarButton>

                  <ToolbarButton
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    isActive={editor.isActive("heading", { level: 3 })}
                  >
                    <Heading3 size={16} />
                  </ToolbarButton>

                  <div className="w-px h-6 bg-gray-300 mx-1" />

                  <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive("bold")}
                  >
                    <Bold size={16} />
                  </ToolbarButton>

                  <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive("italic")}
                  >
                    <Italic size={16} />
                  </ToolbarButton>

                  <ToolbarButton
                    onClick={() =>
                      editor.chain().focus().toggleUnderline().run()
                    }
                    isActive={editor.isActive("underline")}
                  >
                    <UnderlineIcon size={16} />
                  </ToolbarButton>

                  <div className="w-px h-6 bg-gray-300 mx-1" />

                  <ToolbarButton
                    onClick={() =>
                      editor.chain().focus().toggleBulletList().run()
                    }
                    isActive={editor.isActive("bulletList")}
                  >
                    <List size={16} />
                  </ToolbarButton>

                  <ToolbarButton
                    onClick={() =>
                      editor.chain().focus().toggleOrderedList().run()
                    }
                    isActive={editor.isActive("orderedList")}
                  >
                    <ListOrdered size={16} />
                  </ToolbarButton>

                  <ToolbarButton
                    onClick={() =>
                      editor.chain().focus().toggleBlockquote().run()
                    }
                    isActive={editor.isActive("blockquote")}
                  >
                    <Quote size={16} />
                  </ToolbarButton>

                  <div className="w-px h-6 bg-gray-300 mx-1" />

                  <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                  >
                    <Undo size={16} />
                  </ToolbarButton>

                  <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                  >
                    <Redo size={16} />
                  </ToolbarButton>
                </div>

                {/* Editor */}
                <div className="relative" style={{ minHeight }}>
                  <EditorContent
                    editor={editor}
                    className="[&_.ProseMirror]:outline-none [&_.ProseMirror]:p-4 [&_.ProseMirror]:min-h-[200px]
                               [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3 [&_h1]:mt-4
                               [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2 [&_h2]:mt-3
                               [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:mt-2
                               [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2
                               [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2
                               [&_li]:mb-1
                               [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:my-3
                               [&_p]:mb-2
                               [&_strong]:font-bold
                               [&_em]:italic
                               [&_u]:underline"
                    style={{ lineHeight }}
                  />

                  {editor.isEmpty && (
                    <div className="absolute top-4 left-4 text-gray-400 pointer-events-none text-sm">
                      {placeholder}
                    </div>
                  )}
                </div>
              </div>
            </FormControl>
            <FormMessage className="mt-1" />
          </FormItem>
        );
      }}
    />
  );
};
