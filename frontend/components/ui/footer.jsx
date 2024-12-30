import Link from "next/link";
export default function Footer() {
    return (
        <footer className="border-t border-[#166534] py-4 mt-4">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                <Link href="/" className="relative inline-block text-gray-500 hover:text-gray-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-[20px] after:h-[2px] after:bg-gradient-to-r after:from-[#38ef7d] after:to-[#4ade80] after:transition-all after:duration-500 hover:after:w-full hover:after:scale-x-100 hover:after:translate-y-1">
                Medcrypta<span className="text-green-500 pl-2 ">+</span></Link>
                </div>
                <div className="flex space-x-4 mb-4 md:mb-0">
                    <a href="/" className="hover:underline">Home</a>
                    <a href="/blog" className="hover:underline">Blog</a>
                    <a href="/Contact" className="hover:underline">Contact</a>
                    <a href="/about" className="hover:underline">About</a>

                </div>
               <div className="flex space-x-4 pr-5">
                <h7>Follow us :</h7>
 <a href="https://instagram.com" className="hover:underline">
   <svg xmlns="http://www.w3.org/2000/svg" fill="red" x="0px" y="0px" width="30" height="30" viewBox="0 0 50 50">
<path d="M 16 3 C 8.8324839 3 3 8.8324839 3 16 L 3 34 C 3 41.167516 8.8324839 47 16 47 L 34 47 C 41.167516 47 47 41.167516 47 34 L 47 16 C 47 8.8324839 41.167516 3 34 3 L 16 3 z M 16 5 L 34 5 C 40.086484 5 45 9.9135161 45 16 L 45 34 C 45 40.086484 40.086484 45 34 45 L 16 45 C 9.9135161 45 5 40.086484 5 34 L 5 16 C 5 9.9135161 9.9135161 5 16 5 z M 37 11 A 2 2 0 0 0 35 13 A 2 2 0 0 0 37 15 A 2 2 0 0 0 39 13 A 2 2 0 0 0 37 11 z M 25 14 C 18.936712 14 14 18.936712 14 25 C 14 31.063288 18.936712 36 25 36 C 31.063288 36 36 31.063288 36 25 C 36 18.936712 31.063288 14 25 14 z M 25 16 C 29.982407 16 34 20.017593 34 25 C 34 29.982407 29.982407 34 25 34 C 20.017593 34 16 29.982407 16 25 C 16 20.017593 20.017593 16 25 16 z"></path>
</svg></a>
<a href="https://twitter.com" className="hover:underline">
<svg xmlns="http://www.w3.org/2000/svg" fill="blue" x="0px" y="0px" width="30" height="30" viewBox="0 0 24 24">
<path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.949.555-2.005.959-3.127 1.184-.897-.959-2.178-1.559-3.594-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124-4.087-.205-7.719-2.165-10.148-5.144-.422.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.496 14-13.986 0-.21 0-.423-.015-.637.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"/>
</svg>
</a>
<a href="https://linkedin.com" className="hover:underline">
<svg xmlns="http://www.w3.org/2000/svg" fill="blue" x="0px" y="0px" width="30" height="30" viewBox="0 0 50 50">
    <path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z"></path>
</svg>
</a>
<a href="https://youtube.com" className="hover:underline">
<svg xmlns="http://www.w3.org/2000/svg" x="0px" fill="red" y="0px" width="30" height="30" viewBox="0 0 50 50">
<path d="M 44.898438 14.5 C 44.5 12.300781 42.601563 10.699219 40.398438 10.199219 C 37.101563 9.5 31 9 24.398438 9 C 17.800781 9 11.601563 9.5 8.300781 10.199219 C 6.101563 10.699219 4.199219 12.199219 3.800781 14.5 C 3.398438 17 3 20.5 3 25 C 3 29.5 3.398438 33 3.898438 35.5 C 4.300781 37.699219 6.199219 39.300781 8.398438 39.800781 C 11.898438 40.5 17.898438 41 24.5 41 C 31.101563 41 37.101563 40.5 40.601563 39.800781 C 42.800781 39.300781 44.699219 37.800781 45.101563 35.5 C 45.5 33 46 29.398438 46.101563 25 C 45.898438 20.5 45.398438 17 44.898438 14.5 Z M 19 32 L 19 18 L 31.199219 25 Z"></path>
</svg>
</a>
</div>
            </div>
        </footer>
    );
}