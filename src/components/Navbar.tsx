import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
const Navbar = () => {
  return <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
            Contact
          </Link>
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
            About us
          </Link>
        </div>
        
        <Link to="/" className="absolute left-1/2 -translate-x-1/2">
          <h1 className="text-xl tracking-wider text-center font-mono font-normal">RAAGA</h1>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Log in
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="outline" size="sm" className="rounded-full border-foreground/20 hover:bg-foreground hover:text-background transition-all">
              Sign up
            </Button>
          </Link>
        </div>
      </div>
    </nav>;
};
export default Navbar;