import type { ReactNode } from 'react';
import '../styles/globals.css';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body>
        <div className="mx-auto flex flex-col justify-center items-center w-full">
          <div className="bg-[#f6f6f6] pt-0 px-2.5 pb-6 mt-[3px] w-full h-fit max-w-[1290px] rounded-[10px]">
            {/* //greybox */}

            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
