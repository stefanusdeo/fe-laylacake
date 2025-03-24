export function getInitialsName(fullName: string | undefined = "Layla Cake") {
  const words = fullName.trim().split(" ");
  const firstInitial = words[0].charAt(0);
  const lastInitial = words[words.length - 1].charAt(0);
  return firstInitial + lastInitial;
}
