import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

export default function LastFmCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("lastfm_token", token);
      navigate("/music", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [searchParams, navigate]);

  return <p>Redirecting...</p>;
}