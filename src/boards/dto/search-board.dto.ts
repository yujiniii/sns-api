type Ordering = 'createdAt' | 'likeCount' | 'watchCount';
type Sorting = 'ASC' | 'DESC';

export class SearchBoardDto {
  keyword: string; // 제목/내용 검색
  hastags: string; // 해시태그 검색
  orderby: Ordering = 'createdAt'; // 작성일(writeDate), 좋아요 수(likeCount), 조회수(watchCount) 기준
  isAsc: Sorting = 'ASC'; // 오름차순
  page: string; // 페이지당 게시글 개수
  pageno: string; // 페이지 정보
}
