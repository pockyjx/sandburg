# 샌드버그 백엔드 채용 과제
> 샌드버그 백엔드 채용 과제 : 커뮤니티 서비스 api 서버 개발

- **지원자** : 정예진 (pockyjx@gmail.com)
- **배포 url (swagger)** : https://pockyjx.site/api
 
  - test 계정 1 (일반 유저) : member1 / Test1234!
  - test 계정 2 (관리자) : admin1 / Test1234!
 
<br>

## 개발 및 배포 환경
- **Language** : TypeScript
- **Framework** : node.js v20.16.0 / nest.js 10.4.2
- **Infra** : AWS EC2, Docker, Route 53, AWS ELB, Github Actions
<br>

## 요구사항 및 구현 기능
### 👤 회원
- [x] 회원가입 : 로그인 아이디, 닉네임, 이메일 중복 검증
- [x] 로그인 : access token 발급
- [x] 회원 탈퇴

![image](https://github.com/user-attachments/assets/94d95bc3-d803-4e74-9e83-b4120e239cd1)



### ✍🏻 커뮤니티
- [x] 게시글 CRUD
      
  - [x] 게시글 작성 : 유저 - 자유 게시판만 작성 가능 / 관리자 - 모든 게시판 작성 가능
  - [x] 게시글 수정 : 작성자 본인만 수정 가능
  - [x] 게시글 삭제 : 작성자 본인 & 관리자만 삭제 가능
  - [x] 게시글 조회 : 유저(비회원) - 자유&공지 게시판만 조회 가능 / 관리자 - 모든 게시판 조회 가능
    - [x] 목록 조회 : 카테고리 & 검색 (제목 or 본문) 필터링

![image](https://github.com/user-attachments/assets/3663853c-1c19-4ec5-b378-3c41b02d099f)



## ERD
![image](https://github.com/user-attachments/assets/b7d58e5f-3a27-4c04-8ad5-1a845e976822)


<br>

## 디렉토리 구조

```
📦src
 ┣ 📂board
 ┃ ┣ 📂application
 ┃ ┃ ┗ 📜board.service.ts
 ┃ ┣ 📂dto
 ┃ ┃ ┣ 📂req
 ┃ ┃ ┃ ┣ 📜create.post.req.dto.ts
 ┃ ┃ ┃ ┗ 📜update.post.req.dto.ts
 ┃ ┃ ┗ 📂resp
 ┃ ┃ ┃ ┣ 📜post.detail.resp.dto.ts
 ┃ ┃ ┃ ┗ 📜post.list.resp.dto.ts
 ┃ ┣ 📂entity
 ┃ ┃ ┣ 📜category.entity.ts
 ┃ ┃ ┗ 📜post.entity.ts
 ┃ ┣ 📂infrastructure
 ┃ ┃ ┣ 📜category.repository.ts
 ┃ ┃ ┗ 📜post.repository.ts
 ┃ ┣ 📂presentation
 ┃ ┃ ┗ 📜board.controller.ts
 ┃ ┗ 📜board.module.ts
 ┣ 📂common
 ┃ ┣ 📂exception
 ┃ ┃ ┗ 📜exception.filter.ts
 ┃ ┣ 📂jwt
 ┃ ┃ ┣ 📜jwt.access.strategy.ts
 ┃ ┃ ┣ 📜jwt.auth.guard.ts
 ┃ ┃ ┗ 📜optional.jwt.auth.guard.ts
 ┃ ┣ 📂response
 ┃ ┃ ┣ 📜response.dto.ts
 ┃ ┃ ┗ 📜response.interceptor.ts
 ┃ ┗ 📜common.module.ts
 ┣ 📂db
 ┃ ┣ 📜typeorm-ex.decorator.ts
 ┃ ┗ 📜typeorm-ex.module.ts
 ┣ 📂member
 ┃ ┣ 📂application
 ┃ ┃ ┣ 📜auth.service.ts
 ┃ ┃ ┗ 📜member.service.ts
 ┃ ┣ 📂dto
 ┃ ┃ ┣ 📂req
 ┃ ┃ ┃ ┣ 📜signin.req.dto.ts
 ┃ ┃ ┃ ┗ 📜signup.req.dto.ts
 ┃ ┃ ┗ 📂res
 ┃ ┣ 📂entity
 ┃ ┃ ┣ 📜member.entity.ts
 ┃ ┃ ┗ 📜member.role.ts
 ┃ ┣ 📂infrastructure
 ┃ ┃ ┗ 📜member.repository.ts
 ┃ ┣ 📂presentation
 ┃ ┃ ┣ 📜auth.controller.ts
 ┃ ┃ ┗ 📜member.controller.ts
 ┃ ┗ 📜member.module.ts
 ┣ 📜app.controller.spec.ts
 ┣ 📜app.controller.ts
 ┣ 📜app.module.ts
 ┣ 📜app.service.ts
 ┗ 📜main.ts
```
