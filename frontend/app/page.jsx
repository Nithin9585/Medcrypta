import { Button } from "@/components/ui/button";
import Link from 'next/link';


export default function Home() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center min-h-screen p-8 pb-20 gap-8 sm:gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Link href={"/Doctor/dashboard"}>
      <Button className="w-full sm:w-auto">
        Doctor 
      </Button>
      </Link>
      <Link href={"/Patient/dashboard"}>
      <Button className="w-full sm:w-auto">
        Patient 
      </Button>
      </Link>
      <Link href={"/Pharmasist/dashboard"}>
      <Button className="w-full sm:w-auto">
        Pharmasist 
      </Button>
      </Link>
      <Link href={"/Admin/dashboard"}>
      <Button className="w-full sm:w-auto">
        Admin 
      </Button>
      </Link>
    </div>
  );
}
