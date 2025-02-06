"use client";

import Link from "next/link";
import { PencilRuler, Users, Sparkles, Share2 } from "lucide-react";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight mb-6">
              Collaborative Whiteboarding,{" "}
              <span className="text-white/80">Simplified</span>
            </h1>
            <p className="mt-4 text-xl text-white/60 max-w-2xl mx-auto">
              Create, collaborate, and share beautiful diagrams and sketches
              with our intuitive whiteboarding tool.
            </p>
            <div className="mt-10 flex gap-4 justify-center">
              <Link href="/start">
                <Button
                  text="Start Drawing"
  className="border border-white"
                />
              </Link>
              <Link href="/signup">
                <Button
                  text="Sign Up Free"
                
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 border-2 border-white rounded-md">
              <PencilRuler className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Intuitive Drawing</h3>
              <p className="text-white/60">
                Simple yet powerful tools for creating professional diagrams
              </p>
            </Card>

            <Card className="p-6 border-2 border-white rounded-md">
              <Users className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Real-time Collaboration
              </h3>
              <p className="text-white/60">
                Work together with your team in real-time
              </p>
            </Card>

            <Card className="p-6 border-2 border-white rounded-md">
              <Sparkles className="h-12 w-12 text-pink-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Smart Features</h3>
              <p className="text-white/60">
                AI-powered suggestions and shape recognition
              </p>
            </Card>

            <Card className="p-6 border-2 border-white rounded-md">
              <Share2 className="h-12 w-12 text-cyan-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Easy Sharing</h3>
              <p className="text-white/60">
                Share your work with a simple link
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-12">
            Trusted by thousands of teams worldwide
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-50">
            <div className="h-12 w-32 bg-white/10 rounded-md" />
            <div className="h-12 w-32 bg-white/10 rounded-md" />
            <div className="h-12 w-32 bg-white/10 rounded-md" />
            <div className="h-12 w-32 bg-white/10 rounded-md" />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t border-white/10 bg-gradient-to-b from-black to-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to start collaborating?
          </h2>
          <p className="text-xl mb-10 text-white/80">
            Join thousands of teams who trust our platform for their visual
            collaboration needs.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <Button
                text="Get Started Free"
                  className="border border-white"
              />
            </Link>
            <Link href="/signin">
              <Button
                text="Sign In "
               
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
