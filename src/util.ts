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

export function splitOnce(value: string, seperator: string) {
  const i = value.indexOf(seperator);
  return [value.slice(0, i), value.slice(i + 1)];
}
