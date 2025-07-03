export default function Contact() {
  return (
    <>
      <button
        onClick={() => {
          const modal = document.getElementById("mdl") as HTMLDialogElement;
          if (modal) modal.showModal();
        }}
        className="btn btn-outline btn-accent sm:w-lg w-full"
      >
        <p className="text-lg">Links</p>
      </button>
      {/* dialog */}
      <dialog id="mdl" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          <h3 className="font-bold text-lg pb-2 text-center">
            Socials & Contacts
          </h3>

          <article>
            <ul className="space-y-2">
              {/* email */}
              <li>
                <a
                  href={"mailto:alfathizhaaaaaaa@gmail.com"}
                  rel="noopener noreferrer"
                  className="btn bg-gray-200 text-base-300  w-full text-[16px]"
                >
                  <img src="/assets/gmail.svg" alt="gmail" className="w-5" />
                  Email
                </a>
              </li>
              {/* end email */}

              {/* github  */}
              <li>
                <a
                  href={"https://github.com/justizha"}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="btn w-full btn-soft text-[16px]"
                >
                  <img src="/assets/github.svg" alt="gmail" className="w-6" />
                  Github
                </a>
              </li>
              {/* end github */}

              {/* spotify  */}
              <li>
                <a
                  href={
                    "https://open.spotify.com/user/31sg4u2iwexudonkopwhqckghd3u?si=0777b9ac7dc74002"
                  }
                  rel="noopener noreferrer"
                  target="_blank"
                  className="btn w-full btn-success text-[16px]"
                >
                  <img
                    src="/assets/spotify.svg"
                    alt="spotify"
                    className="w-6"
                  />
                  Spotify
                </a>
              </li>
              {/* end spotify */}

              {/* twitter */}
              <li>
                <a
                  href={"https://twitter.com/ThisIzha"}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="btn w-full bg-white text-[16px] text-black"
                >
                  <img
                    src="/assets/twitter.svg"
                    alt="twitter"
                    className="w-6"
                  />
                  Twitter
                </a>
              </li>
              {/* end twitter */}
            </ul>
          </article>
        </div>
      </dialog>
    </>
  );
}
