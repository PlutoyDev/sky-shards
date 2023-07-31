export default function Announcement_V4() {
  return (
    <div className='px-4 py-2 [&>*]:pb-2'>
      <p>
        <span className='text-lg font-semibold'>Hi Skykids!</span>
        <span>, Plutoy here.</span>
      </p>
      <p>
        <span>Sky shards has been upgraded to </span>
        <span className='text-lg font-semibold'>V4! Hurray</span>
      </p>
      <p>It was previously released, but got rolled back as it was buggy.</p>
      <p>
        It&apos;s now back, and <strong>hopefully</strong> it&apos;s better than ever!
      </p>
      <p> It might still have bugs though, so please report them to me.</p>
      <p>
        <span>You can find the a feedback Google Form at the bottom of the page.</span>
      </p>
      &nbsp;
      <p>
        <span className='text-lg font-semibold'>Breaking changes</span>
      </p>
      <p>
        The automatic resizing of font size has been remove. If the text are too small or too big, you can change it in
        the settings.
      </p>
      &nbsp;
      <p>
        <span className='text-lg font-semibold'>Thank you</span>
      </p>
    </div>
  );
}
