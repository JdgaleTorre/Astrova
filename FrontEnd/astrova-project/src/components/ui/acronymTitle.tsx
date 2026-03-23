export default function AcronymTitle({ text }: { text: string }) {
  // find all uppercase letters to treat as acronym letters
  const acronymLetters = new Set(text.match(/[A-Z]/g) ?? []);

  return (
    <>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className={
            acronymLetters.has(char) ? 'text-primary' : 'text-soft-white'
          }
        >
          {char}
        </span>
      ))}
    </>
  );
}
