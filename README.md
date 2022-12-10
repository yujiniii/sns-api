# SNS API 서비스

22.11.29~ `Nest.js` `BACKEND`

## 개요
   
- 본 서비스는 SNS(Social Networking Service) 입니다.
- 사용자는 본 서비스에 접속하여, 게시물을 업로드 하거나 다른 사람의 게시물을 확인하고, 좋아요를 누를 수 있습니다.

### A. 유저관리

#### **유저 회원가입**

* 이메일을 ID로 사용합니다.

#### **유저 로그인 및 인증**

* JTW 토큰을 발급받으며, 이를 추후 사용자 인증으로 사용합니다.

- 로그아웃은 프론트엔드에서 처리.

### B. 게시글

#### **게시글 생성**

* 제목, 내용, 해시태그 등을 입력하여 생성합니다.
* 제목, 내용, 해시태그는 필수 입력사항이며, 작성자 정보는 request body에 존재하지 않고, 해당 API 를 요청한 인증정보에서 추출하여 등록 합니다.
* 해시태그는 #로 시작되고 , 로 구분되는 텍스트가 입력됩니다.

#### **게시글 수정**

* 작성자만 수정할 수 있습니다.

#### **게시글 삭제**

* 작성자만 삭제할 수 있습니다.
* 작성자는 삭제된 게시글을 다시 복구할 수 있습니다.

#### **게시글 상세보기**

* 모든 사용자는 모든 게시물에 보기권한이 있습니다dddddd.
* 작성자 포함한 사용자가 게시글을 상세보기 하면 조회수가 1 증가합니다. (횟수 제한 없음)

#### **좋아요**

* 작성자를 포함한 사용자는 본 게시글에 좋아요를 누를 수 있습니다.
* 좋아요된 게시물에 다시 좋아요를 누르면 취소됩니다.

#### **게시글 목록**

* 모든 사용자는 모든 게시물에 보기권한이 있습니다.
* 게시글 목록에는 제목, 작성자, 해시태그, 작성일, 좋아요 수, 조회수 가 포함됩니다.

**Ordering**   
사용자는 게시글 목록을 원하는 값으로 정렬할 수 있습니다.  
오름차 순, 내림차 순을 선택할 수 있습니다.

**Searching**  
사용자는 입력한 키워드로 해당 키워드를 포함한 게시물을 조회할 수 있습니다.

**Filtering**   
사용자는 지정한 키워드로 해당 키워드를 포함한 게시물을 필터링할 수 있습니다.

**Pagination**  
사용자는 1 페이지 당 게시글 수를 조정할 수 있습니다. (default: 10건)

## 사용기술

`nestjs`  `typeorm`  `mysql`

## API 명세

[POSTMAN DOCUMENTATION](https://documenter.getpostman.com/view/19606295/2s8YzP35AC)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## License

Nest is [MIT licensed](LICENSE).
