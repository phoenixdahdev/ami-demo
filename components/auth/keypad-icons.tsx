import Svg, { Path } from 'react-native-svg';

/**
 * The two non-digit keys on the PIN pad, drawn from the exported SVGs of
 * Figma nodes 386:3832 (Face ID) and 386:3841 (backspace) — path data verbatim,
 * stroke colour lifted to a prop so they take a theme token.
 *
 * Hugeicons Pro covers Face ID, but ships no backspace glyph, so both come from
 * the design to keep the pair visually consistent.
 */
type Props = { size?: number; color: string };

const STROKE = 1.5;

export function FaceIdKeyIcon({ size = 24, color }: Props) {
  return (
    <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
      <Path
        d='M4 8V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8'
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <Path
        d='M4 16V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H8'
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <Path
        d='M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V8'
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <Path
        d='M16 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V16'
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <Path
        d='M9 10H9.01'
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <Path
        d='M15 10H15.01'
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <Path
        d='M9.5 15C9.82588 15.3326 10.2148 15.5968 10.6441 15.7772C11.0734 15.9576 11.5344 16.0505 12 16.0505C12.4656 16.0505 12.9266 15.9576 13.3559 15.7772C13.7852 15.5968 14.1741 15.3326 14.5 15'
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </Svg>
  );
}

export function BackspaceKeyIcon({ size = 24, color }: Props) {
  return (
    <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
      <Path
        d='M20 6C20.2652 6 20.5196 6.10536 20.7071 6.29289C20.8946 6.48043 21 6.73478 21 7V17C21 17.2652 20.8946 17.5196 20.7071 17.7071C20.5196 17.8946 20.2652 18 20 18H9L4 13C3.75402 12.725 3.61803 12.369 3.61803 12C3.61803 11.631 3.75402 11.275 4 11L9 6H20Z'
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <Path
        d='M16 10L12 14M12 10L16 14L12 10Z'
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </Svg>
  );
}
