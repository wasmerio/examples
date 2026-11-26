/**
NovelViewer Template

Copyright (c)2020 Aya Mizushiro

This software is released under the MIT License.
http://opensource.org/licenses/mit-license.php
*/
export class SNViewerAppClass {

  // パラメータ受け取り
  constructor(param) {
    this.indent =  param && "indent" in param ? param.indent : false;
    this.convert = param && "convert" in param ? param.convert : true;
    this.return = param && "return" in param ? param.return : false;
    this.useHtml = param && "useHtml" in param ? param.useHtml : false;
    this.useShare = param && "useShare" in param ? param.useShare : false;
    this.useGoogleFont = param && "useGoogleFont" in param ? param.useGoogleFont: false;
    this.indexList = param && "indexList" in param ? param.indexList : false;
    this.touchDevice = this.isTouchDevice();
    this.imageUrls = '';
    this.imageLoading = false;
    this.wrapper = document.getElementById("snv-app");
    this.prefix = 'snv-';
    this.init();
  }

  /**
   * 初期化処理
   */
  init() {

    if (this.isAndroid() && !this.useGoogleFont) {
      // Andoroid 端末でユーザ個別でGoogleFont読み込みを行わない時、Google フォント読み込む。
      this.insertFont();
    }

    // メニュー作成
    this.createMenu(this.indexList);

    // 小説本文処理
    if (this.indent || this.convert) {
      this.imageLoading = this.createNovelBody();
    }
    
    // タイトルクラス設定
    if (document.getElementById('nvl-title') != null) {
      const titleNode = document.getElementById('nvl-title');
      titleNode.classList.add(this.prefix + 'novel-title');
      titleNode.innerHTML = this.convertNotation(titleNode.innerHTML);
    }

    // サブタイトルクラス設定
    if (document.getElementById('nvl-subtitle') != null) {
      const subTitleNode = document.getElementById('nvl-subtitle')
      subTitleNode.classList.add(this.prefix + 'novel-subtitle');
      subTitleNode.innerHTML = this.convertNotation(subTitleNode.innerHTML);
    }

    // 節タイトルクラス設定
    if (document.getElementById('nvl-section-title') != null) {
      const sectionTitleNode = document.getElementById('nvl-section-title');
      sectionTitleNode.classList.add(this.prefix + 'section-title');
      // ボーター装飾追加
      const addNode = this.createSpanEl('', '', sectionTitleNode.textContent.trim());
      sectionTitleNode.textContent = '';
      sectionTitleNode.appendChild(addNode);
      sectionTitleNode.innerHTML = this.convertNotation(sectionTitleNode.innerHTML);
    }

    // 小説本文クラス設定
    if (document.getElementById('novel-body') != null) {
      document.getElementById('novel-body').classList.add(this.prefix + 'novel-block');
    }

    // テーマ設定の読み込み
    this.saveStyleLoad();
    
    // 表示完了処理
    if(!this.imageLoading) {
      this.renderingFinish();
    }
  }

  /**
   * Google Fonts 読み込みリンクの挿入
   */
  insertFont() {
    const gothicUri = 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap';
    const minchoUri = 'https://fonts.googleapis.com/css2?family=Noto+Serif+JP&display=swap';
    const minchoLinkEl = document.createElement('link');
    const gothicLinkEl = document.createElement('link');
    minchoLinkEl.rel = "stylesheet";
    gothicLinkEl.rel = "stylesheet";
    // ゴシック体
    gothicLinkEl.href = gothicUri;
    document.getElementsByTagName('head')[0].appendChild(gothicLinkEl);

    // 明朝体
    minchoLinkEl.href = minchoUri;
    document.getElementsByTagName('head')[0].appendChild(minchoLinkEl);
  }

  /**
   * メニューの作成
   * @param {Array} indexList 目次リスト
   */
  createMenu(indexList) {
    const menuEl = this.createMenuEl('', 'menu-wrapper');
    if (this.return) { 
      menuEl.appendChild(this.createAEl('','novel-close-button', this.return, '✕', false));
    }

    // スタイル表示ボタン
    const closeStyle = this.createLabelEl('close-style', 'menu-close-toggle', 'novel-style-toggle', 'close');
    closeStyle.style.display = "none";
    menuEl.appendChild(closeStyle);

    // 目次閉じるボタン
    const closeIndex = this.createLabelEl('close-index', 'menu-close-toggle', 'novel-index-toggle', 'close');
    closeIndex.style.display = "none";
    menuEl.appendChild(closeIndex);
    
    // スタイルメニュー
    menuEl.appendChild(this.createStyleMenu());

    // 目次
    if (0 < Object.keys(indexList).length) {       
      menuEl.appendChild(this.createIndex(indexList));
    }

    this.wrapper.appendChild(menuEl);
  }

