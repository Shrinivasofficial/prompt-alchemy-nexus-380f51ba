
import React from "react";

export default function AuthLayout({
  image,
  children,
  headline,
  description,
}: {
  image?: string;
  children: React.ReactNode;
  headline: string;
  description?: string;
}) {
  return (
    <div className="min-h-screen w-full flex bg-background">
      <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-400">
        {image ? (
          <img
            src={image}
            alt=""
            className="object-cover h-full w-full opacity-80"
            style={{ maxHeight: "100vh" }}
          />
        ) : (
          <div className="text-white p-10 space-y-6 flex flex-col items-center">
            <span className="text-3xl font-bold">Welcome!</span>
            <span className="opacity-70 text-lg">
              AI Prompts made simple, creative and collaborative.
            </span>
          </div>
        )}
      </div>
      <div className="w-full md:max-w-lg flex flex-col justify-center min-h-screen px-6 py-12 animate-fade-in bg-card shadow-xl">
        <div>
          <h1 className="text-3xl font-bold mb-2">{headline}</h1>
          {description && (
            <p className="mb-6 text-muted-foreground">{description}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
