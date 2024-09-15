import { Github } from "lucide-react";
import { Button } from "../ui/button";
import { ModeToggle } from "./ToggleButton";

export default function Header() {
  return (
    <header className="flex justify-between items-center py-4">
      <h1 className="text-2xl font-bold">Image Processor</h1>
      <div className="flex items-center space-x-4">
        <ModeToggle />
        <Button variant="ghost" size="icon" asChild>
          <a
            href="https://github.com/suryanshsingh2001/FilterPixel-Task"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </a>
        </Button>
      </div>
    </header>
  );
}
