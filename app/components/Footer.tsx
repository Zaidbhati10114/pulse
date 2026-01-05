import Link from "next/link";
import { Zap, Twitter, Github, Linkedin, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl gradient-bg">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">Pulse</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md mb-4">
              Stay ahead with AI-curated tech news delivered to your inbox. From
              startups to AI breakthroughs, we've got you covered.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="p-2 rounded-lg bg-secondary hover:bg-muted transition-colors"
              >
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-secondary hover:bg-muted transition-colors"
              >
                <Github className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-secondary hover:bg-muted transition-colors"
              >
                <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Newsletter</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/subscribe"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Subscribe
                </Link>
              </li>
              <li>
                <Link
                  href="/archive"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Archive
                </Link>
              </li>
              <li>
                <Link
                  href="/unsubscribe"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Unsubscribe
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-muted-foreground">
                  🚀 Startups
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">🤖 AI</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  💻 Dev/Web
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  🇮🇳 India Tech
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Pulse. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-primary fill-primary" />{" "}
            for tech enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
