import { marked } from 'marked'
import ContentMarkDown from './markdown/Simplicity.md?raw'
import { Link } from 'react-router'

export default function Simplicity() {

 return (
  <>
   <main className='hero font-mono'>
    <div className='sm:px-2 px-8 pt-10'>
     <Link to={'/blog'} className='btn btn-soft'>← Back</Link>
     <article className='prose'>
      <div dangerouslySetInnerHTML={{ __html: marked(ContentMarkDown) }} />
     </article>
    </div>
   </main>
  </>
 )
}
