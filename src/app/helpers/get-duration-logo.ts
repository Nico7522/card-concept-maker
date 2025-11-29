export default function getDurationLogo(value: number): string {
  let src: string = '';
  switch (+value) {
    case 2:
      src = 'one.webp';
      break;
    case 3:
      src = 'infinite.webp';
      break;
    case 4:
      src = 'up.webp';
      break;
    default:
      break;
  }
  return src;
}
