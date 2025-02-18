"use client";
import Link from 'next/link';
import { Button } from './ui/button';
import { buttonData } from './config/Homecomponent.config';
import { motion, useViewportScroll } from "framer-motion";
import Marquee from './marque';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import Welcome from './Welcome';

function Homecomponents() {
  const { scrollY } = useViewportScroll();

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },  
    visible: (index) => ({
      opacity: 1,
      y: 0,
      scale: 1,  
      transition: {
        duration: 1, 
        ease: "easeOut",  
        delay: index * 0.3,  
      },
    }),
  };

  const imageVariants = {
    hover: { 
      scale: 1.05,  
      y: -10, 
      rotate: -5, 
      transition: { duration: 0.5, ease: "easeOut" },  
    }
  };
  
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] p-2">
      <div className='border-b-2'>
        <Welcome />
        <Marquee />
      </div>
      
      <div className="grid grid-cols-1 mt-5 rounded-lg p-10 dark:bg-gray-900 border-2 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {buttonData.map((button, index) => (
          <motion.div
            key={button.name} 
            className="hover:shadow-lg transition-shadow hover:bg-green-100 hover:border-3 dark:hover:border-green-600 rounded-md dark:hover:border-3 dark:hover:bg-green-900"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            custom={index}
          >
            <CardHeader>
              <CardTitle>{button.name}</CardTitle>
              <CardDescription>
                {button.description || 'Action card'}
              </CardDescription>
            </CardHeader>

            <CardContent className="relative overflow-hidden">
              {button.imgsrc && (
                <motion.img
                  src={button.imgsrc}
                  alt={button.name}
                  className="w-full h-80 bg-white object-cover rounded-md transition-transform duration-500 ease-in-out"
                  whileHover="hover"
                  variants={imageVariants}
                />
              )}
            </CardContent>

            <CardFooter className="justify-end">
              <Link href={button.link} className="w-full">
                <Button className="w-full">{button.cta || 'Get Started'}</Button>
              </Link>
            </CardFooter>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Homecomponents;
