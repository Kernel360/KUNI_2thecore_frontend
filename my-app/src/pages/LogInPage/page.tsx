import TopBar from "../../components/TopBar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8 border border-gray-200">
        <TopBar title="로그인" />
        <form className="mt-8 space-y-4">
          <input
            type="text"
            placeholder="아이디 입력"
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="비밀번호 입력"
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-1/2 mx-auto block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded transition"
          >
            로그인
          </button>
        </form>
        <p className="text-gray-400 text-center text-xs mt-6">
          새 계정을 등록하고 싶으신 분은 ooo@oooo.com으로 문의주시길 바랍니다.
        </p>
      </div>
      <p className="text-gray-400 text-center text-xs mt-2">
        국민대학교 Kernel360 프로젝트: 렌트카 관제 시스템
      </p>
    </div>
  );
}