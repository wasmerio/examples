# Google Drive 이미지 업로드 설정

`/editor`의 이미지 블록에서 **Upload to Drive**를 사용하려면 한 번만 설정하면 된다.

## 1. 공유 폴더 만들기

1. Google Drive에 `blog-images` 같은 폴더를 만든다.
2. 폴더의 일반 액세스를 **링크가 있는 모든 사용자 · 뷰어**로 변경한다.
3. 폴더 URL의 `/folders/` 뒤 문자열을 복사한다. 이것이 **폴더 ID**다.

예시: `https://drive.google.com/drive/folders/abc123...`라면 폴더 ID는 `abc123...`이다.

## 2. Google Cloud 설정

1. Google Cloud Console에서 프로젝트를 만든다.
2. **Google Drive API**를 사용 설정한다.
3. OAuth 동의 화면을 만들고 테스트 중이라면 본인 Google 계정을 테스트 사용자에 넣는다.
4. 웹 애플리케이션 OAuth 클라이언트 ID를 만든다.
5. 승인된 JavaScript 원본에 아래를 추가한다.
   - 로컬: `http://127.0.0.1:4321`
   - 배포 사이트: 실제 사이트의 origin (예: `https://username.github.io`, 저장소 경로 제외)
6. Drive 권한에는 `https://www.googleapis.com/auth/drive.file`을 선언한다.

클라이언트 ID는 `...apps.googleusercontent.com` 형태다. **클라이언트 비밀번호(client secret)는 절대 입력하거나 사이트에 넣지 않는다.**

## 3. 에디터에서 사용

1. `/editor`에서 **이미지** 블록을 추가한다.
2. **Drive settings**를 눌러 OAuth 클라이언트 ID와 폴더 ID를 저장한다.
3. **Upload to Drive**를 누르고 Google 계정으로 승인한 뒤 파일을 선택한다.
4. 업로드가 끝나면 이미지 URL이 자동으로 입력되고 Post JSON에 저장된다.

업로드하는 파일은 Drive API의 좁은 `drive.file` 권한으로만 다룬다. 에디터는 새 파일을 공개 읽기 권한으로 설정하므로, 비공개 이미지나 개인정보가 담긴 사진은 올리지 않는다.
