import React from 'react';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10 text-neutral-800">
      <div className="mx-auto max-w-3xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="mb-2 text-2xl font-bold">개인정보처리방침</h1>
        <p className="mb-8 text-sm text-neutral-500">
          시행일: 2026년 10월 8일
        </p>

        <div className="space-y-7 text-sm leading-7 sm:text-base">
          <section>
            <h2 className="mb-2 text-lg font-semibold">
              1. 개인정보의 처리
            </h2>
            <p>
              사회복무요원 연가·병가 계산기(이하 “서비스”)는 회원가입
              기능을 제공하지 않으며, 이용자의 이름, 이메일 주소,
              전화번호 등의 개인정보를 직접 수집하거나 서버에 저장하지
              않습니다.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">
              2. 입력 데이터의 저장
            </h2>
            <p>
              이용자가 입력한 소집일, 소집해제일, 연가 및 병가 사용 정보
              등 계산에 필요한 데이터는 이용자의 기기에만 저장됩니다.
              해당 데이터는 개발자의 서버로 전송되거나 개발자에게
              제공되지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">
              3. 개인정보의 제3자 제공
            </h2>
            <p>
              서비스는 이용자의 개인정보를 직접 수집하지 않으므로
              개발자가 개인정보를 제3자에게 제공하지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">
              4. 데이터 삭제
            </h2>
            <p>
              기기에 저장된 입력 데이터는 앱의 초기화 기능을 이용하거나
              앱의 저장 데이터를 삭제하여 제거할 수 있습니다. 앱을
              삭제하면 해당 앱에 저장된 로컬 데이터도 기기에서 삭제될
              수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">
              5. 개인정보처리방침의 변경
            </h2>
            <p>
              서비스의 기능 또는 관련 정책이 변경되는 경우 본
              개인정보처리방침이 변경될 수 있으며, 변경 사항은 본
              페이지를 통해 안내합니다.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">6. 문의</h2>
            <p>
              개인정보처리방침 및 서비스와 관련한 문의는 아래 이메일로
              연락해 주세요.
            </p>
            <p className="mt-2 font-medium">
              이메일: dvkim0119@naver.com
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}