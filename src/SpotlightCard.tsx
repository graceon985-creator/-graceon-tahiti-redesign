import {useRef, type ReactNode, type PointerEvent} from 'react';
/** React Bits-inspired SpotlightCard interaction: a soft light follows the pointer. */
export default function SpotlightCard({children,className=''}:{children:ReactNode;className?:string}){
 const ref=useRef<HTMLDivElement>(null);
 const move=(e:PointerEvent<HTMLDivElement>)=>{const r=e.currentTarget.getBoundingClientRect();ref.current?.style.setProperty('--x',`${e.clientX-r.left}px`);ref.current?.style.setProperty('--y',`${e.clientY-r.top}px`)};
 return <div ref={ref} onPointerMove={move} className={`spotlight-card ${className}`}>{children}</div>;
}