export default function ErrorText({ subject }: { subject: string }) {
  return (
    <span className="secondary italic">
      Something went wrong when loading {subject}.
    </span>
  );
}
