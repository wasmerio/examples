import { createHash, webcrypto } from 'node:crypto'

export type EncryptedContent = { ciphertext: string, iv: string, salt: string }

const bytesToBase64 = (value: ArrayBuffer | Uint8Array) => Buffer.from(value instanceof Uint8Array ? value : new Uint8Array(value)).toString('base64')

export const encryptContent = async (content: string, password: string, scope?: string): Promise<EncryptedContent> => {
  const salt = scope
    ? new Uint8Array(createHash('sha256').update(`ermaozi:${scope}`).digest().subarray(0, 16))
    : webcrypto.getRandomValues(new Uint8Array(16))
  const iv = webcrypto.getRandomValues(new Uint8Array(12))
  const material = await webcrypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey'])
  const key = await webcrypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt'],
  )
  const ciphertext = await webcrypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(content))
  return { ciphertext: bytesToBase64(ciphertext), iv: bytesToBase64(iv), salt: bytesToBase64(salt) }
}

export const redactEncryptedSource = (source: string) => source.replace(
  /^(:{3,})\s+encrypt[^\n]*\n[\s\S]*?^\1\s*$/gm,
  '> Encrypted content is omitted from public source exports.',
)
