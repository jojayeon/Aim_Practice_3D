🎯 에임 연습 웹 프로젝트 (2D & 3D)

----------------------------------------

⏪이전 프로젝트

[2D 버전 바로가기](https://github.com/jojayeon/Aim_Practice/blob/main/README.md)

----------------------------------------

📝 한 줄 소개

오버워치 위한, 2D와 3D 모두 지원하는 웹 기반 에임 연습장

게임 실행 없이 집중력 저하 없이 에임 실력을 키울 수 있는 실전형 연습 페이지

----------------------------------------

📚 프로젝트 목적

오버워치 등 FPS 게임을 즐기지만, 게임을 실행하면 곧장 플레이에 몰입해 다른 일에 소홀해지는 점을 개선하고자

웹페이지에서 간편하게 에임 연습만 할 수 있는 환경을 만들었습니다.

2D 연습장에 이어, three.js를 활용한 3D 에임 연습장을 추가하여

실제 FPS 게임과 유사한 감각을 웹에서 경험할 수 있도록 확장하였습니다.

언제든 브라우저에서 빠르게 에임 연습을 하며, 집중력과 게임 실력을 함께 향상시킬 수 있습니다.

----------------------------------------

🚀 주요 기능 및 페이지 구성

<img width="511" height="392" alt="111" src="https://github.com/user-attachments/assets/31fce9ff-540f-4146-8d2e-249fb286f514" />

Start	감도(sensitivity), 난이도(difficulty) 설정, 2D/3D 모드 선택, 시작 버튼	

<img width="538" height="569" alt="444" src="https://github.com/user-attachments/assets/cb64dd86-e073-44b0-9c4e-4fed9e724664" />

Game (2D)	2D 타겟 클릭 등 실제 에임 연습 진행	

<img width="786" height="669" alt="222" src="https://github.com/user-attachments/assets/24607abe-720b-47fd-a85a-4054b85f8315" />

Game (3D)	three.js 기반 3D 공간에서 에임 연습, 입체 타겟 등장	

<img width="530" height="421" alt="333" src="https://github.com/user-attachments/assets/af462f36-1377-4959-95af-382f08787c5a" />

Result	연습 결과(정확도) 확인	

2D/3D 모드 전환: 사용자가 원하는 방식으로 에임 연습 가능

감도 조절: 1을 기준으로 0.1~10까지 조절가능 

난이도 조절: 타겟의 크기와 나오는 속도 사라지는 속도를 난이도에 맞게 조절

결과 분석: 정확도 주요 지표 제공

----------------------------------------

🛠️ 기술 스택

React

three.js

----------------------------------------

📁 파일/폴더 구조
```plaintext
aim-practice/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── TargetItem.tsx
│   ├── pages/
│   │   ├── GamePage.tsx          // 2D 에임 연습 페이지
│   │   ├── GamePage3D.tsx        // 3D 에임 연습 페이지
│   │   ├── ResultPage.tsx
│   │   └── StartPage.tsx
│   ├── styles/
│   │   ├── Button.module.css
│   │   ├── GamePage.module.css
│   │   ├── GamePage3D.module.css
│   │   ├── ResultPage.module.css
│   │   ├── StartPage.module.css
│   │   └── TargetItem.module.css
│   ├── App.tsx
│   ├── global.d.ts
│   └── index.tsx
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```

💡 추가 요소 

패드로 에임연습이 가능하면 좋지 않을까 생각을 하게 되었습니다.

----------------------------------------

🌐 사이트

[바로가기](https://aim-practice-3-d.vercel.app/)

----------------------------------------

📝 커밋 컨벤션

이모지	태그	설명

✨	:sparkles:	새 기능 추가

🐛	:bug:	버그 수정

🎨	:art:	UI/스타일 수정

🔥	:fire: 코드/파일 삭제

🚚	:truck:	리소스 이동, 이름 변경

📦	:package:	코드 구조 / 형태 개선

🔧	:wrench:	구성 파일 추가/삭제

➕	:heavy_plus_sign: 의존성 추가

➖	:heavy_minus_sign: 의존성 제거

✅	:white_check_mark:	테스트 작업 관련

----------------------------------------

📬 연락처

이메일: jojayeon6152@gmail.com
