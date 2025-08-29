import React from "react";
import { Home as HomeIcon, Settings, HelpCircle } from "lucide-react";
import CoopForm from "@/components/CoopForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3" data-testid="header-brand">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <HomeIcon className="text-primary-foreground text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Chicken Coop Blueprint Generator</h1>
                <p className="text-sm text-muted-foreground">AI-powered coop design & planning</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-help"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
              <button 
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-bg py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <CoopForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <HomeIcon className="text-primary-foreground text-sm" />
                </div>
                <span className="font-semibold text-foreground">Coop Blueprint Generator</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                AI-powered chicken coop design tool that creates custom blueprints, materials lists, and step-by-step instructions for your backyard poultry housing needs.
              </p>
              <div className="flex items-center space-x-4">
                <span className="text-xs text-muted-foreground">© 2024 Blueprint Generator</span>
                <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
                <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms</a>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Design Gallery</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Building Tips</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Material Guide</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Feedback</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
