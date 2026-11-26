---
name: FORMA Architectural
colors:
  surface: "#ffffff"
  surface-dim: "#f3f0e9"
  surface-bright: "#ffffff"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f3f0e9"
  surface-container: "#eae5dc"
  surface-container-high: "#ddd8cf"
  surface-container-highest: "#c9c3b8"
  on-surface: "#22221f"
  on-surface-variant: "#6d6962"
  outline: "#908b83"
  outline-variant: "#ddd8cf"
  surface-tint: "#d07a3b"
  primary: "#d07a3b"
  primary-hover: "#ca7538"
  accent: "#d07a3b"
  on-primary: "#22221f"
  primary-container: "#f3f0e9"
  on-primary-container: "#22221f"
  secondary: "#6d6962"
  on-secondary: "#ffffff"
  secondary-container: "#eae5dc"
  on-secondary-container: "#22221f"
  tertiary: "#908b83"
  on-tertiary: "#22221f"
  tertiary-container: "#eae5dc"
  on-tertiary-container: "#22221f"
  error: "#a6382c"
  on-error: "#ffffff"
  error-container: "#f8ded9"
  on-error-container: "#681b14"
  success: "#356b49"
  on-success: "#ffffff"
  success-container: "#d7eadb"
  on-success-container: "#173b25"
  warning: "#8c571a"
  on-warning: "#ffffff"
  warning-container: "#f3e3c8"
  on-warning-container: "#52320e"
  info: "#385c73"
  on-info: "#ffffff"
  info-container: "#dce8ef"
  on-info-container: "#1c3b50"
  background: "#ffffff"
  on-background: "#22221f"
  brand-primary: "#d07a3b"
  brand-primary-hover: "#ca7538"
  brand-accent: "#d07a3b"
  brand-dark: "#22221f"
  brand-light: "#f3f0e9"
  brand-cream: "#f3f0e9"
typography:
  display:
    fontFamily: "Instrument Sans Variable, sans-serif"
    fontSize: "clamp(72px, 7vw, 112px)"
    fontWeight: "600"
    lineHeight: 0.88
    letterSpacing: "-0.06em"
  headline:
    fontFamily: "Instrument Sans Variable, sans-serif"
    fontSize: "clamp(48px, 4vw, 64px)"
    fontWeight: "600"
    lineHeight: 0.96
    letterSpacing: "-0.05em"
  title:
    fontFamily: "Instrument Sans Variable, sans-serif"
    fontSize: 30px
    fontWeight: "600"
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Instrument Sans Variable, sans-serif"
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 1.6
    letterSpacing: "-0.005em"
  label:
    fontFamily: "Instrument Sans Variable, sans-serif"
    fontSize: 14px
    fontWeight: "500"
    lineHeight: 1.4
    letterSpacing: 0
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.25rem
  lg: 1.75rem
  xl: 2rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 48px
  container-px: "clamp(1.25rem, 4vw, 4rem)"
  section-py: "clamp(4.5rem, 9vw, 10rem)"
elevation:
  soft: "0 8px 30px rgb(20 20 18 / 0.06)"
  strong: "none"
ui:
  text-on-light: "#22221f"
  text-on-light-subtle: "#6d6962"
  type-lead-tracking: "-0.015em"
  type-lead-leading: "1.45"
  type-body-leading: "1.6"
  type-heading-tracking: "-0.05em"
  font-sans: "var(--font-sans)"
  font-heading: "var(--font-heading)"
  button-radius: "1rem"
  button-hover-effect: "material-inversion"
  bg-base: "var(--color-brand-light)"
  bg-page: "#ffffff"
  bg-surface: "#ffffff"
  bg-accent: "var(--color-brand-primary)"
fonts:
  sans: "Instrument Sans Variable, sans-serif"
  heading: "Instrument Sans Variable, sans-serif"
animations:
  scroll: "scroll 30s linear infinite"
---

# FORMA Design System

## Kierunek marki

FORMA jest nowoczesną marką budowlano-remontową inspirowaną architekturą, geometrią i współczesnym projektowaniem przestrzeni. Ma kojarzyć się z precyzją, jakością, materiałem i świadomym kształtowaniem przestrzeni. Strona ma budować wrażenie marki architektonicznej, z własnym charakterem, mocną typografią i fotografią. Premium oznacza tu jakość i spójność, bez ostentacyjnego luksusu.

Minimalizm nie oznacza pustej strony ani szeregu jednakowych kart. Kompozycje mogą być rozbudowane i nieregularne, jeżeli każdy element wspiera hierarchię lub pomaga zrozumieć ofertę. Ogranicz ozdobniki i visual clutter.

## Logo i akcent marki

