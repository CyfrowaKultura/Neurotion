// ============================================================
// 8 Primary Emotions & 64 Combinations (6seconds.org matrix)
// Order matters: Primary (Left) + Secondary (Right)
// ============================================================

export const categories = [
  { id: 'anger',        name: 'Złość',        color: '#E53935' }, // Red
  { id: 'anticipation', name: 'Oczekiwanie',  color: '#FF9800' }, // Orange
  { id: 'joy',          name: 'Radość',       color: '#FFEB3B' }, // Yellow
  { id: 'trust',        name: 'Zaufanie',     color: '#8BC34A' }, // Light Green
  { id: 'fear',         name: 'Strach',       color: '#00BFA5' }, // Teal / Green
  { id: 'surprise',     name: 'Zaskoczenie',  color: '#03A9F4' }, // Light Blue
  { id: 'sadness',      name: 'Smutek',       color: '#2196F3' }, // Blue
  { id: 'disgust',      name: 'Wstręt',       color: '#9C27B0' }, // Purple
];

// ============================================================
// Color utilities
// ============================================================
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.substring(0,2),16), parseInt(h.substring(2,4),16), parseInt(h.substring(4,6),16)];
}
function rgbToHex(r, g, b) {
  return '#' + [r,g,b].map(v => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2,'0')).join('');
}
function blendColors(hex1, hex2) {
  const [r1,g1,b1] = hexToRgb(hex1);
  const [r2,g2,b2] = hexToRgb(hex2);
  return rgbToHex((r1+r2)/2, (g1+g2)/2, (b1+b2)/2);
}

// ============================================================
// Base Emotions
// ============================================================

export const baseCoords = {
  joy: { x: 0.8, y: 0.5 },
  trust: { x: 0.7, y: -0.1 },
  fear: { x: -0.4, y: 0.85 },
  surprise: { x: 0.0, y: 0.85 },
  sadness: { x: -0.6, y: -0.7 },
  disgust: { x: -0.8, y: 0.1 },
  anger: { x: -0.7, y: 0.7 },
  anticipation: { x: 0.4, y: 0.5 }
};

