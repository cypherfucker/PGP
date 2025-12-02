"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Copy, CheckCircle2, Upload, Download, FileText, File, Lock } from "lucide-react"
import * as openpgp from "openpgp"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function Encrypt() {
  const [publicKey, setPublicKey] = useState("")
  const [message, setMessage] = useState("")
  const [encryptedMessage, setEncryptedMessage] = useState("")
  const [isEncrypting, setIsEncrypting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [encryptedFile, setEncryptedFile] = useState<{ data: string; filename: string } | null>(null)
  const { toast } = useToast()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        setPublicKey(content)
        toast({
          title: "Key Loaded",
          description: "Public key has been loaded from file.",
        })
      }
      reader.readAsText(file)
    }
  }

  const handleFileToEncrypt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      toast({
        title: "File Selected",
        description: `${file.name} (${(file.size / 1024).toFixed(2)} KB) ready to encrypt.`,
      })
    }
  }

  const encryptMessage = async () => {
    if (!publicKey || !message) {
      toast({
        title: "Missing Information",
        description: "Please provide both public key and message.",
        variant: "destructive",
      })
      return
    }

    setIsEncrypting(true)
    try {
      const pubKey = await openpgp.readKey({ armoredKey: publicKey })
      const encrypted = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: message }),
        encryptionKeys: pubKey,
      })

      setEncryptedMessage(encrypted as string)
      toast({
        title: "Message Encrypted",
        description: "Your message has been encrypted successfully.",
      })
    } catch (error) {
      toast({
        title: "Encryption Failed",
        description: error instanceof Error ? error.message : "Failed to encrypt message",
        variant: "destructive",
      })
    } finally {
      setIsEncrypting(false)
    }
  }

  const encryptFile = async () => {
    if (!publicKey || !selectedFile) {
      toast({
        title: "Missing Information",
        description: "Please provide both public key and file.",
        variant: "destructive",
      })
      return
    }

    setIsEncrypting(true)
    try {
      const pubKey = await openpgp.readKey({ armoredKey: publicKey })

      // Read file as binary
      const fileBuffer = await selectedFile.arrayBuffer()
      const uint8Array = new Uint8Array(fileBuffer)

      // Encrypt the file
      const encrypted = await openpgp.encrypt({
        message: await openpgp.createMessage({ binary: uint8Array }),
        encryptionKeys: pubKey,
        format: "armored",
      })

      setEncryptedFile({
        data: encrypted as string,
        filename: `${selectedFile.name}.asc`,
      })

      toast({
        title: "File Encrypted",
        description: `${selectedFile.name} has been encrypted successfully.`,
      })
    } catch (error) {
      toast({
        title: "Encryption Failed",
        description: error instanceof Error ? error.message : "Failed to encrypt file",
        variant: "destructive",
      })
    } finally {
      setIsEncrypting(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(encryptedMessage)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Copied",
        description: "Encrypted message copied to clipboard.",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const downloadEncrypted = () => {
    const blob = new Blob([encryptedMessage], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "encrypted-message.asc"
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadEncryptedFile = () => {
    if (!encryptedFile) return

    const blob = new Blob([encryptedFile.data], { type: "application/pgp-encrypted" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = encryptedFile.filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Encrypt with PGP</CardTitle>
          <CardDescription>Encrypt messages or files using a recipient&apos;s public key</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="public-key">Recipient&apos;s Public Key</Label>
            <Textarea
              id="public-key"
              placeholder="-----BEGIN PGP PUBLIC KEY BLOCK-----"
              value={publicKey}
              onChange={(e) => setPublicKey(e.target.value)}
              className="font-mono text-xs h-32"
            />
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".asc,.txt"
                onChange={handleFileUpload}
                className="hidden"
                id="upload-public-key"
              />
              <Label htmlFor="upload-public-key">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Key File
                  </span>
                </Button>
              </Label>
            </div>
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
                <Label htmlFor="message">Message to Encrypt</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="h-48"
                />
              </div>
              <Button onClick={encryptMessage} disabled={isEncrypting} className="w-full">
                <Lock className="h-4 w-4 mr-2" />
                {isEncrypting ? "Encrypting..." : "Encrypt Message"}
              </Button>
            </TabsContent>

            <TabsContent value="file" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="file-to-encrypt">File to Encrypt</Label>
                <div className="flex items-center gap-2">
                  <input type="file" onChange={handleFileToEncrypt} className="hidden" id="file-to-encrypt" />
                  <Label htmlFor="file-to-encrypt" className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        {selectedFile ? selectedFile.name : "Choose File"}
                      </span>
                    </Button>
                  </Label>
                </div>
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
                )}
              </div>
              <Button onClick={encryptFile} disabled={isEncrypting || !selectedFile} className="w-full">
                <Lock className="h-4 w-4 mr-2" />
                {isEncrypting ? "Encrypting..." : "Encrypt File"}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {encryptedMessage && (
        <Card>
          <CardHeader>
            <CardTitle>Encrypted Message</CardTitle>
            <CardDescription>Share this encrypted message with the recipient</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea value={encryptedMessage} readOnly className="font-mono text-xs h-48" />
            <div className="flex gap-2">
              <Button onClick={copyToClipboard} variant="outline" className="flex-1 bg-transparent">
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
              <Button onClick={downloadEncrypted} variant="outline" className="flex-1 bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {encryptedFile && (
        <Card>
          <CardHeader>
            <CardTitle>Encrypted File</CardTitle>
            <CardDescription>Download this encrypted file to share with the recipient</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{encryptedFile.filename}</p>
                  <p className="text-sm text-muted-foreground">
                    Size: {(encryptedFile.data.length / 1024).toFixed(2)} KB
                  </p>
                </div>
                <File className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <Button onClick={downloadEncryptedFile} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Encrypted File
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
