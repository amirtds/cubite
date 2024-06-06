"use client";
import React, { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "editorjs-header-with-alignment";
import List from "@editorjs/list";
import Paragraph from "editorjs-paragraph-with-alignment";
import Quote from "@editorjs/quote";
import Delimiter from "@editorjs/delimiter";
import Alert from "editorjs-alert";
import Checklist from "@editorjs/checklist";
import Table from "@editorjs/table";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import Underline from "@editorjs/underline";
import Tooltip from "editorjs-tooltip";
import Strikethrough from "@sotaproject/strikethrough";
import Image from "@/app/plugins/image/index";
import Embed from "@editorjs/embed";
import CheckBox from "@/app/plugins/problem-checkbox/index";
import MultipleChoice from "@/app/plugins/problem-multiple-choice/index";
import Poll from "@/app/plugins/poll/index";

interface Content {
  time: number;
  blocks: any[];
  version: string;
}

interface EditorProps {
  savedContent: Content | null;
  onChange: (content: Content) => void;
}

const Editor = ({ savedContent, onChange }: EditorProps) => {
  const editorRef = useRef<EditorJS | null>(null);

  useEffect(() => {
    const initialContent = savedContent || {
      time: Date.now(),
      blocks: [],
      version: "2.29.1",
    };

    const editor = new EditorJS({
      holder: "editorjs",
      autofocus: true,
      placeholder: "Write course content...",
      data: initialContent, // Load saved content here
      tools: {
        header: Header,
        list: List,
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
        },
        quote: Quote,
        delimiter: Delimiter,
        alert: Alert,
        checklist: Checklist,
        table: Table,
        Marker: Marker,
        inlineCode: InlineCode,
        underline: Underline,
        tooltip: Tooltip,
        strikethrough: Strikethrough,
        embed: Embed,
        image: Image,
        checkbox: CheckBox,
        multipleChoice: MultipleChoice,
        poll: Poll,
      },
      onReady: () => {
        editorRef.current = editor;
      },
      onChange: async () => {
        const content = await editor.save();
        onChange(content); // Pass the content back to the parent component
      },
    });

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [savedContent, onChange]); // Re-run the effect if savedContent or onChange changes

  return (
    <div
      id="editorjs"
      className="border-2 border-dashed rounded-md py-12 my-12"
    ></div>
  );
};

export default Editor;
