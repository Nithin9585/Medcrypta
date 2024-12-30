// components/Navbar.js
import Link from 'next/link';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ModeToggle } from './theme-btn';
export default function Navbar() {
  return (
    <nav className="bg-background/50 sticky top-0 backdrop-blur border-b p-4 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className=" text-2xl font-bold">
        <Link href="/" className="relative inline-block text-gray-500 hover:text-gray-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-[20px] after:h-[2px] after:bg-gradient-to-r after:from-[#38ef7d] after:to-[#4ade80] after:transition-all after:duration-500 hover:after:w-full hover:after:scale-x-100 hover:after:translate-y-1">
              MedCrypta<span className="text-green-500 pl-2 ">+</span></Link>
        </div>
      <div className="hidden md:flex space-x-4 items-center">
      <Link href="/" className="relative inline-block hover:text-gray-600 dark:hover:text-white ">
  Page 1
</Link>

<Link href="/blog" className="relative inline-block hover:text-gray-600  dark:hover:text-white">
  Page 2
</Link>

<Link href="/about" className="relative inline-block hover:text-gray-600  dark:hover:text-white">
  About Project
</Link>

<Link href="/Contact" className="relative inline-block hover:text-gray-600 dark:hover:text-white">
  Contact
</Link>


<div>
    <Button className="mx-1   dark:hover:text-white transition duration-300 ease-in-out" variant="outline">Login</Button>
    <Button className="mx-1    dark:hover:text-white transition duration-300 ease-in-out" variant="outline">Sign up</Button>
  </div>
  <ModeToggle />
</div>
        <div className="md:hidden">
          <Sheet>            

        
            <SheetTrigger>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </SheetTrigger>
            
            <SheetContent>
              <SheetHeader>
                <SheetTitle> <Link href="/" className="relative inline-block text-gray-500 hover:text-gray-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-[20px] after:h-[2px] after:bg-gradient-to-r after:from-[#38ef7d] after:to-[#4ade80] after:transition-all after:duration-500 hover:after:w-full hover:after:scale-x-100 hover:after:translate-y-1">
                Medcrypta<span className="text-green-500 pl-2 ">+</span></Link>
                </SheetTitle>
                <SheetDescription>
                  <div className="flex pt-10 flex-col gap-8 items-center">
                    <Link href="/" className=" hover:text-gray-200">About us</Link>
                    <Link href="/blog" className=" hover:text-gray-200">page 2</Link>
                    <Link href="/about" className=" hover:text-gray-200">page 3</Link>
                    <Link href="/Contact" className=" hover:text-gray-200">About Project</Link>
                    <div className="flex justify-center absolute bottom-0 left-0 w-full p-4">
                      <Button className="mx-3" variant="outline">Login</Button>
                      <Button className="mx-3" variant="outline">Sign up</Button>
                    </div>
                  </div>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
          <span className='mx-2'>
          <ModeToggle />

</span>

        </div>
      </div>
    </nav>
  );
}