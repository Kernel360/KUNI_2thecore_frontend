import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>홈페이지</h1>
      <Link href="/login">
<button>로그인 페이지로 이동</button>
      </Link>
    </div>
  );
} 