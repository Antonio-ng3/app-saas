import { put, del } from "@vercel/blob";

/**
 * Result from uploading a file to storage
 */
export interface StorageResult {
  url: string; // Public URL to access the file
  pathname: string; // Path/key of the stored file
}

/**
 * Storage configuration
 */
export interface StorageConfig {
  /** Maximum file size in bytes (default: 5MB) */
  maxSize?: number;
  /** Allowed MIME types (default: images and documents) */
  allowedTypes?: string[];
}

/**
 * Gets the public URL for accessing a stored file
 *
 * For Vercel Blob (private storage), returns a proxy URL that requires authentication
 * For local storage, returns the direct path
 *
 * @param pathname - The pathname from StorageResult
 * @returns Public URL to access the file
 *
 * @example
 * ```ts
 * const result = await upload(fileBuffer, "avatar.png", "avatars");
 * const publicUrl = getPublicUrl(result.pathname);
 * // Returns: /api/images/avatars/avatar-xxx.png (proxy for private storage)
 * // or: /uploads/avatars/avatar.png (local storage)
 * ```
 */
export function getPublicUrl(pathname: string): string {
  const hasVercelBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  if (hasVercelBlob) {
    // Use proxy route for private Blob storage
    return `/api/images/${pathname}`;
  }

  // Direct path for local filesystem
  return `/uploads/${pathname}`;
}

/**
 * Converts a Vercel Blob URL to a proxy URL
 *
 * Extracts the pathname from a Vercel Blob URL and returns a proxy URL
 *
 * @param blobUrl - The full URL from Vercel Blob (or a local path)
 * @returns Proxy URL for accessing the file
 *
 * @example
 * ```ts
 * const proxyUrl = blobUrlToProxyUrl("https://xxx.blob.vercel-storage.com/bob-app-saas/originals/user/file.png");
 * // Returns: /api/images/bob-app-saas/originals/user/file.png
 * ```
 */
export function blobUrlToProxyUrl(blobUrl: string): string {
  // Se já é um caminho local (começa com /), retorna como está
  if (blobUrl.startsWith("/")) {
    return blobUrl;
  }

  // Tenta fazer parse da URL do Blob
  try {
    const url = new URL(blobUrl);
    // O pathname da URL do Blob contém o caminho do arquivo
    // Ex: https://xxx.blob.vercel-storage.com/bob-app-saas/originals/user/file.png
    //     pathname = /bob-app-saas/originals/user/file.png
    const pathname = url.pathname;
    // Remove a barra inicial se existir
    const cleanPathname = pathname.startsWith("/") ? pathname.slice(1) : pathname;
    return getPublicUrl(cleanPathname);
  } catch {
    // Se falhar o parse, assume que é um pathname direto
    return getPublicUrl(blobUrl);
  }
}

/**
 * Default storage configuration
 */
const DEFAULT_CONFIG: Required<StorageConfig> = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: [
    // Images
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    // Documents
    "application/pdf",
    "text/plain",
    "text/csv",
    "application/json",
  ],
};

/**
 * Allowed file extensions mapped from MIME types
 */
const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".svg",
  ".pdf",
  ".txt",
  ".csv",
  ".json",
]);

/**
 * Sanitize a filename by removing dangerous characters and path traversal attempts
 */
