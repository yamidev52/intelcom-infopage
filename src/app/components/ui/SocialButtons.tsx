import React from "react";

type Props = {
  className?: string;
};

export default function SocialButtons({ className = "" }: Props) {
  return (
    <div className={"flex gap-2 items-center " + className}>
      <a
        href="https://www.facebook.com/Intelcom57"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 text-white hover:opacity-90"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 4.99 3.66 9.13 8.44 9.91v-7.02H7.9v-2.89h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.23 0-1.62.77-1.62 1.56v1.87h2.75l-.44 2.89h-2.31v7.02C18.34 21.2 22 17.06 22 12.07z" />
        </svg>
      </a>

      <a
        href="https://www.instagram.com/intelcom_mx/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white hover:opacity-90"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.65 0 3 1.35 3 3v10c0 1.65-1.35 3-3 3H7c-1.65 0-3-1.35-3-3V7c0-1.65 1.35-3 3-3h10zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 11.001 6.001A3 3 0 0112 9zm4.5-3a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z" />
        </svg>
      </a>
    </div>
  );
}
