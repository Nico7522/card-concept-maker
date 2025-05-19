export type Passive = {
  name: string;
  passive: {
    passiveConditionActivation: string;
    effect: { description: string; imageSrc: string }[];
  }[];
} | null;