  /**
   * スタイルメニューの作成
   * @returns {Element} スタイルメニューのElement
   */
  createStyleMenu() {
    const menuDivEl = this.createDivEl('', '');

    const styleMenuBtn = this.craeteCheckboxEl('novel-style-toggle', '');
    styleMenuBtn.addEventListener("change", (event) => { this.toggleStyle(event); }, false);
    menuDivEl.appendChild(styleMenuBtn);
    menuDivEl.appendChild(this.createLabelEl('', 'novel-style-toggle-label', 'novel-style-toggle', '⚙️'))

    const menu = this.createDivEl('novel-style-menu', 'novel-menu');
    const contentsEl = this.createDivEl('', 'novel-style-contents');

    // 文字サイズ
    const wrapEl1 = this.createDivEl('', 'menu-item-wrap');
    wrapEl1.appendChild(this.createPEl('', 'menu-item-label', '文字サイズ'));

    const sizeWrap = this.createDivEl('', 'novel-radio-wrap');
    
    const smallRdo = this.createRadioEl('fontsize-small', '', 'fontsize', 'small');
    smallRdo.addEventListener("change", (event) => { this.toggleFontsize(event); }, false);
    sizeWrap.appendChild(smallRdo);
    sizeWrap.appendChild(this.createLabelEl('', ['radio-label-style', 'style-small'], 'fontsize-small', '小'));

    const normalRdo = this.createRadioEl('fontsize-normal', '', 'fontsize', 'normal');
    normalRdo.addEventListener("change", (event) => { this.toggleFontsize(event); }, false);
    sizeWrap.appendChild(normalRdo);
    sizeWrap.appendChild(this.createLabelEl('', ['radio-label-style', 'style-normal'], 'fontsize-normal', '中'));
    
    const largeRdo = this.createRadioEl('fontsize-large', '', 'fontsize', 'large');
    largeRdo.addEventListener("change", (event) => { this.toggleFontsize(event); }, false);
    sizeWrap.appendChild(largeRdo);
    sizeWrap.appendChild(this.createLabelEl('', ['radio-label-style', 'style-large'], 'fontsize-large', '大'));
    
    const oversizeRdo = this.createRadioEl('fontsize-oversize', '', 'fontsize', 'oversize');
    oversizeRdo.addEventListener("change", (event) => { this.toggleFontsize(event); }, false);
    sizeWrap.appendChild(oversizeRdo);
    sizeWrap.appendChild(this.createLabelEl('', ['radio-label-style', 'style-oversize'], 'fontsize-oversize', '特大'));
    
    wrapEl1.appendChild(sizeWrap);
    contentsEl.appendChild(wrapEl1);

    // 背景
    const wrapEl2 = this.createDivEl('', 'menu-item-wrap');
    wrapEl2.appendChild(this.createPEl('', 'menu-item-label', '背景'));
    
    const backWrap = this.createDivEl('', 'novel-radio-wrap');
    const whiteRdo = this.createRadioEl('theme-white', '', 'theme', 'white');
    whiteRdo.addEventListener("change", (event) => { this.toggleTheme(event); }, false);
    backWrap.appendChild(whiteRdo);
    backWrap.appendChild(this.createLabelEl('', ['radio-label-style', 'style-white'], 'theme-white', '白'));
    const darkRdo = this.createRadioEl('theme-dark', '', 'theme', 'dark');
    darkRdo.addEventListener("change", (event) => { this.toggleTheme(event); }, false);
    backWrap.appendChild(darkRdo);
    backWrap.appendChild(this.createLabelEl('', ['radio-label-style', 'style-dark'], 'theme-dark', '黒'));
    const kinariRdo = this.createRadioEl('theme-kinari', '', 'theme', 'kinari');
    kinariRdo.addEventListener("change", (event) => { this.toggleTheme(event); }, false);
    backWrap.appendChild(kinariRdo);
    backWrap.appendChild(this.createLabelEl('', ['radio-label-style', 'style-kinari'], 'theme-kinari', '生成り'));

    wrapEl2.appendChild(backWrap);
    contentsEl.appendChild(wrapEl2);

    // 書体
    const wrapEl3 = this.createDivEl('', 'menu-item-wrap');
    wrapEl3.appendChild(this.createPEl('', 'menu-item-label', 'フォント'));

    const fontWrap = this.createDivEl('', 'novel-radio-wrap');
    const minchoRdo = this.createRadioEl('font-mincho', '', 'font', 'mincho');
    minchoRdo.addEventListener("change", (event) => { this.toggleFont(event); }, false);
    fontWrap.appendChild(minchoRdo);
    fontWrap.appendChild(this.createLabelEl('', ['radio-label-style', 'style-mincho'], 'font-mincho', '明朝'));
    const gothicRdo = this.createRadioEl('font-gothic', '', 'font', 'gothic');
    gothicRdo.addEventListener("change", (event) => { this.toggleFont(event); }, false);
    fontWrap.appendChild(gothicRdo);
    fontWrap.appendChild(this.createLabelEl('', ['radio-label-style', 'style-gothic'], 'font-gothic', 'ゴシック'));

    wrapEl3.appendChild(fontWrap);
    contentsEl.appendChild(wrapEl3);

    // 組版
    const wrapEl4 = this.createDivEl('', 'menu-item-wrap');
    wrapEl4.appendChild(this.createPEl('', 'menu-item-label', '組版'));

    const writeWrap = this.createDivEl('', 'novel-radio-wrap');
    const rtlRdo = this.createRadioEl('write-rtl', '', 'write', 'rtl');
    rtlRdo.addEventListener("change", (event) => { this.toggleWriting(event); }, false);
    writeWrap.appendChild(rtlRdo);
    writeWrap.appendChild(this.createLabelEl('', ['radio-label-style', 'style-rtl'], 'write-rtl', '縦書き'));
    const ltrRdo = this.createRadioEl('write-ltr', '', 'write', 'ltr');
    ltrRdo.addEventListener("change", (event) => { this.toggleWriting(event); }, false);
    writeWrap.appendChild(ltrRdo);
    writeWrap.appendChild(this.createLabelEl('', ['radio-label-style', 'style-ltr'], 'write-ltr', '横書き'));

    wrapEl4.appendChild(writeWrap);
    contentsEl.appendChild(wrapEl4);

    menu.appendChild(contentsEl);
    menuDivEl.appendChild(menu);

    return menuDivEl;
  }

