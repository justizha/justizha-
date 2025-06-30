
export default function MainContent() {
 return (
  <section className="flex justify-center px-4 sm:px-0">
   <button
    onClick={() => {
     const modal = document.getElementById('mdl') as HTMLDialogElement
     if (modal) modal.showModal();
    }}
    className="btn btn-outline btn-accent w-lg">
    <p className="text-lg">Contact</p>
   </button>
   <dialog id="mdl" className="modal">
    <div className="modal-box">
     <form method="dialog">
      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
     </form>
     <h3 className="font-bold text-lg pb-2 text-center">Socials & Contacts</h3>
     <article>
      <a
       href={'mailto:alfathizhaaaaaaa@gmail.com'}
       target="_blank"
       className="btn w-full btn-soft  text-[16px]">
       <img src="/assets/gmail.svg" alt="gmail" className="w-5" />
       Email
      </a>
     </article>
    </div>
   </dialog>
  </section>
 )
}