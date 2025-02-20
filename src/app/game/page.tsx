import ReactBoopGame from "../ui/game";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <ReactBoopGame />
      </main>
    </div>
  );
}