  /**
   * 目次メニューの作成
   * @param {Array} indexList 目次リスト
   * @returns {Element} 目次メニューのElement
   */
  createIndex(indexList) {
    const menuDivEl = this.createDivEl('', '');

    const indexMenuBtn = this.craeteCheckboxEl('novel-index-toggle', '');
    indexMenuBtn.addEventListener("change", (event) => { this.toggleIndex(event); }, false);
    menuDivEl.appendChild(indexMenuBtn);
    
    menuDivEl.appendChild(this.createLabelEl('', 'novel-index-toggle-label', 'novel-index-toggle', '目次'))
    const menu = this.createDivEl('novel-index-menu', 'novel-menu');
    const contentsEl = this.createDivEl('', 'novel-index-contents');

    contentsEl.appendChild(this.createPEl('', 'index-title', this.getTitle()));
    contentsEl.appendChild(this.createPEl('', 'index-subtitle', this.getSubtitle()));
    // 目次リスト作成
    contentsEl.appendChild(this.createIndexList(indexList));

    menu.appendChild(contentsEl);
    menuDivEl.appendChild(menu);

    return menuDivEl;
  }
  
  /**
   * 目次リストの作成
   * @param {Array} indexArray 目次リスト
   * @returns {Element} 目次リストの Ol Element
   */
  createIndexList(indexArray) {
    // 目次リストの作成
    const currentUri = window.location.href;
    const ol = document.createElement('ol');
    ol.setAttribute('id', this.prefix + 'index-list');
    this.addClass(ol, 'index-list');

    let idx = -1;
    var fragment = document.createDocumentFragment();
    Object.keys(indexArray).forEach((key, index) => {
      const li = document.createElement('li');
      if (currentUri.endsWith(indexArray[key])) {
        li.appendChild(this.createAEl('', 'current', indexArray[key], key, false));
        idx = index;
      }
      else {
        li.appendChild(this.createAEl('', '', indexArray[key], key));
      }
      fragment.appendChild(li);
    });

    ol.appendChild(fragment);

    // 前話リンク
    if (0 <= (idx - 1)) {
      const key = Object.keys(indexArray)[idx-1];
      this.insertHeader(key, indexArray[key]);
    }
    // 次話リンク
    if ((idx + 1) < Object.keys(indexArray).length) {
      const key = Object.keys(indexArray)[idx+1];
      this.insertFooter(key, indexArray[key]);
    }
    else {
      this.insertFooter(false, false);
    }

    return ol;
  }

  /**
   * ヘッダーリンクの挿入
   * @param {string} section タイトル
   * @param {string} url リンク先のURL
   */
  insertHeader(section, url) {
    // 小説ヘッダーリンク作成
    const headerEl = document.createElement('header');
    this.addClass(headerEl, 'novel-header');
    headerEl.appendChild(this.createAEl('', 'prev-link', url, section, false));
    this.wrapper.insertBefore(headerEl, this.wrapper.firstChild);
  }

