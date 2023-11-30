interface SirenLogoProps extends React.SVGProps<SVGSVGElement> {}

function SirenLogo(props: SirenLogoProps) {
  return (
    <svg viewBox='0,0,201,99' {...props}>
      <defs>
        <path d='M182.547,98.605 L142.846,0.317 L200.789,0.317 L200.789,98.605 L182.547,98.605 ZM146.533,98.605 L120.649,33.424 L114.281,49.461 L133.796,98.605 L107.305,98.605 L101.036,82.818 L94.766,98.605 L68.275,98.605 L87.790,49.461 L81.421,33.424 L55.538,98.605 L29.047,98.605 L68.077,0.317 L68.275,0.317 L94.568,0.317 L94.766,0.317 L101.036,16.104 L107.305,0.317 L107.503,0.317 L133.796,0.317 L133.994,0.317 L173.024,98.605 L146.533,98.605 ZM0.000,98.605 L0.000,0.317 L57.943,0.317 L18.242,98.605 L0.000,98.605 Z'></path>
        <clipPath id='clip-metallic-logo'>
          <use href='#metallic-logo'></use>
        </clipPath>
        <linearGradient>
          <stop offset='0%' stopColor='white' stopOpacity='0'></stop>
          <stop offset='42%' stopColor='white' stopOpacity='0.4'></stop>
          <stop offset='48%' stopColor='white' stopOpacity='0.8'></stop>
          <stop offset='52%' stopColor='white' stopOpacity='0.8'></stop>
          <stop offset='58%' stopColor='white' stopOpacity='0.4'></stop>
          <stop offset='100%' stopColor='white' stopOpacity='0'></stop>
        </linearGradient>
      </defs>
      <use href='#metallic-logo'></use>
      <g clipPath='url(#clip-metallic-logo)'>
        <rect
          width='201'
          height='99'
          fill='url(#gradient-metallic-logo)'
        ></rect>
      </g>
    </svg>
  );
}

export default SirenLogo;
