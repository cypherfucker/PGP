"use client"

import { useState } from "react"
import { KeyGeneration } from "@/components/key-generation"
import { Encrypt } from "@/components/encrypt"
import { Decrypt } from "@/components/decrypt"
import { AppHeader } from "@/components/app-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lock, Unlock, Key } from "lucide-react"
import Image from "next/image"

export default function Home() {
  const [activeTab, setActiveTab] = useState("generate")

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image src="/images/pgp-icon.png" alt="PGP Icon" width={40} height={40} className="h-10 w-10" />
            <h1 className="text-4xl font-bold text-foreground">PGP</h1>
          </div>
          <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-muted/30 px-8 py-6">
            <p className="text-muted-foreground text-lg">
              Generate keys, encrypt and decrypt messages completely offline.
            </p>
            <p className="text-muted-foreground text-lg mt-1">Your keys never leave your browser.</p>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span>Fully Offline • Zero Server Calls • Privacy First</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="generate" className="gap-2">
              <Key className="h-4 w-4 text-accent" />
              Generate Keys
            </TabsTrigger>
            <TabsTrigger value="encrypt" className="gap-2">
              <Lock className="h-4 w-4 text-accent" />
              Encrypt
            </TabsTrigger>
            <TabsTrigger value="decrypt" className="gap-2">
              <Unlock className="h-4 w-4 text-accent" />
              Decrypt
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="mt-0">
            <KeyGeneration />
          </TabsContent>

          <TabsContent value="encrypt" className="mt-0">
            <Encrypt />
          </TabsContent>

          <TabsContent value="decrypt" className="mt-0">
            <Decrypt />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-muted-foreground space-y-4">
          {/* Social/contact icons row */}
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://github.cypherfucker.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
              title="GitHub"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                  fill="#36b3fd"
                />
              </svg>
            </a>
            <a
              href="mailto:cypherfucker@cypherfucker.com?subject=PGP%2001F12D0E8BB91FBFDCCF0FCD689073ADCD1E9288"
              className="hover:opacity-70 transition-opacity"
              title="Email"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  stroke="#36b3fd"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href="https://key.cypherfucker.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
              title="PGP Keys"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"
                  stroke="#36b3fd"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href="https://open-collective.cypherfucker.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
              title="Open Collective"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="#36b3fd" strokeWidth="2" />
                <path
                  d="M15.5 7.5C16.88 8.88 16.88 11.12 15.5 12.5M15.5 16.5C18.26 13.74 18.26 9.26 15.5 6.5"
                  stroke="#36b3fd"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </a>
          </div>

          <div className="space-y-2">
            <p>Free and Open Source - Privacy by design</p>
            <p>
              <a
                href="https://github.com/cypherfucker/PGP/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity font-medium"
                style={{ color: "#36b3fd" }}
              >
                CC0
              </a>{" "}
              Public Domain - No Copyright Required
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
