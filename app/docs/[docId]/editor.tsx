"use client";

import { useEditorStore } from "@/store/use-edit-store";
import FontFamily from "@tiptap/extension-font-family";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageResize from "tiptap-extension-resize-image";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { FontSizeExtension } from "@/extensions/font-size";
import { LineHeightExtension } from "@/extensions/line-height";
import { Ruler } from "./ruler";

export const Editor = () => {
  const { setEditor } = useEditorStore();

  const editor = useEditor({
    onCreate({ editor }) {
      setEditor(editor);
    },
    onDestroy() {
      setEditor(null);
    },
    onUpdate({ editor }) {
      setEditor(editor);
    },
    onTransaction({ editor }) {
      setEditor(editor);
    },
    onFocus({ editor }) {
      setEditor(editor);
    },
    onBlur({ editor }) {
      setEditor(editor);
    },
    onContentError({ editor }) {
      setEditor(editor);
    },
    editable: true,
    extensions: [
      StarterKit,
      TaskList,
      FontSizeExtension,
      LineHeightExtension.configure({
        types: ["heading", "paragraph"],
      }),
      TaskItem.configure({
        nested: true,
      }),
      Underline,
      TextStyle,
      Heading.configure({
        levels: [1, 2, 3, 4, 5],
      }),
      FontFamily.configure({
        types: ["textStyle"],
      }),
      Color.configure({
        types: ["textStyle"],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https"],
        HTMLAttributes: {
          class: "underline text-blue-500",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Table.configure({
        resizable: true,
        // resizable or add class
        // HTMLAttributes: {
        //   class: "table-fixed w-full m-0 overflow-hidden border-collapse",
        // },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class:
            "relative align-top border min-w-[1em] px-2 py-1.5 bg-background [&>*]:mb-0 text-left font-bold",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "relative align-top border min-w-[1em] px-2 py-1.5",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class:
            "block h-auto my-4 max-w-full [&.ProseMirror-selectednode]:outline [&.ProseMirror-selectednode]:outline-2 [&.ProseMirror-selectednode]:outline-primary",
        },
      }),
      ImageResize,
    ],
    editorProps: {
      attributes: {
        class:
          "focus:outline-none border bg-white flex flex-col min-h-[1056px] w-[816px] py-10 px-14 cursor-text",
      },
    },
    content: ``,
  });

  return (
    <div className="overflow-x-auto size-full print:p-0 print:bg-white print:overflow-visible">
      <Ruler />
      <div className="min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