// Seeded random for jitter
function pseudoRandom(seed) {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export const baseEmotions = [
  { id: 'anger',        name: 'Złość',        categoryId: 'anger',        color: '#E53935', description: 'Podstawowa emocja. Poczucie wrogości lub oporu.' },
  { id: 'anticipation', name: 'Oczekiwanie',  categoryId: 'anticipation', color: '#FF9800', description: 'Podstawowa emocja. Gotowość na to, co ma nadejść.' },
  { id: 'joy',          name: 'Radość',       categoryId: 'joy',          color: '#FFEB3B', description: 'Podstawowa emocja. Głębokie uczucie szczęścia.' },
  { id: 'trust',        name: 'Zaufanie',     categoryId: 'trust',        color: '#8BC34A', description: 'Podstawowa emocja. Przekonanie o bezpieczeństwie i szczerości.' },
  { id: 'fear',         name: 'Strach',       categoryId: 'fear',         color: '#00BFA5', description: 'Podstawowa emocja. Reakcja na zagrożenie.' },
  { id: 'surprise',     name: 'Zaskoczenie',  categoryId: 'surprise',     color: '#03A9F4', description: 'Podstawowa emocja. Reakcja na coś nieoczekiwanego.' },
  { id: 'sadness',      name: 'Smutek',       categoryId: 'sadness',      color: '#2196F3', description: 'Podstawowa emocja. Uczucie straty i przygnębienia.' },
  { id: 'disgust',      name: 'Wstręt',       categoryId: 'disgust',      color: '#9C27B0', description: 'Podstawowa emocja. Silna odraza.' }
];

function baseColor(id) {
  const e = baseEmotions.find(b => b.id === id);
  return e ? e.color : '#888';
}

// ============================================================
// The 64 Combinations Matrix
// ============================================================
const matrixData = [
  // ANGER (Row)
  { pri: 'anger', sec: 'anger',        id: 'rage',          name: 'Furia',         desc: 'Skrajnie intensywna złość wymykająca się spod kontroli, często prowadząca do gwałtownych zachowań.' },
  { pri: 'anger', sec: 'anticipation', id: 'focus',         name: 'Skupienie',     desc: 'Skoncentrowanie uwagi i energii na konkretnym celu, zasilane determinacją płynącą ze złości.' },
  { pri: 'anger', sec: 'joy',          id: 'zeal',          name: 'Gorliwość',     desc: 'Żarliwe zaangażowanie w sprawę, łączące gniewny napęd z radosną energią.' },
  { pri: 'anger', sec: 'trust',        id: 'defiance',      name: 'Bunt',          desc: 'Otwarty opór i sprzeciw wobec autorytetów, łączący niezgodę z wiarą we własne racje.' },
  { pri: 'anger', sec: 'fear',         id: 'defensiveness', name: 'Obronność',     desc: 'Zwiększona wrażliwość na atak, skutkująca odruchowym bronieniem swojej pozycji.' },
  { pri: 'anger', sec: 'surprise',     id: 'outrage',       name: 'Oburzenie',     desc: 'Silny gniew wywołany poczuciem rażącej niesprawiedliwości lub złamania ważnych zasad.' },
  { pri: 'anger', sec: 'sadness',      id: 'betrayal',      name: 'Zdrada',        desc: 'Bolesne poczucie oszukania przez kogoś bliskiego, łączące żal po stracie i gniew na sprawcę.' },
  { pri: 'anger', sec: 'disgust',      id: 'hatred',        name: 'Nienawiść',     desc: 'Głęboka, utrwalona wrogość i odraza wobec kogoś lub czegoś, pragnienie zniszczenia.' },

  // ANTICIPATION (Row)
  { pri: 'anticipation', sec: 'anger',        id: 'resolve',     name: 'Determinacja',   desc: 'Niezachwiane postanowienie osiągnięcia celu, mimo napotykanych przeszkód.' },
  { pri: 'anticipation', sec: 'anticipation', id: 'eagerness',   name: 'Zapał',          desc: 'Entuzjastyczne i niecierpliwe wyczekiwanie na to, co ma się wydarzyć.' },
  { pri: 'anticipation', sec: 'joy',          id: 'excitement',  name: 'Ekscytacja',     desc: 'Radosne i pełne energii podniecenie w obliczu nadchodzących wydarzeń.' },
  { pri: 'anticipation', sec: 'joy',          id: 'optimism',    name: 'Optymizm',       desc: 'Pozytywne spojrzenie w przyszłość. Łączy radosne nastawienie z aktywnym przewidywaniem sukcesu.' },
  { pri: 'anticipation', sec: 'fear',         id: 'alertness',   name: 'Czujność',       desc: 'Stan podwyższonej gotowości na potencjalne zagrożenia.' },
  { pri: 'anticipation', sec: 'surprise',     id: 'curiosity',   name: 'Ciekawość',      desc: 'Silne pragnienie poznania i zrozumienia czegoś nowego i nieoczekiwanego.' },
  { pri: 'anticipation', sec: 'sadness',      id: 'foreboding',  name: 'Złe przeczucie', desc: 'Mroczne i smutne przeczucie, że w przyszłości wydarzy się coś złego.' },
  { pri: 'anticipation', sec: 'disgust',      id: 'skepticism',  name: 'Sceptycyzm',     desc: 'Wątpienie w prawdomówność lub wartość nadchodzących informacji, podszyte niechęcią.' },

  // JOY (Row)
  { pri: 'joy', sec: 'anger',        id: 'passion',     name: 'Pasja',       desc: 'Intensywne, gorące zaangażowanie i miłość do czegoś, połączone z zawziętością.' },
  { pri: 'joy', sec: 'anticipation', id: 'thrill',      name: 'Dreszczyk',   desc: 'Krótkotrwałe, niezwykle silne poczucie ekscytacji w oczekiwaniu na przyjemne zdarzenie.' },
  { pri: 'joy', sec: 'joy',          id: 'bliss',       name: 'Błogostan',   desc: 'Stan doskonałego, niczym niezmąconego szczęścia i spokoju.' },
  { pri: 'joy', sec: 'trust',        id: 'love',        name: 'Miłość',      desc: 'Stan głębokiego przywiązania i akceptacji. Poczucie bezpieczeństwa wynikające z radosnego zaufania do drugiej osoby lub zjawiska.' },
  { pri: 'joy', sec: 'fear',         id: 'hope',        name: 'Nadzieja',    desc: 'Pragnienie pozytywnego rozwoju wydarzeń, połączone z lękiem o ich ostateczny wynik.' },
  { pri: 'joy', sec: 'surprise',     id: 'delight',     name: 'Zachwyt',     desc: 'Nagłe, niezwykle radosne uczucie wywołane niespodziewanym pięknem lub zdarzeniem.' },
  { pri: 'joy', sec: 'sadness',      id: 'nostalgia',   name: 'Nostalgia',   desc: 'Sentymentalna i radosno-smutna tęsknota za minionymi, dobrymi czasami.' },
  { pri: 'joy', sec: 'disgust',      id: 'discernment', name: 'Wnikliwość',  desc: 'Radosna satysfakcja z trafnej i krytycznej oceny sytuacji, połączona z odrzuceniem fałszu.' },

  // TRUST (Row)
  { pri: 'trust', sec: 'anger',        id: 'conviction',   name: 'Przekonanie',  desc: 'Silna i niezachwiana pewność co do swoich racji, z gotowością do ich obrony.' },
  { pri: 'trust', sec: 'anticipation', id: 'faith',        name: 'Wiara',        desc: 'Głębokie zaufanie i pewność co do rzeczy, których nie można bezpośrednio udowodnić.' },
  { pri: 'trust', sec: 'joy',          id: 'unity',        name: 'Jedność',      desc: 'Poczucie doskonałej zgody i wspólnoty, wywołujące radosną harmonię.' },
  { pri: 'trust', sec: 'trust',        id: 'loyalty',      name: 'Lojalność',    desc: 'Niezachwiane i trwałe oddanie osobie, grupie lub idei.' },
  { pri: 'trust', sec: 'fear',         id: 'submission',  name: 'Uległość',      desc: 'Stan podporządkowania. Wynika z połączenia zaufania do autorytetu ze strachem przed konsekwencjami buntu.' },
  { pri: 'trust', sec: 'surprise',     id: 'adaptability', name: 'Elastyczność', desc: 'Otwartość i gotowość do dostosowania się do niespodziewanych zmian w oparciu o zaufanie.' },
  { pri: 'trust', sec: 'sadness',      id: 'reassurance',  name: 'Otucha',       desc: 'Uspokojenie i przywrócenie wiary, przynoszące ulgę w smutku.' },
  { pri: 'trust', sec: 'disgust',      id: 'integrity',    name: 'Uczciwość',    desc: 'Spójność moralna i prawość, połączona z awersją do zachowań nieetycznych.' },

  // FEAR (Row)
  { pri: 'fear', sec: 'anger',        id: 'defensiveness', name: 'Obronność',    desc: 'Zwiększona wrażliwość na atak, skutkująca odruchowym bronieniem swojej pozycji.' }, 
  { pri: 'fear', sec: 'anticipation', id: 'vigilance',     name: 'Czuwanie',     desc: 'Stan nieprzerwanej, napiętej obserwacji w poszukiwaniu ewentualnych niebezpieczeństw.' },
  { pri: 'fear', sec: 'joy',          id: 'protective',    name: 'Ochrona',      desc: 'Gotowość do działania w obronie czegoś cennego przed potencjalnym zagrożeniem.' },
  { pri: 'fear', sec: 'trust',        id: 'nervous',       name: 'Nerwowość',    desc: 'Uczucie napięcia i niepokoju w relacjach, gdzie boimy się zawieść zaufanie.' },
  { pri: 'fear', sec: 'fear',         id: 'terror',        name: 'Przerażenie',  desc: 'Skrajna, paraliżująca forma strachu odbierająca zdolność racjonalnego myślenia.' },
  { pri: 'fear', sec: 'surprise',     id: 'awe',           name: 'Trwoga', desc: 'Złożone uczucie paraliżującego respektu i fascynacji wobec czegoś niewytłumaczalnie potężnego i nagłego.' },
  { pri: 'trust', sec: 'surprise',    id: 'admiration',    name: 'Podziw', desc: 'Głęboki szacunek i zachwyt nad cechami lub osiągnięciami, łączący zaufanie z radosnym zaskoczeniem.' },
  { pri: 'fear', sec: 'sadness',      id: 'vulnerability', name: 'Wrażliwość',   desc: 'Bolesna świadomość własnej słabości i podatności na zranienie.' },
  { pri: 'fear', sec: 'disgust',      id: 'abhorrence',    name: 'Odraza',       desc: 'Silny wstręt i przerażenie wobec czegoś moralnie lub fizycznie obrzydliwego.' },

  // SURPRISE (Row)
  { pri: 'surprise', sec: 'anger',        id: 'aggression',  name: 'Agresja',        desc: 'Zaskakująco gwałtowny wybuch wrogości w odpowiedzi na niespodziewany bodziec.' },
  { pri: 'surprise', sec: 'anticipation', id: 'fascination', name: 'Fascynacja',     desc: 'Całkowite pochłonięcie uwagi czymś nowym i intrygującym.' },
  { pri: 'surprise', sec: 'joy',          id: 'wonder',      name: 'Zdumienie',      desc: 'Radosny i pełen podziwu zachwyt nad czymś niesamowitym lub niezrozumiałym.' },
  { pri: 'surprise', sec: 'trust',        id: 'flexibility', name: 'Przystosowanie', desc: 'Nagła zmiana podejścia pod wpływem nowych, zaufanych informacji.' },
  { pri: 'surprise', sec: 'fear',         id: 'alarm',       name: 'Popłoch',        desc: 'Nagłe i ostre uświadomienie sobie niespodziewanego niebezpieczeństwa.' },
  { pri: 'surprise', sec: 'surprise',     id: 'amazement',   name: 'Osłupienie',     desc: 'Całkowite zaskoczenie graniczące z brakiem słów.' },
  { pri: 'surprise', sec: 'sadness',      id: 'disapproval', name: 'Dezaprobata',   desc: 'Poczucie niespełnionych oczekiwań. Połączenie smutku z nagłym zaskoczeniem negatywnym obrotem spraw.' },
  { pri: 'surprise', sec: 'disgust',      id: 'recoil',      name: 'Wzdrygnięcie',   desc: 'Odruchowe cofnięcie się przed czymś niespodziewanie nieprzyjemnym.' },

  // SADNESS (Row)
  { pri: 'sadness', sec: 'anger',        id: 'anguish',      name: 'Udręka',      desc: 'Niezwykle silny ból psychiczny, przeplatany frustracją i gniewem.' },
  { pri: 'sadness', sec: 'anticipation', id: 'yearning',     name: 'Tęsknota',    desc: 'Bolesne i silne pragnienie czegoś lub kogoś, co jest nam niedostępne.' },
  { pri: 'sadness', sec: 'joy',          id: 'melancholy',   name: 'Melancholia', desc: 'Złożony stan łączący smutek ze spokojem i radosnymi wspomnieniami.' },
  { pri: 'sadness', sec: 'trust',        id: 'consolation',  name: 'Ukojenie',    desc: 'Ulga i ukojenie w bólu, płynące ze wsparcia i zaufania do innych.' },
  { pri: 'sadness', sec: 'fear',         id: 'helplessness', name: 'Bezradność',  desc: 'Poczucie całkowitego braku kontroli nad sytuacją, wywołujące lęk i przygnębienie.' },
  { pri: 'sadness', sec: 'surprise',     id: 'regret',       name: 'Żal',         desc: 'Bolesne uświadomienie sobie, że można było postąpić inaczej w przeszłości.' },
  { pri: 'sadness', sec: 'sadness',      id: 'despair',      name: 'Rozpacz',     desc: 'Całkowita utrata nadziei, głębokie i wszechogarniające uczucie beznadziei.' },
  { pri: 'sadness', sec: 'disgust',      id: 'remorse',      name: 'Skrucha',     desc: 'Głęboki żal połączony ze wstrętem do własnych działań z przeszłości, prowadzący do chęci zadośćuczynienia.' },

  // DISGUST (Row)
  { pri: 'disgust', sec: 'anger',        id: 'contempt',    name: 'Pogarda',       desc: 'Mieszanka wstrętu i gniewu, skutkująca poczuciem całkowitej wyższości i lekceważeniem obiektu.' },
  { pri: 'disgust', sec: 'anticipation', id: 'cynical',     name: 'Cynizm',        desc: 'Postawa podważająca wartość dobrych intencji innych, nastawiona na rozczarowanie.' },
  { pri: 'disgust', sec: 'joy',          id: 'ironic',      name: 'Ironia',        desc: 'Dystans i ukryta drwina wobec radosnej sytuacji, wynikające ze zniesmaczenia.' },
  { pri: 'disgust', sec: 'trust',        id: 'aversion',    name: 'Awersja',       desc: 'Silna i utrwalona niechęć do czegoś, nawet mimo wcześniejszego zaufania.' },
  { pri: 'disgust', sec: 'fear',         id: 'horror',      name: 'Zgroza',        desc: 'Skrajne obrzydzenie połączone z paniką i strachem przed czymś potwornym.' },
  { pri: 'disgust', sec: 'surprise',     id: 'repulsion',   name: 'Odrzucenie',    desc: 'Odruch odepchnięcia i ucieczki przed czymś, co budzi szok i niesmak.' },
  { pri: 'disgust', sec: 'sadness',      id: 'loathing',    name: 'Ohyda',         desc: 'Najgłębszy, przenikający smutek połączony z całkowitym obrzydzeniem.' },
  { pri: 'disgust', sec: 'disgust',      id: 'revulsion',   name: 'Zdegustowanie', desc: 'Skrajna, niemal fizyczna odraza wobec wysoce nieprzyjemnego bodźca.' },

  // DODATKOWE EMOCJE Z LISTY UŻYTKOWNIKA
  { pri: 'sadness', sec: 'surprise', id: 'soul_pain', name: 'Ból duszy', desc: 'Niewytłumaczalny ból duszy i nagłe poczucie ogromnej pustki.' },
  { pri: 'fear', sec: 'sadness', id: 'existential_angst', name: 'Lęk egzystencjalny', desc: 'Głęboki niepokój egzystencjalny i obawa o własne miejsce we wszechświecie.' },

  { pri: 'anger', sec: 'sadness', id: 'han', name: 'Gorycz', desc: 'Żal i poczucie niesprawiedliwości połączone z cichą nadzieją (Han).' },
  { pri: 'joy', sec: 'sadness', id: 'mono_no_aware', name: 'Zaduma', desc: 'Zachwyt pięknem świata podszyty smutkiem z powodu jego przemijania (Mono no aware).' },
  { pri: 'anger', sec: 'sadness', id: 'matutolypea', name: 'Zrzędliwość', desc: 'Poranny, bezpodstawny smutek i drażliwość tuż po obudzeniu (Matutolypea).' },
  { pri: 'joy', sec: 'disgust', id: 'schadenfreude1', name: 'Mściwa radość', desc: 'Satysfakcja i radość czerpana z cudzego niepowodzenia (Schadenfreude).' },
  { pri: 'joy', sec: 'trust', id: 'mudita', name: 'Współradość', desc: 'Czysta, pozbawiona zazdrości radość z sukcesu innego człowieka (Mudita).' },
  { pri: 'fear', sec: 'disgust', id: 'verguenza_ajena', name: 'Współwstyd', desc: 'Poczucie wstydu i odrętwienia, gdy ktoś inny kompromituje się publicznie (Vergüenza ajena).' },
  { pri: 'trust', sec: 'anticipation', id: 'amae', name: 'Bezbronność', desc: 'Pragnienie bycia kochanym, rozpieszczanym i całkowicie zależnym od kogoś (Amae).' },
  { pri: 'fear', sec: 'trust', id: 'greng_jai', name: 'Skrępowanie', desc: 'Niechęć do proszenia o pomoc z obawy przed byciem ciężarem (Greng jai).' },
  { pri: 'fear', sec: 'surprise', id: 'tartle', name: 'Zawieszenie', desc: 'Nagła panika, gdy zapomnisz imienia osoby, którą masz przedstawić (Tartle).' },
  { pri: 'fear', sec: 'disgust', id: 'malu', name: 'Onieśmielenie', desc: 'Poczucie niższości i zażenowania przy osobie o wysokim statusie (Malu).' },
  { pri: 'fear', sec: 'anticipation', id: 'l_appel_du_vide', name: 'Zew pustki', desc: 'Przerażający, nagły impuls, by skoczyć, stojąc nad krawędzią urwiska (L\'appel du vide).' },
  { pri: 'joy', sec: 'anger', id: 'ilinx', name: 'Szał', desc: 'Dzikie, chwilowe pragnienie niszczenia przedmiotów dla zabawy (Ilinx).' },
  { pri: 'anger', sec: 'anticipation', id: 'liget', name: 'Ferwor', desc: 'Wybuchowa energia i pasja do działania rodząca się z rywalizacji (Liget).' },
  { pri: 'anticipation', sec: 'joy', id: 'basorexia', name: 'Pożądanie', desc: 'Nagły, obezwładniający impuls fizycznego zbliżenia (Basorexia).' },
  { pri: 'anticipation', sec: 'fear', id: 'iktsuarpok', name: 'Wyczekiwanie', desc: 'Ekscytacja połączona z niepokojem podczas wypatrywania gości (Iktsuarpok).' },
  { pri: 'joy', sec: 'sadness', id: 'ruinenlust', name: 'Dekadencki zachwyt', desc: 'Estetyczny zachwyt połączony z melancholią na widok ruin (Ruinenlust).' },
  { pri: 'fear', sec: 'fear', id: 'torschlusspanik', name: 'Presja', desc: 'Panika, że czas ucieka i zamykają się przed nami życiowe szanse (Torschlusspanik).' },
  { pri: 'fear', sec: 'anticipation', id: 'ringxiety', name: 'Omam', desc: 'Złudzenie, że słyszy się telefon, wywołane ciągłym napięciem (Ringxiety).' },
  { pri: 'fear', sec: 'anticipation', id: 'cyberchondria', name: 'Cyberchondria', desc: 'Lęk o zdrowie nakręcany czytaniem diagnoz w sieci (Cyberchondria).' },
  { pri: 'trust', sec: 'anticipation', id: 'pronoia', name: 'Pronoja', desc: 'Przeświadczenie, że wszechświat potajemnie sprzyja Twojemu szczęściu (Pronoia).' },
  { pri: 'fear', sec: 'disgust', id: 'ambiguphobia', name: 'Niepewność', desc: 'Dyskomfort i opór przed sytuacjami, które nie są czarno-białe (Ambiguphobia).' },
  { pri: 'sadness', sec: 'fear', id: 'heimweh', name: 'Stęsknienie', desc: 'Paraliżująca tęsknota za domem rodzinnym i bezpiecznym miejscem (Heimweh).' },
  { pri: 'sadness', sec: 'sadness', id: 'weltschmerz', name: 'Depresja', desc: 'Boleść świata; bezsilność wobec ogromu zła na Ziemi (Weltschmerz).' },
  { pri: 'trust', sec: 'trust', id: 'gezelligheid', name: 'Przytulność', desc: 'Poczucie ciepła, bezpieczeństwa i bliskości podczas spotkań z przyjaciółmi (Gezelligheid).' },
  { pri: 'trust', sec: 'joy', id: 'abbiocco', name: 'Błogostan', desc: 'Błogi, senny letarg i spowolnienie po zjedzeniu obfitego posiłku (Abbiocco).' },
  { pri: 'trust', sec: 'trust', id: 'hyggelig', name: 'Sielskość', desc: 'Stan głębokiego relaksu, spokoju i doceniania chwili obecnej (Hyggelig).' },
  { pri: 'surprise', sec: 'fear', id: 'depaysement', name: 'Wykorzenienie', desc: 'Dezorientacja połączona z ekscytacją z powodu przebywania w obcym kraju (Dépaysement).' },
  { pri: 'trust', sec: 'anger', id: 'ilunga', name: 'Cierpliwość', desc: 'Gotowość do wybaczenia obrazy, ale absolutny brak litości za trzecim razem (Ilunga).' },
  { pri: 'trust', sec: 'joy', id: 'cafune', name: 'Czułość', desc: 'Czułe, uspokajające przeczesywanie palcami włosów ukochanej osoby (Cafuné).' },
  { pri: 'joy', sec: 'surprise', id: 'tarab', name: 'Ekstaza', desc: 'Stan emocjonalnego uniesienia i transu wywołany głębokim przeżywaniem muzyki (Tarab).' },
  { pri: 'joy', sec: 'disgust', id: 'schadenfreude2', name: 'Satysfakcja', desc: 'Złośliwa uciecha z potknięcia osoby, której nie lubimy (Schadenfreude).' },
  { pri: 'fear', sec: 'anger', id: 'jealousy', name: 'Zawiść', desc: 'Strach przed utratą kogoś na rzecz rywala połączony z gniewem (Jealousy).' },
  { pri: 'sadness', sec: 'disgust', id: 'envy', name: 'Zazdrość', desc: 'Ból, że ktoś posiada coś, czego sami pożądamy (Envy).' },
  { pri: 'joy', sec: 'anger', id: 'gigil', name: 'Rozczulenie', desc: 'Tak skrajny zachwyt nad czymś uroczym, że aż pojawia się chęć uszczypnięcia (Gigil).' },
  { pri: 'sadness', sec: 'anger', id: 'litost', name: 'Żałość', desc: 'Stan udręki wywołany uświadomieniem sobie nędznej sytuacji z chęcią zemsty (Lítost).' },
  { pri: 'sadness', sec: 'anticipation', id: 'sehnsucht', name: 'Tęsknica', desc: 'Ogromna tęsknota za idealnym, nieosiągalnym życiem (Sehnsucht).' },
  { pri: 'anticipation', sec: 'joy', id: 'wanderlust', name: 'Zew wędrówki', desc: 'Przemożna, radosna żądza podróżowania i odkrywania świata (Wanderlust).' },
  { pri: 'sadness', sec: 'anticipation', id: 'fernweh', name: 'Dalekotęsknota', desc: 'Fizyczny ból i tęsknota za dalekim światem, przeciwieństwo tęsknoty za domem (Fernweh).' },
  { pri: 'fear', sec: 'surprise', id: 'agankee', name: 'Trwoga', desc: 'Głębokie, pełne szacunku przerażenie i niepokój w obliczu potęgi natury (Agankee).' },
  { pri: 'sadness', sec: 'anticipation', id: 'brood', name: 'Rozpamiętywanie', desc: 'Ciężkie, ponure obracanie w głowie negatywnych myśli o przeszłości (Brood).' },
  { pri: 'sadness', sec: 'trust', id: 'fago', name: 'Miłosierdzie', desc: 'Unikalna mieszanka współczucia, miłości i smutku wobec kogoś, kto potrzebuje opieki (Fago).' },
  { pri: 'anger', sec: 'surprise', id: 'pizzacato', name: 'Drażliwość', desc: 'Drobna, powtarzająca się irytacja wywołana irytującym dźwiękiem lub zachowaniem (Pizzacato).' },
  { pri: 'sadness', sec: 'trust', id: 'viraag', name: 'Rozłąka', desc: 'Ból i cierpienie wynikające z fizycznego oddalenia od ukochanej osoby (Viraag).' },
  { pri: 'trust', sec: 'joy', id: 'yuan_fen', name: 'Przeznaczenie', desc: 'Głębokie przekonanie, że relacja z drugą osobą była zapisana w gwiazdach (Yuan fen).' },
  { pri: 'joy', sec: 'trust', id: 'kvell', name: 'Duma', desc: 'Ogromna duma i głośna radość z sukcesów własnych dzieci lub bliskich (Kvell).' },
  { pri: 'anticipation', sec: 'anger', id: 'orenda', name: 'Moc', desc: 'Wewnętrzna siła i wiara w to, że można zmienić świat własną wolą (Orenda).' },
  { pri: 'surprise', sec: 'trust', id: 'yugen', name: 'Misterium', desc: 'Głęboki zachwyt nad wszechświatem, którego nie da się ubrać w słowa (Yugen).' },
  { pri: 'anger', sec: 'joy', id: 'chutzpah', name: 'Bezczelność', desc: 'Szokująca, ale i podziwiana odwaga połączona z całkowitym brakiem wstydu (Chutzpah).' },
  { pri: 'joy', sec: 'trust', id: 'gezellig', name: 'Swojskość', desc: 'Atmosfera komfortu towarzyskiego, w której czujesz się w pełni akceptowany (Gezellig).' },
  { pri: 'sadness', sec: 'anger', id: 'kuebiko', name: 'Wycieńczenie', desc: 'Stan kompletnego wyczerpania po doświadczeniu katastrofy lub ciężkiej pracy (Kuebiko).' },
  { pri: 'surprise', sec: 'joy', id: 'goya', name: 'Realizm', desc: 'Chwila, w której fikcja staje się tak realistyczna, że w nią wierzysz całym sobą (Goya).' },

  // PRZYWRÓCONE POJĘCIA JAKO OSOBNE EMOCJE
  { pri: 'anger', sec: 'sadness', id: 'resentment', name: 'Uraza', desc: 'Długotrwały, tłumiony gniew i żal po doznanej krzywdzie.' },
  { pri: 'fear', sec: 'surprise', id: 'embarrassment', name: 'Żenada', desc: 'Poczucie niezręczności i wstydu w kłopotliwej sytuacji.' },
  { pri: 'anticipation', sec: 'joy', id: 'temptation', name: 'Pokusa', desc: 'Silne pragnienie zrobienia czegoś zakazanego lub ryzykownego.' },
  { pri: 'fear', sec: 'sadness', id: 'hypochondria', name: 'Hipochondria', desc: 'Przesadny, nieuzasadniony lęk o własne zdrowie.' },
  { pri: 'trust', sec: 'joy', id: 'trustfulness', name: 'Ufność', desc: 'Głęboka wiara w dobre intencje i szczerość innych ludzi.' },
  { pri: 'joy', sec: 'anger', id: 'boastfulness', name: 'Chełpliwość', desc: 'Aroganckie i przesadne chwalenie się własnymi osiągnięciami.' },
  { pri: 'sadness', sec: 'disgust', id: 'stupor', name: 'Otępienie', desc: 'Stan emocjonalnego znieczulenia i pustki po traumatycznym przeżyciu.' },
  { pri: 'anger', sec: 'disgust', id: 'spite', name: 'Złośliwość', desc: 'Chęć sprawienia komuś przykrości z drobnych, mściwych pobudek.' },

  // PAKIET GŁĘBOKI - NOWE, SZCZEGÓŁOWE EMOCJE
  { pri: 'fear', sec: 'disgust', id: 'paranoia', name: 'Paranoja', desc: 'Irracjonalny, obezwładniający lęk przed otoczeniem i poczucie bycia nieustannie osaczonym.' },
  { pri: 'trust', sec: 'sadness', id: 'empathy', name: 'Empatia', desc: 'Głębokie, instynktowne współodczuwanie bólu i emocji drugiego człowieka.' },
  { pri: 'joy', sec: 'surprise', id: 'euphoria', name: 'Euforia', desc: 'Nagły, niekontrolowany i obezwładniający przypływ absolutnego szczęścia.' },
  { pri: 'sadness', sec: 'anticipation', id: 'apathy', name: 'Apatia', desc: 'Stan drastycznego zobojętnienia, wypalenia chęci do działania i braku jakichkolwiek oczekiwań.' },
  { pri: 'fear', sec: 'sadness', id: 'guilt', name: 'Poczucie winy', desc: 'Ciężar moralny i lęk przed konsekwencjami własnych, błędnych decyzji.' },
  { pri: 'disgust', sec: 'sadness', id: 'shame', name: 'Wstyd', desc: 'Głęboka, destrukcyjna odraza skierowana w stronę samego siebie.' },
  { pri: 'anger', sec: 'anticipation', id: 'aggressiveness', name: 'Agresywność', desc: 'Stan gotowości do ataku. Powstaje z gniewnego oczekiwania na konflikt lub przeszkodę.' },
  { pri: 'joy', sec: 'fear', id: 'relief', name: 'Ulga', desc: 'Błogie uczucie uwolnienia się od długotrwałego napięcia lub widma katastrofy.' },
  { pri: 'disgust', sec: 'anticipation', id: 'boredom', name: 'Nuda', desc: 'Ociężałe zniechęcenie i brak stymulacji w monotonnej rzeczywistości.' },
  { pri: 'sadness', sec: 'disgust', id: 'burnout', name: 'Wypalenie', desc: 'Stan całkowitego wyczerpania emocjonalnego i wygaszenia motywacji.' },
  { pri: 'fear', sec: 'surprise', id: 'hysteria', name: 'Histeria', desc: 'Gwałtowny, niekontrolowany wybuch emocji w reakcji na silny szok i lęk.' },
  { pri: 'joy', sec: 'sadness', id: 'catharsis', name: 'Katharsis', desc: 'Wewnętrzne, duchowe oczyszczenie następujące po wyzwoleniu długo tłumionych emocji.' },

  // OSTATNIE 6 EMOCJI DO PEŁNYCH 150
  { pri: 'surprise', sec: 'sadness', id: 'sonder', name: 'Sonder', desc: 'Poczucie, że każdy przypadkowy przechodzień ma życie tak samo skomplikowane jak Twoje.' },
  { pri: 'anticipation', sec: 'surprise', id: 'curiosity', name: 'Ciekawość', desc: 'Płonąca chęć poznania i eksploracji nieznanego.' },
  { pri: 'joy', sec: 'anger', id: 'triumph', name: 'Triumf', desc: 'Euforyczne poczucie ostatecznego zwycięstwa po długiej i ciężkiej walce.' },
  { pri: 'sadness', sec: 'surprise', id: 'disappointment', name: 'Rozczarowanie', desc: 'Bolesny opad emocji, gdy rzeczywistość nie dorasta do naszych oczekiwań.' },
  { pri: 'sadness', sec: 'trust', id: 'resignation', name: 'Rezygnacja', desc: 'Ciche, pozbawione buntu poddanie się nieuniknionemu losowi.' },
  { pri: 'fear', sec: 'anticipation', id: 'compulsion', name: 'Kompulsja', desc: 'Przemożna, nie dająca się opanować potrzeba wykonania określonej czynności.' },

  // ODPOWIEDNIK SISU
  { pri: 'fear', sec: 'trust', id: 'resilience', name: 'Niezłomność', desc: 'Stoicki hart ducha i upór pozwalający przetrwać w obliczu beznadziejnej sytuacji (odp. Sisu).' },

  // FUNDAMENTALNE EMOCJE PSYCHOLOGICZNE (NOWE)
  { pri: 'anger', sec: 'trust', id: 'dominance', name: 'Dominacja', desc: 'Poczucie władzy, siły i kontroli nad sytuacją, oparte na zaufaniu we własne możliwości.' },
  { pri: 'anticipation', sec: 'trust', id: 'agency', name: 'Sprawczość', desc: 'Głęboka wiara, że to my kierujemy własnym życiem i mamy wpływ na to, co nadejdzie.' },
  { pri: 'joy', sec: 'trust', id: 'gratitude', name: 'Wdzięczność', desc: 'Ciepłe i radosne docenienie tego, co otrzymaliśmy od losu lub innych ludzi.' },
  { pri: 'sadness', sec: 'trust', id: 'compassion', name: 'Współczucie', desc: 'Czułe pochylenie się nad cudzym cierpieniem, wynikające z empatii i zaufania.' },
  { pri: 'fear', sec: 'trust', id: 'humility', name: 'Pokora', desc: 'Zbalansowany szacunek i świadomość własnych ograniczeń w zderzeniu ze światem.' },
  { pri: 'anger', sec: 'anticipation', id: 'vengeance', name: 'Mściwość', desc: 'Zapiekła i destrukcyjna żądza odwetu za doznane w przeszłości krzywdy.' },
  { pri: 'joy', sec: 'trust', id: 'belonging', name: 'Przynależność', desc: 'Radosne i bezpieczne poczucie bycia nieodłączną i ważną częścią grupy.' },
  { pri: 'anger', sec: 'surprise', id: 'audacity', name: 'Zuchwałość', desc: 'Zaskakująca innych, agresywna odwaga w przekraczaniu ustalonych norm i granic.' },
  { pri: 'anticipation', sec: 'joy', id: 'desire', name: 'Pożądanie', desc: 'Silne, radosne pragnienie i fizyczny lub psychiczny pociąg w oczekiwaniu na spełnienie.' },
  { pri: 'fear', sec: 'anger', id: 'courage', name: 'Odwaga', desc: 'Zdolność do podjęcia stanowczej walki mimo odczuwanego strachu przed zagrożeniem.' }
];

export const combinations = matrixData.map(m => ({
  primary: m.pri,
  secondary: m.sec,
  ingredients: [m.pri, m.sec], // Array for backwards compatibility with link rendering
  result: {
    id: m.id,
    name: m.name,
    categoryId: m.pri, // The resulting emotion belongs to the Primary's category
    description: m.desc,
    color: blendColors(baseColor(m.pri), baseColor(m.sec)),
    x: (() => {
      const p = baseCoords[m.pri];
      const s = baseCoords[m.sec];
      // seed from hash of id
      let seed = 0;
      for (let i = 0; i < m.id.length; i++) seed += m.id.charCodeAt(i);
      const jitterX = (pseudoRandom(seed) - 0.5) * 0.25;
      return (p.x + s.x) / 2 + jitterX;
    })(),
    y: (() => {
      const p = baseCoords[m.pri];
      const s = baseCoords[m.sec];
      let seed = 0;
      for (let i = 0; i < m.id.length; i++) seed += m.id.charCodeAt(i);
      const jitterY = (pseudoRandom(seed + 1) - 0.5) * 0.25;
      return (p.y + s.y) / 2 + jitterY;
    })()
  }
}));

// --- DYNAMIC RECIPE GENERATION ---
// Generate recipes for ALL possible pairs based on coordinate proximity
const allEmotionsTempMap = new Map();
baseEmotions.forEach(e => allEmotionsTempMap.set(e.id, { ...e, x: baseCoords[e.id].x, y: baseCoords[e.id].y }));
combinations.forEach(c => {
  if (!allEmotionsTempMap.has(c.result.id)) {
    allEmotionsTempMap.set(c.result.id, c.result);
  }
});
const allEmotionsArray = Array.from(allEmotionsTempMap.values());
const existingKeys = new Set(combinations.map(c => `${c.primary}-${c.secondary}`));
const dynamicCombinations = [];

for (let i = 0; i < allEmotionsArray.length; i++) {
  for (let j = 0; j < allEmotionsArray.length; j++) {
    const A = allEmotionsArray[i];
    const B = allEmotionsArray[j];
    
    // We allow self-combining (e.g. Joy + Joy) if there is a closest emotion, but maybe skip it to avoid clutter
    if (A.id === B.id) continue;

    const key = `${A.id}-${B.id}`;
    if (existingKeys.has(key)) continue;

    const midX = (A.x + B.x) / 2;
    const midY = (A.y + B.y) / 2;
    let closestC = null;
    let minDist = Infinity;
    
    for (const C of allEmotionsArray) {
      if (C.id === A.id || C.id === B.id) continue;
      const dist = Math.hypot(C.x - midX, C.y - midY);
      if (dist < minDist) {
        minDist = dist;
        closestC = C;
      }
    }
    
    // 0.4 threshold ensures we only link things that are reasonably close to the midpoint
    if (closestC && minDist < 0.4) {
      dynamicCombinations.push({
        primary: A.id,
        secondary: B.id,
        ingredients: [A.id, B.id],
        result: closestC,
        isDynamic: true
      });
    }
  }
}

// Append the thousands of dynamically generated recipes to the main array
combinations.push(...dynamicCombinations);


// ============================================================
// API
// ============================================================

// Order does NOT matter: getCombination(left, right)
export const getCombination = (primaryId, secondaryId) => {
  const matches = combinations.filter(c => 
    (c.primary === primaryId && c.secondary === secondaryId) ||
    (c.primary === secondaryId && c.secondary === primaryId)
  );
  // Remove duplicates just in case there are symmetric recipes in the array
  const unique = [];
  const seen = new Set();
  for (const match of matches) {
    if (!seen.has(match.result.id)) {
      seen.add(match.result.id);
      unique.push(match);
    }
  }
  return unique;
};

export const getAllEmotionsMap = () => {
  const map = new Map();
  baseEmotions.forEach(e => map.set(e.id, { ...e, x: baseCoords[e.id].x, y: baseCoords[e.id].y }));
  // Some combinations share an ID (e.g. defensiveness). The last one processed overwrites, which is fine since they are identical in concept.
  combinations.forEach(c => {
    if (!map.has(c.result.id)) {
      map.set(c.result.id, c.result);
    }
  });
  return map;
};

// Start with the 8 primary emotions
export const initialEmotions = [
  'anger', 'anticipation', 'joy', 'trust', 
  'fear', 'surprise', 'sadness', 'disgust'
];
