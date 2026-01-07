import { Info } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function AppHeader() {
  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/favicon.png" alt="PGP icon" width={32} height={32} className="h-8 w-8" />
          <div>
            <h1 className="text-xl font-bold text-foreground">PGP</h1>
            <p className="text-xs text-muted-foreground">v1.0.5</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="https://securelock.cypherfucker.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <Image src="/images/cypherfucker-icon.png" alt="Cypherfucker" width={28} height={28} className="h-7 w-7" />
          </Link>
          <Link
            href="https://github.com/cypherfucker/PGP"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors no-underline"
          >
            <Info className="h-4 w-4" />
            <span>About</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
