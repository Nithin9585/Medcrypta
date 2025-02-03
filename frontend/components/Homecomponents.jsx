import Link from 'next/link';
import { Button } from './ui/button';
import { buttonData } from './config/Homecomponent.config';
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
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] p-8">
      <div>
      <Welcome/>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {buttonData.map((button, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{button.name}</CardTitle>
              <CardDescription>
                {button.description || 'Action card'} 
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {button.content || 'Card content'}
              </p>
            </CardContent>
            <CardFooter className="justify-end">
              <Link href={button.link} className="w-full">
                <Button className="w-full">
                  {button.cta || 'Get Started'} {/* Add CTA text in your config */}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Homecomponents;