"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Download, Copy, CheckCircle2 } from "lucide-react"
import * as openpgp from "openpgp"

type CurveType = "curve25519" | "ed25519" | "p256" | "p384" | "p521"

export function KeyGeneration() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [passphrase, setPassphrase] = useState("")
  const [curve, setCurve] = useState<CurveType>("curve25519")
  const [publicKey, setPublicKey] = useState("")
  const [privateKey, setPrivateKey] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedPublic, setCopiedPublic] = useState(false)
  const [copiedPrivate, setCopiedPrivate] = useState(false)
  const { toast } = useToast()

  const getPassphraseStrength = () => {
    if (!passphrase) return null

    const hasUpperCase = /[A-Z]/.test(passphrase)
    const hasNumber = /[0-9]/.test(passphrase)
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(passphrase)
    const isLongEnough = passphrase.length >= 16

    if (!hasUpperCase) {
      return {
        color: "rgba(239, 68, 68, 0.75)", // red with 75% opacity
        message: "Passphrase must include at least one capitalized letter",
      }
    }

    if (!hasNumber || !hasSpecialChar) {
      return {
        color: "rgba(249, 115, 22, 0.75)", // orange with 75% opacity
        message: "Passphrase must include at least one number and one special character",
      }
    }

    if (hasUpperCase && hasNumber && hasSpecialChar && isLongEnough) {
      return {
        color: "rgba(34, 197, 94, 0.75)", // green with 75% opacity
        message: "Your passphrase is strong enough",
      }
    }

    return {
      color: "rgba(249, 115, 22, 0.75)", // orange with 75% opacity
      message: "Passphrase must be at least 16 characters long",
    }
  }

  const passphraseStrength = getPassphraseStrength()

  const generateKeys = async () => {
    if (!name || !email) {
      toast({
        title: "Missing Information",
        description: "Please provide both name and email.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const { privateKey: privKey, publicKey: pubKey } = await openpgp.generateKey({
        type: "ecc",
        curve: curve,
        userIDs: [{ name, email }],
        passphrase: passphrase || undefined,
      })

      setPublicKey(pubKey)
      setPrivateKey(privKey)
      toast({
        title: "Keys Generated",
        description: "Your PGP key pair has been created successfully.",
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate keys",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async (text: string, type: "public" | "private") => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === "public") {
        setCopiedPublic(true)
        setTimeout(() => setCopiedPublic(false), 2000)
      } else {
        setCopiedPrivate(true)
        setTimeout(() => setCopiedPrivate(false), 2000)
      }
      toast({
        title: "Copied",
        description: `${type === "public" ? "Public" : "Private"} key copied to clipboard.`,
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const downloadKey = (key: string, filename: string) => {
    const blob = new Blob([key], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate PGP Key Pair</CardTitle>
          <CardDescription>Create a new public and private key pair for encryption and decryption</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="curve">Encryption Curve</Label>
            <Select value={curve} onValueChange={(value: CurveType) => setCurve(value)}>
              <SelectTrigger id="curve">
                <SelectValue placeholder="Select curve" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="curve25519">Curve25519</SelectItem>
                <SelectItem value="ed25519">Ed25519</SelectItem>
                <SelectItem value="p256">P-256</SelectItem>
                <SelectItem value="p384">P-384</SelectItem>
                <SelectItem value="p521">P-521</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Brainpool and secp256k1 curves are no longer supported.{" "}
              <a
                href="https://github.com/openpgpjs/openpgpjs/pull/1395"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold no-underline"
                style={{ color: "#36b3fd" }}
              >
                See more
              </a>
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="passphrase">Passphrase (Optional)</Label>
            <Input
              id="passphrase"
              type="password"
              placeholder="Leave empty for no passphrase"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              style={
                passphraseStrength
                  ? {
                      backgroundColor: passphraseStrength.color,
                    }
                  : undefined
              }
            />
            {passphraseStrength && <p className="text-xs text-muted-foreground">{passphraseStrength.message}</p>}
          </div>
          <Button onClick={generateKeys} disabled={isGenerating} className="w-full">
            {isGenerating ? "Generating..." : "Generate Keys"}
          </Button>
        </CardContent>
      </Card>

      {publicKey && (
        <Card>
          <CardHeader>
            <CardTitle>Public Key</CardTitle>
            <CardDescription>Share this key with others to receive encrypted messages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea value={publicKey} readOnly className="font-mono text-xs h-48" />
            <div className="flex gap-2">
              <Button onClick={() => copyToClipboard(publicKey, "public")} variant="outline" className="flex-1">
                {copiedPublic ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
              <Button onClick={() => downloadKey(publicKey, "public-key.asc")} variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {privateKey && (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Private Key</CardTitle>
            <CardDescription>Keep this key secret and secure. Never share it with anyone.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea value={privateKey} readOnly className="font-mono text-xs h-48" />
            <div className="flex gap-2">
              <Button onClick={() => copyToClipboard(privateKey, "private")} variant="outline" className="flex-1">
                {copiedPrivate ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
              <Button onClick={() => downloadKey(privateKey, "private-key.asc")} variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
