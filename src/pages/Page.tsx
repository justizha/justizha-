import { useEffect } from "preact/hooks";
import { useLocation, useSearch } from "wouter-preact";

export default function LastFmCallback() {
  const search = useSearch(); // "token=abc123" (no leading "?")
  const [, navigate] = useLocation();

  useEffect(() => {
    const token = new URLSearchParams(search).get("token");

    if (token) {
      localStorage.setItem("lastfm_token", token);
      navigate("/music", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [search, navigate]);

  return <p>Redirecting...</p>;
}