export function sanitizeFilename(filename: string): string {
  // Remove path components (prevent directory traversal)
  const basename = filename.split(/[/\\]/).pop() || filename;

  // Remove or replace dangerous characters
  const sanitized = basename
    .replace(/[<>:"|?*\x00-\x1f]/g, "") // Remove dangerous chars
    .replace(/\.{2,}/g, ".") // Collapse multiple dots
    .replace(/^\.+/, "") // Remove leading dots
    .trim();

  // Ensure filename is not empty
  if (!sanitized || sanitized.length === 0) {
    throw new Error("Invalid filename");
  }

  // Limit filename length
  if (sanitized.length > 255) {
    const ext = sanitized.slice(sanitized.lastIndexOf("."));
    const name = sanitized.slice(0, 255 - ext.length);
    return name + ext;
  }

  return sanitized;
}

/**
 * Validate file for upload
 */
export function validateFile(
  buffer: Buffer,
  filename: string,
  config: StorageConfig = {}
): { valid: true } | { valid: false; error: string } {
  const { maxSize } = { ...DEFAULT_CONFIG, ...config };

  // Check file size
  if (buffer.length > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB`,
    };
  }

  // Check file extension
  const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed extensions: ${Array.from(ALLOWED_EXTENSIONS).join(", ")}`,
    };
  }

  // Optionally check MIME type if provided
  // Note: For full MIME type validation, consider using a library like 'file-type'

  return { valid: true };
}

/**
 * Uploads a file to storage (Vercel Blob or local filesystem)
 *
 * @param buffer - File contents as a Buffer
 * @param filename - Name of the file (e.g., "image.png")
 * @param folder - Optional folder/prefix (e.g., "avatars")
 * @param config - Optional storage configuration
 * @returns StorageResult with url and pathname
 *
 * @example
 * ```ts
 * const result = await upload(fileBuffer, "avatar.png", "avatars");
 * console.log(result.url); // https://blob.vercel.io/... or /uploads/avatars/avatar.png
 * ```
 */
export async function upload(
  buffer: Buffer,
  filename: string,
  folder?: string,
  config?: StorageConfig
): Promise<StorageResult> {
  const sanitizedFilename = sanitizeFilename(filename);

  const validation = validateFile(buffer, sanitizedFilename, config);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const hasVercelBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  if (!hasVercelBlob) {
    // Em desenvolvimento local sem BLOB_READ_WRITE_TOKEN, usar filesystem
    if (process.env.NODE_ENV === "development") {
      const { existsSync } = await import("fs");
      const { writeFile, mkdir } = await import("fs/promises");
      const { join } = await import("path");

      const uploadsDir = join(process.cwd(), "public", "uploads");
      const targetDir = folder ? join(uploadsDir, folder) : uploadsDir;

      if (!existsSync(targetDir)) {
        await mkdir(targetDir, { recursive: true });
      }

      const filepath = join(targetDir, sanitizedFilename);
      await writeFile(filepath, buffer);

      const pathname = folder ? `${folder}/${sanitizedFilename}` : sanitizedFilename;
      return { url: `/uploads/${pathname}`, pathname };
    }

    // Em produção sem token = erro claro
    throw new Error(
      "BLOB_READ_WRITE_TOKEN não configurado. Configure no dashboard do Vercel."
    );
  }

  // Vercel Blob — armazenamento privado (imagens de usuário)
  // As imagens são servidas via API route com autenticação
  const pathname = folder ? `${folder}/${sanitizedFilename}` : sanitizedFilename;
  const blob = await put(pathname, buffer, {
    access: "private",
    addRandomSuffix: true,
  });

  return { url: blob.url, pathname: blob.pathname };
}

/**
 * Deletes a file from storage
 * 
 * @param url - The URL of the file to delete
 * 
 * @example
 * ```ts
 * await deleteFile("https://blob.vercel.io/...");
 * // or
 * await deleteFile("/uploads/avatars/avatar.png");
 * ```
 */
export async function deleteFile(url: string): Promise<void> {
  const hasVercelBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  if (hasVercelBlob) {
    // Delete from Vercel Blob
    await del(url);
  } else {
    // Delete from local filesystem (dev only)
    if (process.env.NODE_ENV !== "development") {
      throw new Error("Cannot delete files from local filesystem in production without BLOB_READ_WRITE_TOKEN.");
    }

    // Extract pathname from URL (e.g., /uploads/avatars/avatar.png -> avatars/avatar.png)
    const pathname = url.replace(/^\/uploads\//, "");
    const { join } = await import("path");
    const { existsSync } = await import("fs");
    const { unlink } = await import("fs/promises");

    const filepath = join(process.cwd(), "public", "uploads", pathname);

    // Only attempt to delete if file exists
    if (existsSync(filepath)) {
      await unlink(filepath);
    }
  }
}





