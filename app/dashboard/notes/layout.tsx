export default function NotesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen max-h-screen overflow-y-auto">
      {children}
    </div>
  );
}
