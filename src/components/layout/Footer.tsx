export default function Footer() {
  return (
    <footer id="contact" className="border-t border-neutral-200">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-neutral-900">gabriel r.</p>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <a
                className="text-neutral-700 underline-offset-4 transition-colors hover:text-neutral-950 hover:underline"
                href="mailto:gaberodrigo@yahoo.com"
              >
                gaberodrigo@yahoo.com
              </a>
              <a
                className="text-neutral-700 underline-offset-4 transition-colors hover:text-neutral-950 hover:underline"
                href="tel:+14803343330"
              >
                +1 (480) 334-3330
              </a>
              <a
                className="text-neutral-700 underline-offset-4 transition-colors hover:text-neutral-950 hover:underline"
                href="https://github.com/gaberodrigo"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                className="text-neutral-700 underline-offset-4 transition-colors hover:text-neutral-950 hover:underline"
                href="/documents/Gabriel-Rodriguez-Resume.pdf"
                download="Gabriel Rodriguez Resume.pdf"
              >
                Gabriel Rodriguez Resume
              </a>
            </div>
          </div>
          <p className="text-sm text-neutral-500 sm:max-w-md sm:text-right">
            Built with Next.js, Tailwind, and a touch of Framer Motion.
          </p>
        </div>
      </div>
    </footer>
  );
}

