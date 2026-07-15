const fs = require('fs');
const filePath = '/Users/kl/blokowe emocje/emotion-app/src/data/emotions.js';
let content = fs.readFileSync(filePath, 'utf-8');

const newData = `
  // DODATKOWE EMOCJE Z LISTY UŻYTKOWNIKA
  { pri: 'sadness', sec: 'surprise', id: 'soul_pain', name: 'Ból duszy', desc: 'Niewytłumaczalny ból duszy i nagłe poczucie ogromnej pustki.' },
  { pri: 'fear', sec: 'anticipation', id: 'existential_angst', name: 'Niepokój egzyst.', desc: 'Głęboki niepokój egzystencjalny i obawa o własne miejsce we wszechświecie.' },

  { pri: 'anger', sec: 'sadness', id: 'han', name: 'Gorycz', desc: 'Żal i poczucie niesprawiedliwości połączone z cichą nadzieją (Han).' },
  { pri: 'joy', sec: 'sadness', id: 'mono_no_aware', name: 'Zaduma', desc: 'Zachwyt pięknem świata podszyty smutkiem z powodu jego przemijania (Mono no aware).' },
  { pri: 'anger', sec: 'sadness', id: 'matutolypea', name: 'Zrzędliwość', desc: 'Poranny, bezpodstawny smutek i drażliwość tuż po obudzeniu (Matutolypea).' },
  { pri: 'joy', sec: 'disgust', id: 'schadenfreude1', name: 'Złośliwość', desc: 'Satysfakcja i radość czerpana z cudzego niepowodzenia (Schadenfreude).' },
  { pri: 'joy', sec: 'trust', id: 'mudita', name: 'Współradość', desc: 'Czysta, pozbawiona zazdrości radość z sukcesu innego człowieka (Mudita).' },
  { pri: 'fear', sec: 'disgust', id: 'verguenza_ajena', name: 'Żenada', desc: 'Poczucie wstydu i odrętwienia, gdy ktoś inny kompromituje się publicznie (Vergüenza ajena).' },
  { pri: 'trust', sec: 'joy', id: 'amae', name: 'Bezbronność', desc: 'Pragnienie bycia kochanym, rozpieszczanym i całkowicie zależnym od kogoś (Amae).' },
  { pri: 'fear', sec: 'trust', id: 'greng_jai', name: 'Skrępowanie', desc: 'Niechęć do proszenia o pomoc z obawy przed byciem ciężarem (Greng jai).' },
  { pri: 'fear', sec: 'surprise', id: 'tartle', name: 'Zawieszenie', desc: 'Nagła panika, gdy zapomnisz imienia osoby, którą masz przedstawić (Tartle).' },
  { pri: 'fear', sec: 'disgust', id: 'malu', name: 'Onieśmielenie', desc: 'Poczucie niższości i zażenowania przy osobie o wysokim statusie (Malu).' },
  { pri: 'fear', sec: 'surprise', id: 'l_appel_du_vide', name: 'Pokusa', desc: 'Przerażający, nagły impuls, by skoczyć, stojąc nad krawędzią urwiska (L\\'appel du vide).' },
  { pri: 'joy', sec: 'anger', id: 'ilinx', name: 'Szał', desc: 'Dzikie, chwilowe pragnienie niszczenia przedmiotów dla zabawy (Ilinx).' },
  { pri: 'anger', sec: 'anticipation', id: 'liget', name: 'Ferwor', desc: 'Wybuchowa energia i pasja do działania rodząca się z rywalizacji (Liget).' },
  { pri: 'anticipation', sec: 'joy', id: 'basorexia', name: 'Pożądanie', desc: 'Nagły, obezwładniający impuls fizycznego zbliżenia (Basorexia).' },
  { pri: 'anticipation', sec: 'fear', id: 'iktsuarpok', name: 'Wyczekiwanie', desc: 'Ekscytacja połączona z niepokojem podczas wypatrywania gości (Iktsuarpok).' },
  { pri: 'joy', sec: 'sadness', id: 'ruinenlust', name: 'Fascynacja', desc: 'Estetyczny zachwyt połączony z melancholią na widok ruin (Ruinenlust).' },
  { pri: 'fear', sec: 'anticipation', id: 'torschlusspanik', name: 'Presja', desc: 'Panika, że czas ucieka i zamykają się przed nami życiowe szanse (Torschlusspanik).' },
  { pri: 'fear', sec: 'anticipation', id: 'ringxiety', name: 'Omam', desc: 'Złudzenie, że słyszy się telefon, wywołane ciągłym napięciem (Ringxiety).' },
  { pri: 'fear', sec: 'anticipation', id: 'cyberchondria', name: 'Hipochondria', desc: 'Lęk o zdrowie nakręcany czytaniem diagnoz w sieci (Cyberchondria).' },
  { pri: 'trust', sec: 'joy', id: 'pronoia', name: 'Ufność', desc: 'Przeświadczenie, że wszechświat potajemnie sprzyja Twojemu szczęściu (Pronoia).' },
  { pri: 'fear', sec: 'disgust', id: 'ambiguphobia', name: 'Niepewność', desc: 'Dyskomfort i opór przed sytuacjami, które nie są czarno-białe (Ambiguphobia).' },
  { pri: 'sadness', sec: 'fear', id: 'heimweh', name: 'Stęsknienie', desc: 'Paraliżująca tęsknota za domem rodzinnym i bezpiecznym miejscem (Heimweh).' },
  { pri: 'sadness', sec: 'anger', id: 'weltschmerz', name: 'Depresja', desc: 'Boleść świata; bezsilność wobec ogromu zła na Ziemi (Weltschmerz).' },
  { pri: 'joy', sec: 'trust', id: 'gezelligheid', name: 'Przytulność', desc: 'Poczucie ciepła, bezpieczeństwa i bliskości podczas spotkań z przyjaciółmi (Gezelligheid).' },
  { pri: 'joy', sec: 'sadness', id: 'abbiocco', name: 'Otępienie', desc: 'Błogi, senny letarg i spowolnienie po zjedzeniu obfitego posiłku (Abbiocco).' },
  { pri: 'joy', sec: 'trust', id: 'hyggelig', name: 'Sielskość', desc: 'Stan głębokiego relaksu, spokoju i doceniania chwili obecnej (Hyggelig).' },
  { pri: 'surprise', sec: 'fear', id: 'depaysement', name: 'Wykorzenienie', desc: 'Dezorientacja połączona z ekscytacją z powodu przebywania w obcym kraju (Dépaysement).' },
  { pri: 'trust', sec: 'anger', id: 'ilunga', name: 'Cierpliwość', desc: 'Gotowość do wybaczenia obrazy, ale absolutny brak litości za trzecim razem (Ilunga).' },
  { pri: 'trust', sec: 'joy', id: 'cafune', name: 'Czułość', desc: 'Czułe, uspokajające przeczesywanie palcami włosów ukochanej osoby (Cafuné).' },
  { pri: 'joy', sec: 'surprise', id: 'tarab', name: 'Ekstaza', desc: 'Stan emocjonalnego uniesienia i transu wywołany głębokim przeżywaniem muzyki (Tarab).' },
  { pri: 'joy', sec: 'disgust', id: 'schadenfreude2', name: 'Satysfakcja', desc: 'Złośliwa uciecha z potknięcia osoby, której nie lubimy (Schadenfreude).' },
  { pri: 'sadness', sec: 'anger', id: 'jealousy', name: 'Zawiść', desc: 'Strach przed utratą kogoś na rzecz rywala połączony z gniewem (Jealousy).' },
  { pri: 'sadness', sec: 'disgust', id: 'envy', name: 'Zazdrość', desc: 'Ból, że ktoś posiada coś, czego sami pożądamy (Envy).' },
  { pri: 'joy', sec: 'anger', id: 'gigil', name: 'Rozczulenie', desc: 'Tak skrajny zachwyt nad czymś uroczym, że aż pojawia się chęć uszczypnięcia (Gigil).' },
  { pri: 'sadness', sec: 'anger', id: 'litost', name: 'Żałość', desc: 'Stan udręki wywołany uświadomieniem sobie nędznej sytuacji z chęcią zemsty (Lítost).' },
  { pri: 'sadness', sec: 'anticipation', id: 'sehnsucht', name: 'Tęsknica', desc: 'Ogromna tęsknota za idealnym, nieosiągalnym życiem (Sehnsucht).' },
  { pri: 'anticipation', sec: 'joy', id: 'wanderlust', name: 'Włóczęga', desc: 'Przemożna, radosna żądza podróżowania i odkrywania świata (Wanderlust).' },
  { pri: 'sadness', sec: 'anticipation', id: 'fernweh', name: 'Dalekotęsknota', desc: 'Fizyczny ból i tęsknota za dalekim światem, przeciwieństwo tęsknoty za domem (Fernweh).' },
  { pri: 'fear', sec: 'surprise', id: 'agankee', name: 'Trwoga', desc: 'Głębokie, pełne szacunku przerażenie i niepokój w obliczu potęgi natury (Agankee).' },
  { pri: 'sadness', sec: 'anticipation', id: 'brood', name: 'Rozpamiętywanie', desc: 'Ciężkie, ponure obracanie w głowie negatywnych myśli o przeszłości (Brood).' },
  { pri: 'sadness', sec: 'trust', id: 'fago', name: 'Miłosierdzie', desc: 'Unikalna mieszanka współczucia, miłości i smutku wobec kogoś, kto potrzebuje opieki (Fago).' },
  { pri: 'anger', sec: 'surprise', id: 'pizzacato', name: 'Drażliwość', desc: 'Drobna, powtarzająca się irytacja wywołana irytującym dźwiękiem lub zachowaniem (Pizzacato).' },
  { pri: 'sadness', sec: 'trust', id: 'viraag', name: 'Rozłąka', desc: 'Ból i cierpienie wynikające z fizycznego oddalenia od ukochanej osoby (Viraag).' },
  { pri: 'trust', sec: 'joy', id: 'yuan_fen', name: 'Przeznaczenie', desc: 'Głębokie przekonanie, że relacja z drugą osobą była zapisana w gwiazdach (Yuan fen).' },
  { pri: 'joy', sec: 'trust', id: 'kvell', name: 'Chełpliwość', desc: 'Ogromna duma i głośna radość z sukcesów własnych dzieci lub bliskich (Kvell).' },
  { pri: 'anticipation', sec: 'anger', id: 'orenda', name: 'Moc', desc: 'Wewnętrzna siła i wiara w to, że można zmienić świat własną wolą (Orenda).' },
  { pri: 'surprise', sec: 'trust', id: 'yugen', name: 'Misterium', desc: 'Głęboki zachwyt nad wszechświatem, którego nie da się ubrać w słowa (Yugen).' },
  { pri: 'anger', sec: 'joy', id: 'chutzpah', name: 'Bezczelność', desc: 'Szokująca, ale i podziwiana odwaga połączona z całkowitym brakiem wstydu (Chutzpah).' },
  { pri: 'joy', sec: 'trust', id: 'gezellig', name: 'Swojskość', desc: 'Atmosfera komfortu towarzyskiego, w której czujesz się w pełni akceptowany (Gezellig).' },
  { pri: 'sadness', sec: 'anger', id: 'kuebiko', name: 'Wycieńczenie', desc: 'Stan kompletnego wyczerpania po doświadczeniu katastrofy lub ciężkiej pracy (Kuebiko).' },
  { pri: 'surprise', sec: 'joy', id: 'goya', name: 'Realizm', desc: 'Chwila, w której fikcja staje się tak realistyczna, że w nią wierzysz całym sobą (Goya).' },
];
`;

content = content.replace('];\n\nexport const combinations', newData + '\nexport const combinations');
fs.writeFileSync(filePath, content);
console.log('Added ' + (newData.match(/\{/g) || []).length + ' emotions!');