Podstawowy układ logo to geometryczny symbol i napis FORMA zakończony pomarańczową kropką. Symbol odwołuje się do bryły budynku, dachu, przestrzeni i konstrukcji. Logo jest gotowym assetem SVG. Nie składaj go ponownie z tekstu ani fontu strony. Przygotowuj warianty na jasne i ciemne tło, sam symbol, symbol z nazwą oraz favicon. Zachowuj wolną przestrzeń wokół znaku wynoszącą co najmniej połowę wysokości symbolu.

Pomarańczowa kropka z logo może pojawiać się jako niewielki separator, punkt numeracji, aktywny detal, stan hover lub akcent CTA. Używaj jej oszczędnie i konsekwentnie.

## Typografia

Instrument Sans jest jedynym fontem interfejsu. Używaj go w nagłówkach, treści, nawigacji, przyciskach, etykietach i podpisach. Logo pozostaje osobnym assetem. Typografia jest zwarta, geometryczna i lekko editorialowa. Buduj hierarchię kontrastem rozmiaru, a nie nadmierną grubością. Preferowane wagi to 400, 450, 500, 600, 650 i 700. Nie używaj wag 800-900.

Display XL: `clamp(72px, 7vw, 112px)`, interlinia 0.88, waga 600, tracking `-0.06em`. Na mobile 52-64px, interlinia 0.9 i tracking `-0.055em`.

H1: desktop `clamp(68px, 5.5vw, 88px)`, interlinia 0.92, waga 600 i tracking `-0.055em`. Tablet 58-72px i interlinia 0.94. Mobile 44-54px, interlinia 0.94 i tracking `-0.045em`.

H2: desktop `clamp(48px, 4vw, 64px)`, interlinia 0.96, waga 600 i tracking `-0.05em`. Mobile 36-44px i interlinia 0.98. H3 ma 30-36px na desktopie i 26-30px na mobile, interlinię 1.02, wagę 600 i tracking `-0.035em`. Nagłówki kart mają 22-26px, interlinię 1.1, wagę 600 i tracking `-0.025em`.

Lead ma 20px, interlinię 1.45, wagę 400, tracking `-0.015em` i maksymalną szerokość 600px. Duży tekst treści ma 18px i interlinię 1.55. Tekst podstawowy ma 16px, interlinię 1.6 i tracking `-0.005em`. Tekst mały ma 14px i interlinię 1.5. Micro ma 12px, interlinię 1.4 i wagę 500.

Etykiety eyebrow używają 13-14px, wagi 450-500, interlinii 1.4 i zwykłego zapisu. Nie zamieniaj ich automatycznie na uppercase ani nie dodawaj dużego letter spacing. Gdy uppercase ma konkretne uzasadnienie, stosuj 11-12px, wagę 500 i tracking `0.10em`.

## Kolory

Podstawowy grafit to `#22221F`, biel to `#FFFFFF`, ciepłe tło to `#F3F0E9`, drugie ciepłe tło to `#EAE5DC`, a miedziany pomarańcz marki to `#D07A3B`. Ciemniejszy wariant pomarańczu to `#CA7538`. Tekst podstawowy używa grafitu, tekst drugorzędny `#6D6962`, tekst wyciszony `#908B83`, a obramowania `#DDD8CF`.

Orientacyjnie 65-75% strony zajmują biel i ciepła biel, 15-25% fotografia i ciemne powierzchnie, a 5-10% pomarańcz. Pomarańcz ma pozostać rozpoznawalnym akcentem, nie dominującym tłem. Korzystaj z tokenów tego profilu zamiast wpisywać wartości kolorów bezpośrednio w komponentach.

## Siatka i odstępy

Kontener ma maksymalnie 1440px szerokości. Odstępy poziome wynoszą 48-64px na desktopie, 32-48px na laptopie i 20px na mobile. Siatka używa 12 kolumn na desktopie, 8 na tablecie i 4 na mobile, z przerwami 20-24px. Nie wymuszaj symetrii. Używaj proporcji 7/5, 5/7, 8/4, 4/8 i 6/6 oraz nieregularnych układów, gdy wzmacniają kompozycję.

Odstępy sekcji wynoszą 120-160px na desktopie, 160-200px dla szczególnie ważnych sekcji i 72-96px na mobile. Bazowa skala odstępów to wielokrotności 4px i 8px, od 8px do 160px.

Duże kontenery mają promień 28-32px, karty 20-28px, zdjęcia 20-28px, a przyciski 14-18px. Nie dodawaj radiusu każdemu elementowi. Ostra geometria logo ma kontrastować z miękkimi powierzchniami interfejsu.

## Nawigacja i przyciski

Nawigacja używa 14px, wagi 500, interlinii 1 i tracking `-0.01em`. Zachowuj czysty układ bez separatorów i zbędnych ikon. Preferowany układ to logo, linki „Usługi”, „Realizacje”, „O firmie” oraz wyrównane do prawej CTA „Kontakt ↗”.

