import { useId } from 'react';
export default function Laurel({ side = 'left', size = 96 }) {
  const id = useId();
  return <svg aria-hidden="true" width={size * .55} height={size} viewBox="0 0 55 100" style={{transform:side==='right'?'scaleX(-1)':undefined,filter:size>50?'drop-shadow(0 5px 4px #0002)':undefined}}>
    <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#a7aab0"/><stop offset=".5" stopColor="#494e52"/><stop offset="1" stopColor="#202426"/></linearGradient></defs>
    <path d="M43 96C17 85 10 52 21 18" fill="none" stroke="#373b3e" strokeWidth="2"/>
    {['M21 31C7 23 12 9 20 2C34 12 32 24 21 31Z','M18 48C3 44 0 29 6 24C21 28 26 39 18 48Z','M22 66C5 68 1 52 4 47C20 47 30 54 22 66Z','M31 81C16 89 5 76 8 69C22 64 34 68 31 81Z','M45 90C34 100 19 93 18 85C28 76 41 78 45 90Z'].map(d=><path key={d} d={d} fill={`url(#${id})`} stroke="#34383c" strokeWidth=".6"/>)}
  </svg>;
}
