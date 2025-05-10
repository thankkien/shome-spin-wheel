import Confetti from "./Confetti";

export default function ConfettiEffect() {
  return (
    <>
      {Array.from({ length: 15 }).map((_, i) => (
        <Confetti key={i} index={i} length={15} />
      ))}
    </>
  );
}
