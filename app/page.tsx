"use client";
import Header from "./components/Header";
import { Test } from "./components/Test";

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-background">
        <Header />
        <Test />
      </div>
    </>
  );
}
