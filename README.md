<p align="center">
  
<img width="100" height="100" alt="logo 100x100" src="https://github.com/user-attachments/assets/53c4c32b-d285-478d-b0f8-808328af6b27" />


<h1 align="center">PGP 🔑</h1>


# PGP — Offline

Generate modern PGP keys, encrypt messages, and lock down attachments — **without your keys ever leaving your browser**.

> **Fully Offline · Zero Server Calls · Privacy First**

---

## What is this?

[**PGP**](https://pgp.cypherfucker.com) is a client-side OpenPGP playground:

- Generate a **PGP key pair** (public + private) directly in your browser  
- Encrypt **text messages** with your public key  
- Encrypt **attachments** (files) with the same PGP setup  
- Decrypt messages locally, using your private key  
- All crypto happens **in your browser**, no server round-trips

Perfect for people who want the power of PGP without touching the command line every time they need to send something encrypted.

---

## Features

- **Offline key generation**  
  - Create PGP key pairs entirely client-side  
  - Your keys never leave the browser runtime  
  - No account, no login, no backend

- **Message encryption**  
  - Paste or type any plaintext  
  - Encrypt using your public key  
  - Copy/paste the ASCII-armored ciphertext anywhere (email, chat, etc.)

- **Attachment encryption**  
  - Attach any file (_within your browser’s capabilities_)  
  - Get a PGP-encrypted blob you can safely send over email or any untrusted channel  

- **No hard-coded file size limit**  
  - There’s **no app-level cap** on attachment size  
  - Real-world limits come from:
    - Your browser’s memory  
    - How patient your CPU is  
    - What your email provider accepts as an attachment size  

- **Modern crypto defaults**  
  - Uses supported OpenPGP curves / algorithms only  
  - Curves like **Brainpool** and **secp256k1** are *intentionally* no longer supported [no longer supported](https://github.com/openpgpjs/openpgpjs/pull/1395) due to OpenPGP.

- **Free & open source**  
  - Published under **[CC0 / Public Domain](https://github.com/cypherfucker/PGP/blob/main/LICENSE)**
  - Take the code, fork it, remix it, rebrand it — no strings attached

---

## How to use it

### 1. Generate a PGP key pair

1. Go to: **[PGP](https://pgp.cypherfucker.com)**
2. Fill in:
   - **Name**
   - **Email**
3. Pick an **encryption curve** from the supported list  
   > Brainpool + secp256k1 are [no longer supported](https://github.com/openpgpjs/openpgpjs/pull/1395) due to OpenPGP.
4. (Optional) Set a **passphrase** to protect your private key
5. Click **“Generate Keys”**

You’ll get:

- A **public key** — safe to share
- A **private key** — **never** share this; back it up somewhere safe

Export them and store them wherever you usually keep your PGP material (encrypted and not on a cloud).

---

### 2. Encrypt a text message

1. Paste your **public key** (if needed) or use the one you just generated
2. Type or paste the **plaintext message**
3. Hit **Encrypt**
4. Copy the resulting **ASCII-armored blob**

Send that encrypted block via:

- Email  
- Messaging apps  
- Posting it somewhere public if you’re bold — it’s still encrypted

---

### 3. Encrypt an attachment

1. Select or paste the **public key**  
2. Choose or drop your **file** into the attachment area  
3. Hit **Encrypt**  
4. Download / save the encrypted output

**Size notes:**

- There’s no internal “max MB” check in the app  
- But:
  - Browsers will choke on very large files (RAM & CPU)  
  - Email providers often cap attachments (commonly 20–50 MB, but depends on provider)  
- If it fails, try:
  - A smaller file  
  - Splitting archives (`.zip`, `.tar`, etc.)

---

### 4. Decrypt

Decryption happens locally, too:

1. Paste/import your **private key**
2. Enter your **passphrase** (if you set one)
3. Paste the encrypted message or load the encrypted file
4. Hit **Decrypt** to recover:
   - Original plaintext
   - Or the original file, if it was an attachment

---

## Security model

This tool is built with a **privacy-first** mindset, but you should still understand what it does and doesn’t protect you from.

### Good for

- Generating PGP keys without trusting a random remote server
- Quickly encrypting text or files for email or messaging
- Having a minimal, transparent PGP UI that runs in your browser
- Air-gapped or low-trust environments *if* you self-host it


### Threat model in one breath

- **Keys stay client-side.** The app’s intent is: no server API calls, no key upload.  
- If your **browser or OS is compromised**, all bets are off.  
- If you don’t trust the live deployment, **self-host** (see below) and serve it from a machine you control.  
- You can verify the output using standard tools like **GnuPG** to be extra sure everything is behaving.

---

##  Self-hosting

This app is a static, client-side web application. You can host it pretty much anywhere:

- Vercel  
- Netlify  
- GitHub Pages  
- Cloudflare Pages  
- Your own Nginx / Apache / Caddy

Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
\`\`\`bash
git clone https://github.com/cypherfucker/PGP.git
cd PGP
npm install
npm run dev
\`\`\`

### Building
\`\`\`bash
npm run build
\`\`\`

---

## Contributing

PRs, issues, nitpicks and wild ideas are all welcome.

Some things that might be fun to work on:

- More knobs for key generation (expiry, subkeys, advanced flags)
- Better UX for importing/exporting existing keys
- More descriptive error messages around large attachments
- Dark mode / high-contrast theme polish
- Language/localization support

If you’re unsure whether something fits the scope, open an issue and ask.

---

## License

**[CC0 / Public Domain](https://github.com/cypherfucker/PGP/blob/main/LICENSE)**

- No copyright  
- No attribution required  
- No copyleft  
- No bullshit

Use the code in your own projects, closed or open, personal or commercial. Fork it, rebrand it, ship it as something else — that’s the point.

---

## TL;DR

- Your keys stay in your browser  
- Text and attachments get encrypted with PGP  
- No hardcoded file size limit — the real limit is your browser + your provider  
- **[CC0](https://github.com/cypherfucker/PGP/blob/main/LICENSE)**, so you can steal the code guilt-free

Now go encrypt something you don’t want your ISP, your email provider, or your nosey roommate to read. 🔐
