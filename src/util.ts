export async function readJSON(path: string) {
  try {
    const file = Bun.file(path);
    return await file.json();
  } catch {
    return undefined;
  }
}

export async function readText(path: string) {
  try {
    const file = Bun.file(path);
    return await file.text();
  } catch {
    return undefined;
  }
}