  /**
   * フッターの挿入
   * @param {string} section タイトル
   * @param {string} url リンク先のURL
   */
  insertFooter(section, url) {
    const footerEl = document.createElement('footer');
    this.addClass(footerEl, 'novel-footer');

    // シェアボタン作成
    if (this.useShare) {
      const snsEl = this.createDivEl('', 'sns-wrap');
      const shareDiv = this.createDivEl('', 'sns-btn-wrap');
      const btnEl = this.createBtnEl('', 'btn-share', 'シェア', 'button');
      shareDiv.appendChild(btnEl);
      snsEl.appendChild(shareDiv);

      // シェアURL取得
      const shareUrl = window.location.href;
      
      // シェアタイトル取得
      const title = this.getTitle();
      const shareTitle = title === '' ? '' : title + ' ';
      
      // シェアサブタイトル取得
      const subtitle = this.getSubtitle();
      const shareSubTitle = subtitle === '' ? '' : subtitle;
      
      // シェアタイトル取得
      const sectiontitle = '「' + this.getSectionTitle() + '」\n';

      // シェアテキスト
      const shareText = shareTitle + shareSubTitle + sectiontitle

      // 2025.01.11 Share API がスマホ端末で適切に動作しなくなっているとのことで、一時的にコピー用フォームが出るものだけに統一する。
      // 参考URL：https://techblog.kayac.com/web-share-api-workaround
      // if (!navigator.canShare) {
        // navigator.share() が使用不可
        const cpTextWrap = this.createDivEl('shareArea', ['shareTextWrap', 'hide']);
        const description = document.createElement('p')
        description.innerHTML = '下記テキストをコピーして、<br>SNSの投稿画面に貼り付けてください。';
        cpTextWrap.appendChild(description);

        const textarea = document.createElement('textarea');
        textarea.value = shareText + shareUrl;
        textarea.addEventListener('click', (event) => {
          event.target.select();
        });
        cpTextWrap.appendChild(textarea);

        const cpBtn = this.createBtnEl('', 'copyBtn', 'クリップボードにコピー', 'button');
        cpBtn.addEventListener('click', () => {
          const copyText = textarea.value;
          navigator.clipboard.writeText(copyText).then(
            () => {
              /* clipboard successfully set */
              alert('クリップボードにコピーしました！');
            },
            () => {
              /* clipboard write failed */
              alert('コピーに失敗しました。お手数ですが、手動でコピーをお願いいたします。');
            },
          );;
        });
        cpTextWrap.appendChild(cpBtn);
        snsEl.appendChild(cpTextWrap);

        btnEl.addEventListener('click', () => {
          if (cpTextWrap.classList.contains('snv-hide')) {
            cpTextWrap.classList.remove('snv-hide');
          }
          else {
            cpTextWrap.classList.add('snv-hide');
          }
        });
      // } else {
      //   // navigator.share() が使用可能
      //   btnEl.addEventListener('click', async () => {
      //   try {
      //       await navigator.share({
      //             text: shareTitle + shareSubTitle + sectiontitle,
      //             url: shareUrl
      //         })
      //     } catch(err) {
      //       console.log(err)
      //     }
      //   });
      // }

      footerEl.appendChild(snsEl);
    }

    // 小説フッターリンク作成
    const nextLink = document.createElement('a');
    if (section) {
      this.addClass(nextLink, 'next-link');
      nextLink.setAttribute('href', url);
      nextLink.innerText = section;
      footerEl.appendChild(nextLink);
    }
    else if (this.return) {
      this.addClass(nextLink, 'close-link')
      nextLink.setAttribute('href', this.return);
      nextLink.innerText = '閉じる';
      footerEl.appendChild(nextLink);
    }

    this.wrapper.appendChild(footerEl);
  }

  /**
   * 前回のテーマ情報の復元（初回表示の場合はデフォルトテーマを設定）
   */
  saveStyleLoad() {
    // テーマロード
    this.addClass(this.wrapper, 'novel-wrapper');
    // スタイル設定
    let key = this.searchLocalStorage('fontsize');
    this.fontsize = key !== false && this.getStrage(key) ? this.getStrage(key) : 'normal';
    this.addClass(this.wrapper, "fontsize-" + this.fontsize);
    document.getElementById(this.prefix + "fontsize-" + this.fontsize).checked = true;

    key = this.searchLocalStorage('theme');
    this.theme = key !== false && this.getStrage(key) ? this.getStrage(key) : "white";
    this.addClass(this.wrapper, 'paper-' + this.theme);
    
    document.getElementById(this.prefix + "theme-" + this.theme).checked = true;

    key = this.searchLocalStorage('font');
    this.font = key !== false && this.getStrage(key) ? this.getStrage(key) : "mincho";
    this.addClass(this.wrapper, 'font-' + this.font);
    document.getElementById(this.prefix + "font-" + this.font).checked = true;

    key = this.searchLocalStorage('writing');
    this.writing = key !== false && this.getStrage(key) ? this.getStrage(key) : "ltr";
    this.addClass(this.wrapper, this.writing);
    document.getElementById(this.prefix + "write-" + this.writing).checked = true;
  }

