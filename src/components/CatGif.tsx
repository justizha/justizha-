import { useEffect } from 'react';

export default function CatGif() {
 useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://tenor.com/embed.js';
  script.async = true;
  document.body.appendChild(script);

  return () => {
   document.body.removeChild(script);
  };
 }, []);

 return (
  <img src="/assets/catto.gif" alt="cat" className='w-20' />
 );
}
