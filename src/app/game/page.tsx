import Grid from "../ui/game";
import Image from 'next/image';

export default function Game() {
  return (
    
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        
      </header>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image src='/BlackAdultCat.png' height={80} width={60} alt="Black Adult Cat"/>
        <Image src='/BlackKitten.png' height={70} width={50} alt="Black Kitten"/>
        <Grid/>
        <Image src="/CalicoAdultCat.png" height={80} width={60} alt="Calico Adult Cat"/>
        <Image src='/CalicoKitten.png' height={70} width={50} alt="Calico Kitten"/>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        
      </footer>
    </div>
  );
}
