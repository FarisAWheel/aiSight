import { decode as atob } from "base-64";

interface Photo {
  base64: string;
}

export function preprocessImage(photo: Photo): Float32Array {
  const binary = atob(photo.base64); // Convert base64 to binary
  const buffer = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    buffer[i] = binary.charCodeAt(i);
  }

  // Placeholder for actual preprocessing logic like resizing and normalization
  return new Float32Array(1 * 3 * 640 * 640).fill(0);
}