Przycisk główny używa Instrument Sans, rozmiaru 15px, wagi 600, tracking `0.04em`, wysokości 48-52px, poziomego paddingu 26-30px, promienia 14-18px, pomarańczowego tła i grafitowego tekstu. Na hover tło zmienia się na grafitowe, tekst na jasny, a cienki pomarańczowy detal pojawia się przy prawej krawędzi. Strzałka wykonuje krótki ruch. Przyciski drugorzędne zachowują jasną powierzchnię i dostają pomarańczowy obrys. Drugorzędne CTA pozostają tekstowe, z podkreśleniem i delikatnym ruchem strzałki. Linki, kontrolki, stopka i FAQ używają tego samego akcentu marki oraz widocznego fokusu klawiatury. Uwzględnij `prefers-reduced-motion`.

## Hero i fotografia

Hero jest wyróżniającą kompozycją strony. Na desktopie pokaż dużą fotografię po lewej, zajmującą około 50-55% szerokości, i ciepłą powierzchnię z treścią po prawej, zajmującą około 45-50%. Treść zawiera eyebrow, zwarty nagłówek, opis, jedno CTA i opcjonalne krótkie metadane usług. Nie dodawaj zbędnych badge'y ani pływających dekoracji. Nagłówek jest największym elementem po fotografii.

Używaj naturalnych, spokojnych zdjęć nowoczesnych domów, realizacji, wnętrz, konstrukcji i detali materiałowych. Preferuj drewno, beton, kamień, metal oraz naturalne światło. Zdjęcia mają wyglądać realistycznie i architektonicznie. Unikaj pozowanych stocków z pracownikami patrzącymi w kamerę, uściskami dłoni i wskazywaniem blueprintów.

## Karty, liczby i linie

Karta usługi może zawierać numer, cienką linię, tytuł, krótki opis i link do omówienia usługi. Dopuszczalne są warianty ciemne, pomarańczowe, fotograficzne i ciepłe neutralne. Nie każda karta musi wyglądać tak samo. Unikaj szablonu z ikoną, tytułem, opisem i przyciskiem.

Numery 01, 02, 03 używają 11-13px i wagi 500. Mogą porządkować usługi, realizacje i etapy procesu. Linie i separatory mają 1px i kolor `#DDD8CF`; na ciemnym tle używaj bieli z kryciem około 20%. Preferuj je nad dekoracyjnymi kropkami.

Ikony stosuj oszczędnie. Wybieraj proste geometryczne kontury o grubości 1.5-2px albo znaki `→`, `↗`, `+`, `−`. Logo pozostaje głównym symbolem graficznym marki.

## Kompozycja, powierzchnie i cienie

Każda sekcja ma własną kompozycję, ale zachowuje wspólną typografię, logikę odstępów, kolory, geometrię i detale marki. Zmieniaj siatkę, proporcje, umiejscowienie, skalę zdjęć, tło i wyrównanie. Jeśli sekcja jest monotonna, w pierwszej kolejności popraw kompozycję, skalę, typografię lub fotografię.

Domyślnie nie używaj cieni. Subtelny wyjątek to `0 8px 30px rgba(20,20,18,0.06)`. Głębię buduj przede wszystkim kolorem, kontrastem, odstępami, fotografią i nakładaniem powierzchni.

## Ruch i interakcje

Ruch ma być spokojny i precyzyjny. Przejścia trwają 180-350ms, a preferowane easing to `cubic-bezier(0.22, 1, 0.36, 1)`. Dopuszczalne są ujawnianie opacity, przesunięcie Y o 10-20px, skala zdjęcia od 1 do 1.02 i ruch strzałki. Przyciski zmieniają kolor powierzchni i pokazują cienki detal krawędzi, a linki rysują podkreślenie. Hover ma być czytelny i subtelny. Unikaj bounce, elastic, mocnego parallaxu, losowych animacji i animowania wszystkiego. Uwzględniaj `prefers-reduced-motion`.

## Responsywność

Wersja mobilna ma być świadomą kompozycją, a nie pomniejszoną kopią desktopu. Zmniejsz liczbę kolumn, zachowaj dużą typografię i powierzchnię fotografii, uprość układ i utrzymaj asymetrię tam, gdzie jest możliwa. CTA pozostają wyraźne. Unikaj poziomego przewijania.

## Czego unikać

Nie używaj Inter, DM Sans, generycznego stylu SaaS, glassmorphismu, gradientowych plam, neonów, dużych cieni, nadmiaru ikon, dekoracyjnych kropek, przesadnej ilości pomarańczu ani jednakowych kart. Nie powtarzaj w każdej sekcji schematu nagłówek, opis, trzy karty i CTA. Unikaj typowego układu strony firmy remontowej z WordPressa i generycznych kompozycji AI.

## Tokeny i synchronizacja

Frontmatter tego pliku jest źródłem tokenów. Zmiany palety, typografii, promieni, odstępów i powierzchni synchronizuj poleceniem `npm run design:sync`. Szczegóły jednorazowego układu strony opisuj w kodzie projektu, a wspólne zasady wizualne utrzymuj tutaj.
