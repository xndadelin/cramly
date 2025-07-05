'use client';

import { Sidebar } from "@/components/ui/sidebar";
import { RichTextEditor } from "@/components/rich-text-editor";

export default function Studies() {
  return (
    <div className="flex min-h-screen max-h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <h1 className="text-3xl font-bold mb-6">Notes</h1>
        <div className="flex-1 overflow-y-auto pr-4">
          <RichTextEditor />
        </div>
      </div>
    </div>
  );
}
