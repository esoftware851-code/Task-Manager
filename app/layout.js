import "./globals.css";

export const metadata = {
  title: "Tasker — Smart Task Manager",
  description: "A premium task management application to organize, track, and complete your tasks efficiently.",
  keywords: "task manager, productivity, todo, organize, tasker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}
