import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function LastFmCallback() {
 const [searchParams] = useSearchParams();
 const navigate = useNavigate();

 useEffect(() => {
  const token = searchParams.get('token');

  if (token) {
   localStorage.setItem('lastfm_token', token);

   navigate('/music');
  } else {
   navigate('/login');
  }
 }, [searchParams, navigate]);

 return <p>Redirecting...</p>;
}
