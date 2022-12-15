// type Ordering = 'createdAt' | 'likeCount' | 'watchCount';
import { IsEnum, IsNumberString } from 'class-validator';

enum SORTING {
  ASC = 'ASC',
  DESC = 'DESC',
}

enum ORDERING {
  createdAt = 'createdAt',
  likeCount = 'likeCount',
  watchCount = 'watchCount',
}

export class SearchBoardDto {
  keyword: string; // 제목/내용 검색
  hastags: string; // 해시태그 검색
  @IsEnum(ORDERING)
  orderBy = ORDERING.watchCount; // 작성일(writeDate), 좋아요 수(likeCount), 조회수(watchCount) 기준
  @IsEnum(SORTING)
  isAsc = SORTING.ASC; // 오름차순
  @IsNumberString()
  page: string; // 페이지당 게시글 개수
  @IsNumberString()
  pageNo: string; // 페이지 정보
}