  /**
   * LocalStorage キーの存在確認
   * @param {string} target 取得したい保存情報のキー
   * @returns {any} 見つかったキー情報。見つからない時は false を返す。
   */
  searchLocalStorage(target) {
    const searcheKey = this.prefix + target;
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i) === searcheKey) {
        return localStorage.key(i);
      }
    }
    return false;
  }

  /**
   * 小説本文の作成
   */
  createNovelBody() {
    // 小説本文変換処理
    const target = document.getElementById("novel-body");
    return this.convertNovelText(target);
  }

  /**
   * 小説本文の変換
   * @param {Element} target 小説本文が入っているElement
   * @returns {boolean} 挿絵読み込みがある場合は true、ない場合は flase を返す。
   */
  convertNovelText(target) {
    let prevText = target.innerHTML;
    // 本文を一行ごとに分割・配列化
    const lines = prevText.split(/\r\n|\n/);

    const imageRegex = /\[[^\]]+\]/;
    let newText = "";
    let imgidx = 1;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      // 挿絵段落
      if (imageRegex.test(line)) {
        newText += "<p id=\"" + this.prefix + "sashie" + imgidx + "\"></p>";
        imgidx++;
      }
      else {
        // 記法変換
        line = this.convertNotation(line);

        // インデント処理（HTMLを使用しない時はここで処理）
        if (this.indent && !this.useHtml) {
          line = this.addIndent(line);
        }
        // HTMLを使う場合は、p要素でテキストを囲わない
        if (this.useHtml) {
          newText += line;
        }
        else {
          newText += "<p>" + line + "</p>";
        }
      }
    }
    target.innerHTML = newText;
    
    // HTMLを使う場合のインデント処理は、HTMLタグの処理の関係で記法変換完了後のここで一括で行う
    if (this.indent && this.useHtml) {
      this.convertIndent(target);
    }

    // 画像読み込み
    let imagesUri = this.getImagesUri(lines);
    const images = this.createImages(imagesUri);
    // ダミー画像挿入
    this.insertImageFlags(images);

    return images && 0 < images.length ? true : false;
  }

  /**
   * 変換
   * @param {string} line 本文を改行分割した1行分のテキスト
   * @returns {string} 変換後のテキスト
   */
  convertNotation(line) {
    // 記法変換
    // 青空文庫記法を変換
    const convertText = this.convertAozoraBunkoNotation(line);
    // それ以外の記法を変換
    return this.convertOrgNotation(convertText);
  }

  /**
   * 記法の変換（画像以外）
   * @param {text} convertText 記法変換したいテキスト
   * @returns {string} 変換後のテキスト
   */
  convertOrgNotation(convertText) {
    
    function replaceDash(match) {
      let result = '<span class="snv-dash-rule">';
      let i = 0;
      const maxLen = match.length;
      while (i < maxLen) {
        result += '—';
        i++;
      }
      return result + '</span>';
    }
    
    // 記法変換
    // ハイフン→ダッシュ
    convertText = convertText.replace(/(-){2,}/g, replaceDash);
    // マイナス→ダッシュ
    convertText = convertText.replace(/(−){2,}/g, replaceDash);
    // ENダッシュ→ダッシュ
    convertText = convertText.replace(/(–){2,}/g, replaceDash);
    // 水平線→ダッシュ
    convertText = convertText.replace(/(―){2,}/g, replaceDash);
    // 罫線記号の横棒→ダッシュ
    convertText = convertText.replace(/(─){2,}/g, replaceDash);
    // 全角ハイフン→ダッシュ
    convertText = convertText.replace(/(－){2,}/g, replaceDash);
    // ダッシュ変換
    convertText = convertText.replace(/(—){2,}/g, replaceDash);
    // ルビ変換
    convertText = convertText.replace(/[\|｜](.+?)《(.+?)》/g, '<ruby><rb>$1</rb><rp>（</rp><rt>$2</rt><rp>）</rp></ruby>');
    // 圏点変換
    convertText = convertText.replace(/《《(.+?)》》/g, '<span class="snv-emphasis">$1</span>');

    return convertText;
  }

  /**
   * 記法の変換（青空文庫記法オンリー）
   * @param {text} convertText 記法変換したいテキスト
   * @returns {string} 変換後のテキスト
  */
  convertAozoraBunkoNotation(convertText) {

    function replaceEmphases(match, t1, t2) {
      const index = t1.lastIndexOf(t2);
      if (index !== -1 && (index + t2.length) === t1.length) {
        let result = t1.slice(0, index);
        return result += '<span class="snv-emphasis">'+ t2 +'</span>';
      }
      return match;
    }

    function replaceTextOrientation(match, t1, t2) {
      const index = t1.lastIndexOf(t2);
      if (index !== -1 && (index + t2.length) === t1.length) {
        let result = t1.slice(0, index);
        return result += '<span class="svn-text-orient">' + t2 + '</span>'
      }
      return match;
    }

    function replaceImage(match, alt, src, w, h) {
      w = parseInt(w, 10);
      h = parseInt(h, 10);

      if (!src) {
        return match;
      }
      else if (w > h) {
        return '<img src="' + src + '" alt="' + alt + '" class="dir-v" width="' + w + '" height="' + h + '">';
      }
      else if (h > w) {
        return '<img src="' + src + '" alt="' + alt + '" class="dir-h" width="' + w + '" height="' + h + '">';
      }
      else if(w === h) {
        return '<img src="' + src + '" alt="' + alt + '" width="' + w + '" height="' + h + '">';
      }
      return match;
    }

    // 圏点
    convertText = convertText.replace(/(.+?)［＃「([^」]+?)」に傍点］/g, replaceEmphases)
    // 縦中横
    convertText = convertText.replace(/(.+?)［＃「([^」]+?)」は縦中横］/g, replaceTextOrientation);
    // 画像
    convertText = convertText.replace(/［＃(.*?)（(.+?)、横([0-9]+?)×縦([0-9]+?)）入る］/g, replaceImage);

    return convertText;
  }

  /**
   * 挿絵作成
   * @param {Array} imagesUri 挿絵URLの配列
   * @returns {Array} 挿絵 Image Element の配列
   */
  createImages(imagesUri) {
    this.loadingCount = 0;
    let images = new Array(imagesUri.length);
    for (let i = 0; i < imagesUri.length; i++) {
      images[i] = new Image();
      images[i].src = imagesUri[i];
      images[i].alt = '';
      // 挿絵ファイル読み込み完了時の処理
      images[i].addEventListener('load',() => {

        const parent = document.getElementById(this.prefix + "sashie" + (i+1));
        if (images[i].width > images[i].height) {
          images[i].classList.add('dir-v');
        }
        else {
          images[i].classList.add('dir-h');
        }
        const pEl = document.createElement("p");
        pEl.appendChild(images[i]);
        // ダミー画像との入れ替え
        parent.parentNode.insertBefore(pEl, parent);
        parent.parentNode.removeChild(parent);

        this.loadingCount++;
        // 挿絵の読み込みが完了したら表示完了処理
        if (this.loadingCount === imagesUri.length) {
          this.renderingFinish();
        }
      });
    }
    return images;
  }

  /**
   * 自動インデント処理
   * @param {Element} target 小説本文のElement
   */
  convertIndent(target) {
    // 自動インデント処理
    let lines = target.children;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (this.CheckTag(line)) {
        line.innerHTML = this.addIndent(line.innerHTML);
      }
      // テキストを入れ替えるだけ
      target.replaceChild(target.children[i], line);
    }
  }

  /**
   * インデント追加
   * @param {string} text 本文の一行
   * @returns {string} インデントを追加した text
   */
  addIndent(text) {
    // インデント追加
    text = text.trim();
    if (this.firstCharCheck(text)) {
      text = "　" + text;
    }
    return text;
  }

  /**
   * タイトルの取得
   * @returns {string} タイトル
   */
  getTitle() {
    const titleNode = document.getElementById('nvl-title');
    let title = '';
    // ノードがテキストのみ取得
    for(let elem of titleNode.childNodes){
      if(elem.nodeName == "#text"){
        title += elem.nodeValue;
      }
    }
    return title.trim();
  }

  /**
   * サブタイトルの取得
   * @returns {string} サブタイトル
   */
  getSubtitle() {
    return document.getElementById('nvl-subtitle') ? document.getElementById('nvl-subtitle').textContent.trim() : '';
  }

  /**
   * 節タイトルの取得
   * @returns {string} 節タイトル
   */
  getSectionTitle() {
    // 節タイトルの取得
    return document.getElementById('nvl-section-title').textContent.trim();
  }

  /**
   * 挿絵URLリストの作成
   * @param {Array} lines 一行ごとに分割した本文リスト
   * @returns {Array} 挿絵のURLリスト
   */
  getImagesUri(lines) {
    // 挿絵URLの取得
    let imagesUri = new Array();
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      const matchUrls = line.match(/\[([^\]]+)\]/);
      if (matchUrls) {
        const uris = matchUrls[1];
        if (Array.isArray(uris)) {
          for (let j = 0; j < uris.length; j++) {
            imagesUri.push(uris[j]);
          }
        }
        else {
          imagesUri.push(uris);
        }
      }
    }
    return imagesUri;
  }

  /**
   * ダミー画像の挿入
   * @param {Array} images Image Elements の配列
   */
  insertImageFlags(images) {
    for (let i = 0; i < images.length; i++) {
      let img = document.getElementById(this.prefix + 'sashie' + (i+1));
      img.appendChild(images[i]);
    }
  }

  renderingFinish() {
    // スクロール方向により初期化
    if (this.writing === 'rtl') {
      this.setScrollX();
    }
    this.loadingHide();    
  }

  /**
   * ローディング画面の非表示
   */
  loadingHide() {
    // ローディング画面の非表示
    const existLoading = !!document.getElementById(this.prefix + 'loading');
    if (existLoading) {
      document.getElementById(this.prefix + "loading").classList.add('hide');
    }
  }

  /**
   * テーマ切り替え
   * @param {*} event
   */
  toggleTheme(event) {
    const newTheme = event.target.value;
    this.changeClass(this.theme, newTheme, "paper-");
    this.theme = newTheme;
    this.setStrage("theme", newTheme);
  }

  /**
   * フォント切り替え
   * @param {*} event
   */
  toggleFont(event) {
    const newFont = event.target.value;
    this.changeClass(this.font, newFont, "font-");
    this.font = newFont;
    this.setStrage("font", newFont);
  }

  /**
   * フォントサイズの切り替え
   * @param {*} event 
   * @returns 文章方向が横の時は以降の処理を行わない
   */
  toggleFontsize(event) {
    const prevAreaX = document.body.scrollWidth - document.body.offsetWidth;
    const posX = window.scrollX;
    const newFontsize = event.target.value;
    this.changeClass(this.fontsize, newFontsize, "fontsize-");
    this.fontsize = newFontsize;
    this.setStrage("fontsize", newFontsize);

    if (this.writing !== "rtl") {
      return;
    }

    const newAreaX = document.body.scrollWidth - document.body.offsetWidth;
    const offsetX = prevAreaX - newAreaX;
    const newPosX = posX - offsetX;
    window.scroll(newPosX, 0);
  }
  /**
   * 文章方向の切り替え
   * @param {*} event 
   */
  toggleWriting(event) {
    const newWriting = event.target.value;
    this.changeClass(this.writing, newWriting, "");
    this.writing = newWriting;
    this.setStrage("writing", newWriting);

    if (this.writing === 'ltr') {
      this.setScrollY();
    }
    else {
      this.setScrollX();
    }
  }

  /**
   * スタイルメニューの表示切り替え
   * @param {*} event 
   */
  toggleStyle(event) {
    let flg = event.target.checked;
    if (flg) {
      document.getElementById(this.prefix + "close-style").style.display = "block";
    } else {
      document.getElementById(this.prefix + "close-style").style.display = "none";
    }
  }

  /**
   * 目次メニューの表示切り替え
   * @param {*} event 
   */
  toggleIndex(event) {
    // 目次メニューの表示切り替え
    const flg = event.target.checked;
    if (flg) {
      document.getElementById(this.prefix + "close-index").style.display = "block";
    } else {
      document.getElementById(this.prefix + "close-index").style.display = "none";
    }
  }

  /**
   * メニューElement作成用
   * @param {string} idName 設定するid名
   * @param {Array} classArray 設定するclass配列
   * @returns {Element} メニューのElement
   */
  createMenuEl(idName, classArray) {
    const menu = document.createElement('menu');
    if (0 < idName.length) {
      menu.setAttribute('id', this.prefix + idName);
    }
    if (0 < classArray.length) {
      this.addClass(menu, classArray);
    }
    return menu;
  }
  
  /**
   * Div Element 作成用
   * @param {string} idName 設定するid名
   * @param {Array} classArray 設定するclass配列
   * @returns {Element} Div Element
   */
  createDivEl(idName, classArray) {
    const div = document.createElement('div');
    if (0 < idName.length) {
      div.setAttribute('id', this.prefix + idName);
    }
    if (0 < classArray.length) {
      this.addClass(div, classArray);
    }
    return div;
  }

  /**
   * P Element 作成用
   * @param {string} idName 設定するid名
   * @param {Array} classArray 設定するclass配列
   * @param {string} text 表示するテキスト
   * @returns {Element} P Element
   */
  createPEl(idName, classArray, text) {
    const p = document.createElement('p');
    if (0 < idName.length) {
      p.setAttribute('id', this.prefix + idName);
    }
    if (0 < classArray.length) {
      this.addClass(p, classArray);
    }
    p.innerText = text;
    return p;
  }

  /**
   * Span Element 作成用
   * @param {string} idName 設定するid名
   * @param {Array} classArray 設定するclass配列
   * @param {string} text 表示するテキスト
   * @returns {Element} Span Element
   */
  createSpanEl(idName, classArray, text) {
    const span = document.createElement('span');
    if (0 < idName.length) {
      span.setAttribute('id', this.prefix + idName);
    }
    if (0 < classArray.length) {
      this.addClass(span, classArray);
    }
    span.innerText = text;
    return span;
  }
  
  /**
   * A Element 作成用
   * @param {string} idName 設定するid名
   * @param {Array} classArray 設定するclass配列
   * @param {string} href リンク先
   * @param {string} text 表示するテキスト
   * @param {boolean} blank 別窓表示をするかどうか
   * @returns {Element} A Element
   */
  createAEl(idName, classArray, href, text, blank) {
    const a = document.createElement('a');
    if (0 < idName.length) {
      a.setAttribute('id', this.prefix + idName);
    }
    if (0 < classArray.length) {
      this.addClass(a, classArray);
    }
    a.href = href;
    a.innerText = text;
    if (blank) {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    }
    return a;
  }

  /**
   * Label Element 作成用
   * @param {string} idName 設定するid名
   * @param {Array} classArray 設定するclass配列
   * @param {*} forName 設定するfor名
   * @param {*} text 表示するテキスト
   * @returns {Element} Label Element
   */
  createLabelEl(idName, classArray, forName, text) {
    const lbl = document.createElement('label');
    if (0 < idName.length) {
      lbl.setAttribute('id', this.prefix + idName);
    }
    if (0 < classArray.length) {
      this.addClass(lbl, classArray);
    }
    if (0 < forName.length) {
      lbl.setAttribute('for', this.prefix + forName);
    }
    lbl.innerText = text;
    return lbl;
  }

  /**
   * Checkbox Element 作成用
   * @param {string} idName 設定するid名
   * @param {Array} classArray 設定するclass配列
   * @returns {Element} Checkbox Element
   */
  craeteCheckboxEl(idName, classArray) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    if (0 < idName.length) {
      checkbox.setAttribute('id', this.prefix + idName);
    }
    if (0 < classArray.length) {
      this.addClass(checkbox, classArray);
    }
    return checkbox;
  }

  /**
   * Radio Element 作成用
   * @param {string} idName 設定するid名
   * @param {Array} classArray 設定するclass配列
   * @param {*} name 設定するname名
   * @param {*} value valueに設定する値
   * @returns {Element} Radio Element
   */
  createRadioEl(idName, classArray, name, value) {
    const radio = document.createElement('input');
    radio.type = 'radio';
    if (0 < idName.length) {
      radio.setAttribute('id', this.prefix + idName);
    }
    if (0 < classArray.length) {
      this.addClass(radio, classArray);
    }
    if (0 < name.length) {
      radio.setAttribute('name', name);
    }
    radio.value = value;
    return radio;
  }

  /**
   * Button Element 作成用
   * @param {string} idName 設定するid名
   * @param {Array} classArray 設定するclass配列
   * @param {string} text 表示するボタン名
   * @param {string} type ボタンタイプ(button, submit, reset)
   */
  createBtnEl(idName, classArray, text, type) {
    const button = document.createElement('button');
    if (0 < idName.length) {
      button.setAttribute('id', this.prefix + idName);
    }
    if (0 < classArray.length) {
      this.addClass(button, classArray);
    }
    if (0 < text.length) {
      button.innerText = text;
    }
    if (type === '') {
      type = 'button';
    }
    button.setAttribute('type', type);

    return button;
  }

  /**
   * クラス追加
   * @param {Element} el classを追加するElement
   * @param {Array} classArray 追加したいclass配列
   */
  addClass(el, classArray) {
    if (Array.isArray(classArray)) {
      classArray.forEach(cls => {
        el.classList.add(this.prefix + cls);
      });
    }
    else {
      el.classList.add(this.prefix + classArray);
    }
  }

  /**
   * テーマクラスの入れ替え
   * @param {string} prevClass 変更したいclass名
   * @param {string} newClass 変更後のclass名
   * @param {string} paramName classの前に追加したいprefix
   */
  changeClass(prevClass, newClass, paramName) {
    this.wrapper.classList.remove(this.prefix + paramName + prevClass);
    this.wrapper.classList.add(this.prefix + paramName + newClass);
  }

  /**
   * 縦スクロース位置制御
   */
  setScrollY() {
    const prevY = window.scrollY;
    const prevX = (document.body.scrollWidth - document.body.offsetWidth) - window.scrollX;

    const areaY = document.body.scrollHeight;
    const areaX = document.body.scrollWidth - document.body.offsetWidth;

    if (!this.touchDevice) {
      window.removeEventListener("wheel", this.scrollyTox, {passive: false});
    }
    window.scroll(0, prevX);
  }

  /**
   * 横スクロール位置制御
   */
  setScrollX() {
    const prevY = window.scrollY;
    const prevX = (document.body.scrollWidth - document.body.offsetWidth) - window.scrollX;

    const areaY = document.body.scrollHeight;
    const areaX = document.body.scrollWidth - document.body.offsetWidth;
    
    if (!this.touchDevice) {
      window.addEventListener("wheel", this.scrollyTox, {passive: false});
    }
    window.scroll(areaX - prevY, 0);
  }

  /**
   * LocalStrage のデータ保存・削除
   * @param {string} name 保存、削除したいデータのキー名
   * @param {any} item 保存したいデータ
   */
  setStrage(name, item) {
    if (name && item) {
      localStorage.setItem(this.prefix + name, item);
    }
    else {
      localStorage.removeItem(this.prefix + name);
    }
  }

  /**
   * LocalStrage のデータ取得
   * @param {string} name 取得したいデータ名
   * @returns {any} 取得したデータ
   */
  getStrage(name) {
    return localStorage.getItem(name);
  }

  /**
   * スクロール制御
   * @param {*} e event
   */
  scrollyTox(e) {
    if (e.deltaX === 0) {
      e.stopPropagation()
      e.preventDefault()
      // noinspection JSSuspiciousNameCombination
      var userAgent = window.navigator.userAgent.toLowerCase();
      if (userAgent.indexOf('firefox') !== -1) {
        document.getElementById('snv-app').scrollBy(-e.deltaY * 10, 0);
      }
      else {
        document.getElementById('snv-app').scrollBy(-e.deltaY, 0);
      }
    }
  }

  /**
   * HTMLタグ判定
   * @param {string} line 本文の一行
   * @returns {boolean} IMGタグの場合は false、それ以外は true を返す
   */
  CheckTag(line) {
    switch (line.tagName)
    {
      case 'P':
          return true;
      case 'IMG':
          return false;
      default:
          return true;
    }
  }

  /**
   * インデント付与対象となるかどうかの確認
   * @param {string} l チェックしたい1文
   * @returns {boolean} インデント対象の場合は true を返す
   */
  firstCharCheck(l) {
    const c1 = l.trim().substring(0, 1);
    if (c1 === "「") {
      return false;
    }
    if (c1 === "（") {
      return false;
    }
    if (c1 === "『") {
      return false;
    }
    const c2 = l.substring(0, 2);
    if (c2 === "<i") {
      return false;
    }
    return true;
  }

  /**
   * タッチデバイスかの判定用
   * @returns {boolean} タッチデバイスの場合は true を返す
   */
  isTouchDevice() {
    var result = false;
    if (window.ontouchstart === null) {
      result = true;
    }  
    return result;
  }

  /**
   * Android 端末判定。
   * @returns {boolean} Android 端末の時は true を返す。それ以外は false。
   */
  isAndroid () {
    return navigator.userAgent.includes('Android');
  }

}
