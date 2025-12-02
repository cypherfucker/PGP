"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Copy, CheckCircle2, Upload, Download, FileText, File, Unlock } from "lucide-react"
import * as openpgp from "openpgp"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function Decrypt() {
  const [privateKey, setPrivateKey] = useState("")
  const [passphrase, setPassphrase] = useState("")
  const [encryptedMessage, setEncryptedMessage] = useState("")
  const [decryptedMessage, setDecryptedMessage] = useState("")
  const [isDecrypting, setIsDecrypting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [encryptedFile, setEncryptedFile] = useState<{ name: string; content: string } | null>(null)
  const [decryptedFile, setDecryptedFile] = useState<{ data: Uint8Array; filename: string } | null>(null)
  const { toast } = useToast()

  const handlePrivateKeyUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        setPrivateKey(content)
        toast({
          title: "Key Loaded",
          description: "Private key has been loaded from file.",
        })
      }
      reader.readAsText(file)
    }
  }

  const handleMessageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        setEncryptedMessage(content)
        toast({
          title: "Message Loaded",
          description: "Encrypted message has been loaded from file.",
        })
      }
      reader.readAsText(file)
    }
  }

  const handleEncryptedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        setEncryptedFile({
          name: file.name.replace(".asc", ""),
          content,
        })
        toast({
          title: "File Loaded",
          description: `Encrypted file ${file.name} loaded and ready to decrypt.`,
        })
      }
      reader.readAsText(file)
    }
  }

  const decryptMessage = async () => {
    if (!privateKey || !encryptedMessage) {
      toast({
        title: "Missing Information",
        description: "Please provide both private key and encrypted message.",
        variant: "destructive",
      })
      return
    }

    setIsDecrypting(true)
    try {
      const privKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: privateKey }),
        passphrase: passphrase || undefined,
      })

      const message = await openpgp.readMessage({
        armoredMessage: encryptedMessage,
      })

      const { data: decrypted } = await openpgp.decrypt({
        message,
        decryptionKeys: privKey,
      })

      setDecryptedMessage(decrypted as string)
      toast({
        title: "Message Decrypted",
        description: "Your message has been decrypted successfully.",
      })
    } catch (error) {
      toast({
        title: "Decryption Failed",
        description:
          error instanceof Error ? error.message : "Failed to decrypt message. Check your private key and passphrase.",
        variant: "destructive",
      })
    } finally {
      setIsDecrypting(false)
    }
  }

  const decryptFile = async () => {
    if (!privateKey || !encryptedFile) {
      toast({
        title: "Missing Information",
        description: "Please provide both private key and encrypted file.",
        variant: "destructive",
      })
      return
    }

    setIsDecrypting(true)
    try {
      const privKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: privateKey }),
        passphrase: passphrase || undefined,
      })

      const message = await openpgp.readMessage({
        armoredMessage: encryptedFile.content,
      })

      const { data: decrypted } = await openpgp.decrypt({
        message,
        decryptionKeys: privKey,
        format: "binary",
      })

      setDecryptedFile({
        data: decrypted as Uint8Array,
        filename: encryptedFile.name,
      })

      toast({
        title: "File Decrypted",
        description: `${encryptedFile.name} has been decrypted successfully.`,
      })
    } catch (error) {
      toast({
        title: "Decryption Failed",
        description:
          error instanceof Error ? error.message : "Failed to decrypt file. Check your private key and passphrase.",
        variant: "destructive",
      })
    } finally {
      setIsDecrypting(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(decryptedMessage)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Copied",
        description: "Decrypted message copied to clipboard.",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const downloadDecryptedFile = () => {
    if (!decryptedFile) return

    const blob = new Blob([decryptedFile.data])
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = decryptedFile.filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Decrypt with PGP</CardTitle>
          <CardDescription>Decrypt messages or files using your private key</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="private-key">Your Private Key</Label>
            <Textarea
              id="private-key"
              placeholder="-----BEGIN PGP PRIVATE KEY BLOCK-----"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              className="font-mono text-xs h-32"
            />
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".asc,.txt"
                onChange={handlePrivateKeyUpload}
                className="hidden"
                id="upload-private-key"
              />
              <Label htmlFor="upload-private-key">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Key File
                  </span>
                </Button>
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="decrypt-passphrase">Passphrase (if applicable)</Label>
            <Input
              id="decrypt-passphrase"
              type="password"
              placeholder="Enter your passphrase"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
            />
          </div>

          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">
                <FileText className="h-4 w-4 mr-2" />
                Text Message
              </TabsTrigger>
              <TabsTrigger value="file">
                <File className="h-4 w-4 mr-2" />
                File Attachment
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="encrypted-message">Encrypted Message</Label>
                <Textarea
                  id="encrypted-message"
                  placeholder="-----BEGIN PGP MESSAGE-----"
                  value={encryptedMessage}
                  onChange={(e) => setEncryptedMessage(e.target.value)}
                  className="font-mono text-xs h-48"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept=".asc,.txt"
                    onChange={handleMessageUpload}
                    className="hidden"
                    id="upload-encrypted-message"
                  />
                  <Label htmlFor="upload-encrypted-message">
                    <Button variant="outline" size="sm" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Message File
                      </span>
                    </Button>
                  </Label>
                </div>
              </div>
              <Button onClick={decryptMessage} disabled={isDecrypting} className="w-full">
                <Unlock className="h-4 w-4 mr-2" />
                {isDecrypting ? "Decrypting..." : "Decrypt Message"}
              </Button>
            </TabsContent>

            <TabsContent value="file" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="encrypted-file">Encrypted File (.asc)</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept=".asc"
                    onChange={handleEncryptedFileUpload}
                    className="hidden"
                    id="encrypted-file"
                  />
                  <Label htmlFor="encrypted-file" className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        {encryptedFile ? encryptedFile.name : "Choose Encrypted File"}
                      </span>
                    </Button>
                  </Label>
                </div>
                {encryptedFile && <p className="text-sm text-muted-foreground">File loaded: {encryptedFile.name}</p>}
              </div>
              <Button onClick={decryptFile} disabled={isDecrypting || !encryptedFile} className="w-full">
                <Unlock className="h-4 w-4 mr-2" />
                {isDecrypting ? "Decrypting..." : "Decrypt File"}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {decryptedMessage && (
        <Card>
          <CardHeader>
            <CardTitle>Decrypted Message</CardTitle>
            <CardDescription>Your decrypted message</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea value={decryptedMessage} readOnly className="h-48" />
            <Button onClick={copyToClipboard} variant="outline" className="w-full bg-transparent">
              {copied ? (
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
          </CardContent>
        </Card>
      )}

      {decryptedFile && (
        <Card>
          <CardHeader>
            <CardTitle>Decrypted File</CardTitle>
            <CardDescription>Download your decrypted file</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{decryptedFile.filename}</p>
                  <p className="text-sm text-muted-foreground">
                    Size: {(decryptedFile.data.length / 1024).toFixed(2)} KB
                  </p>
                </div>
                <File className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <Button onClick={downloadDecryptedFile} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Decrypted File
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
