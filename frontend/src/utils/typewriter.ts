export async function streamText(
  text: string,
  onUpdate: (value: string) => void
) {
  let current = "";

  for (const char of text) {
    current += char;

    onUpdate(current);

    await new Promise((resolve) =>
      setTimeout(resolve, 15)
    );
  }
}