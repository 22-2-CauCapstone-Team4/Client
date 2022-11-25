# Client

## 브랜치 관리 규칙

- `master` : 정식 배포용
- `develop` : 다음 버전 개발용
    - `master`에서 분기, 작업 후 `master`로 병합
- `feature/기능명` : 특정 기능 개발용
    - `develop`에서 분기, 작업 후 `develop`으로 병합
- `hotfix` : `master` 브랜치의 오류 수정용
    - `master`에서 분기, 작업 후 `master`로 병합

## 커밋 메세지 규칙

- [Add] 추가 내용 요약
- [Delete] 삭제 내용 요약
- [Update] 수정 내용 요약
- [Fix] 수정한 버그 요약
- [Docs] 문서 정리
- [Chore] 기타
