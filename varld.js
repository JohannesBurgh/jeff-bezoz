/* ============================================================
   VARLD.JS  ·  Institutionen för tillämpad bezozologi
   Hela världen står i den här filen. Ändra, spara, ladda om sidan.
   Färger skrivs som '#rrggbb'. Mått är i meter. Golvet är 16 x 10.
   ============================================================ */
window.BEZOZ_VARLD = {

  titel: ['JEFF', 'BEZOZ'],          // sista bokstaven vickar
  avsandare: 'Institutionen för tillämpad bezozologi, rum 24. Expedieras av Absurdimo',
  kontakt: 'absurdimo@gmail.com',   // hit skickar folk sina egna flippar
  mottagare: 'Hela internet. Ömtåligt. Denna sida upp.',
  underrad: 'Musikvideon om en professor som sa ett namn en gång för mycket på ett möte. Levereras inom 1 till 3 flippar.',
  tavlan: { stort: 'JEFF BEZOZ', smatt: 'Jeff Bezoz' },   // texten på svarta tavlan
  skyltar: { hoger: ['ÖMTÅLIGT'], vanster: ['DENNA', 'SIDA UPP'], raket: ['TILL', 'MÅNEN'] },

  /* ---------- MUSIKVIDEON ----------  youtube: videons id (det som står efter youtu.be/). stampel: liten lapp på rutan, '' tar bort den */
  video: { youtube: '9bng8dEnUOk', stampel: 'ARBETSKOPIA' },

  /* ---------- FLER FLIPPAR ----------  en rad per klipp: { youtube: 'id', rubrik: '...', text: '...', fil: 'flippar/namn.mp4' }
     fil är valfri: finns den får klippet en HÄMTA-knapp. Lägg filen i mappen flippar/ */
  bonus: [
  ],

  staty: { skylt: ['JEFF', 'BEZOZ'] },   // namnskylten på statyns sockel

  /* ---------- LÅTEN ----------
     fil:  ljudfilen. bpm: tempot.
     slag: tidpunkten (sekunder) för varje taktslag. Saknas listan räknar motorn själv från bpm och start. */
  lat: {
    fil: 'lat/jeff_bezoz_gubbe.mp3',
    bpm: 143.6,
    borja_vid: 16.1,         // MUSIK startar låten här (sekunder), precis där basen slår in. 0 = från början
    start: 0.09,
    slag: [0.09,0.46,0.88,1.25,1.65,2.04,2.46,2.88,3.27,3.71,4.13,4.55,4.97,5.39,5.8,6.25,6.64,7.06,7.48,7.92,8.34,8.82,9.27,9.68,10.08,10.49,10.89,11.29,11.7,12.1,12.49,12.86,13.28,13.7,14.12,14.56,14.98,15.35,15.77,16.18,16.6,17.02,17.44,17.86,18.27,18.69,19.11,19.53,19.95,20.36,20.78,21.2,21.62,22.04,22.45,22.87,23.29,23.71,24.13,24.54,24.96,25.38,25.8,26.21,26.63,27.05,27.47,27.89,28.3,28.72,29.14,29.54,29.95,30.37,30.79,31.21,31.65,32.14,32.62,33.09,33.51,33.92,34.34,34.76,35.18,35.6,36.01,36.43,36.85,37.27,37.69,38.1,38.52,38.94,39.36,39.78,40.19,40.61,41.03,41.45,41.87,42.28,42.7,43.12,43.54,43.95,44.37,44.79,45.21,45.63,46.02,46.39,46.79,47.16,47.55,47.93,48.34,48.76,49.18,49.58,49.99,50.41,50.83,51.25,51.66,52.06,52.5,52.92,53.34,53.75,54.17,54.59,55.01,55.43,55.84,56.26,56.68,57.08,57.49,57.91,58.33,58.68,59.05,59.42,59.79,60.21,60.63,61.05,61.46,61.88,62.3,62.72,63.11,63.55,63.95,64.37,64.78,65.2,65.62,66.04,66.46,66.87,67.29,67.71,68.13,68.55,68.96,69.38,69.78,70.19,70.61,71.03,71.45,71.87,72.28,72.7,73.12,73.54,73.96,74.37,74.79,75.21,75.6,76.02,76.44,76.86,77.28,77.69,78.11,78.53,78.95,79.39,79.83,80.3,80.76,81.22,81.64,82.06,82.48,82.89,83.31,83.73,84.15,84.57,84.98,85.4,85.82,86.24,86.63,87.05,87.47,87.89,88.31,88.72,89.14,89.56,89.98,90.37,90.79,91.21,91.63,92.04,92.46,92.88,93.3,93.72,94.13,94.53,94.95,95.36,95.78,96.2,96.62,97.01,97.43,97.85,98.29,98.71,99.13,99.52,99.92,100.4,100.84,101.26,101.68,102.1,102.52,102.96,103.4,103.82,104.23,104.65,105.07,105.49,105.91,106.32,106.74,107.16,107.58,108.0,108.44,108.9,109.37,109.83,110.27,110.69,111.08,111.53,111.94,112.36,112.78,113.2,113.61,114.03,114.43,114.85,115.26,115.68,116.1,116.5,116.91,117.33,117.75,118.17,118.58,119.0,119.42,119.81,120.23,120.65,121.07,121.49,121.91,122.3]
  },

  /* ---------- FLIPPEN ----------
     Rösten som hörs när man trycker FLIPPA, en del per tryck, i tur och ordning.
     mun: hur öppen professorns mun är, 20 värden per sekund (0 till 1). Saknas listan gapar han i takt. */
  flippar: [
    { fil: 'flipp/flipp_1.mp3', langd: 6.35, mun: [.0,.02,.37,.78,.55,.11,.13,.12,.76,.65,.32,.09,.42,.52,.16,.11,.64,.86,.19,.64,.53,.15,.07,.04,.04,.05,.07,.11,.15,.15,.2,.43,1.0,.78,.76,.82,.84,.84,.88,.89,.86,.88,.89,.91,.88,.85,.9,.86,.89,.86,.71,.77,.9,.86,.46,.25,.21,.52,.84,.85,.54,.23,.86,.77,.46,.17,.25,.4,.51,.38,.59,.93,.88,.78,.83,.79,.82,.88,.82,.88,.83,.8,.91,.8,.79,.84,.56,.26,.46,.38,.23,.27,.86,.6,.87,.85,.76,.89,.78,.87,.88,.81,.84,.84,.88,.75,.82,.74,.84,.85,.92,.83,.83,.85,.91,.76,.79,.76,.72,.81,.75,.68,.79,.73,.49,.14,.17,.02] },
    { fil: 'flipp/flipp_2.mp3', langd: 5.9, mun: [.11,.29,.67,.95,.76,.77,.74,.8,.88,.91,.89,.9,.9,.84,.83,.89,.84,.76,.8,.86,.85,.94,.88,.88,.82,.63,.22,.17,.24,.21,.39,.99,.87,.87,.88,.86,.79,.39,.2,.25,.83,.91,.92,.92,.93,.83,.36,.17,.11,.31,.37,.35,.44,.44,.43,.52,.42,.26,.22,.36,.61,.71,.98,.87,.96,.97,.87,.87,.85,.79,.89,.87,.84,.87,.91,.78,.86,.89,.81,.78,.83,.82,.85,.88,.74,.9,.86,.88,.57,.57,.67,.47,.79,.74,.53,.71,.81,.76,.73,.79,.86,.77,.8,.71,.85,.75,.89,.85,.74,.9,.9,.87,.81,.69,.62,.34,.61,.58,.02] },
    { fil: 'flipp/flipp_3.mp3', langd: 4.36, mun: [.09,.3,.7,.5,.31,.51,.5,.59,.82,.61,.68,.31,.54,.52,.46,.37,.32,.3,.25,.32,.22,.31,.34,.39,.42,.38,.46,.58,.69,.89,.66,.74,.7,.86,.88,.74,.84,.59,.11,.06,.36,.66,.48,.41,.55,.43,.54,.61,.67,.55,.59,.55,.55,.52,.39,.42,.43,.37,.39,.42,.49,.52,.72,.53,.56,.55,.4,.65,.69,.75,.54,.63,.52,.42,.59,.56,.52,.62,.57,.45,.48,.54,.19,.17,.37,.13,.04,.0] }
  ],
  musik_under_flipp: 0.3,    // låtens volym medan han skriker (0 till 1)

  /* ---------- PERSONALEN ----------
     dans:  'flipp' (står och skriker), 'floss', 'stel-sen-floss' (stel i 8 takter av 32)
     plats: [x, z] på golvet. pa_bordet: true ställer personen på bordet.
     utseende:
       overdel / byxa / skjorta / slips / skor: färger
       monster: 'tweed' | 'kritstreck' | 'pastell' | 'argyle-vast'
       kavaj: true ger skjortbröst och slips.  kortarm: true ger bara armar.  polo: färg på polokrage
       har:   { typ: 'krans' | 'tunn' | 'lockig-uppsatt' | 'langt-flint' | 'slick', farg }
       skagg: färg (helskägg).  glas: 'tjocka' | 'tunna' | 'runda' | 'stora', glasfarg
       extra: 'bula', 'penna-i-haret', 'glasogonkedja', 'nyckelband', 'penna-bakom-orat',
              'sandaler', 'kortbyxa', 'raknarklocka', 'tandstallning', 'parm', 'mage', 'for-stor-kostym' */
  personal: [
    { namn: 'Professorn', befattning: 'PROFESSOR', bild: 'portratt/professorn.jpg',
      bio: 'Började viska ett namn på tisdagsmötet. Står sedan dess på bordet. Nästa möte är flyttat.',
      stampel: 'FLIPPNIVÅ 11/10',
      dans: 'flipp', plats: [0, 0], pa_bordet: true,
      utseende: { hud: '#e0ad90', overdel: '#5e4c38', monster: 'tweed', kavaj: true, skjorta: '#c9d2dc', slips: '#7a4a32',
        byxa: '#23252c', skor: '#15110e', har: { typ: 'krans', farg: '#e9e6e0' }, skagg: '#e4e1da',
        glas: 'tjocka', glasfarg: '#2a1a14', extra: [] } },

    { namn: 'Kostymmannen', befattning: 'OKLAR BEFATTNING', bild: 'portratt/kostymmannen.jpg',
      bio: 'Står stel i åtta takter. Sedan kommer kartongen och då är han med. Ingen vågar fråga om bulan.',
      stampel: 'STEL TILLS VIDARE',
      dans: 'stel-sen-floss', plats: [-4.2, 2.7],
      utseende: { hud: '#e3ae92', overdel: '#1f2a4a', kavaj: true, skjorta: '#f2f2f2', slips: '#2c4c8c',
        byxa: '#1f2a4a', skor: '#15110e', har: { typ: 'tunn', farg: '#a07f5e' },
        glas: 'tunna', glasfarg: '#b9b9b9', extra: ['bula'] } },

    { namn: 'Birgitta', befattning: 'INSTITUTIONSSEKRETERARE, 54', bild: 'portratt/birgitta.jpg',
      bio: 'Har protokollfört varje skrik. Flossar med pennan kvar i håret och passerkortet på.',
      stampel: 'PÄRMAR: 412',
      dans: 'floss', plats: [-1.5, 3.1],
      utseende: { hud: '#e8b79c', overdel: '#b9c7d9', monster: 'pastell', polo: '#f0e6d0',
        byxa: '#8fa3b8', skor: '#f4f4f4', har: { typ: 'lockig-uppsatt', farg: '#b5552a' },
        glas: 'tunna', glasfarg: '#c9a03a', extra: ['penna-i-haret', 'glasogonkedja', 'nyckelband'] } },

    { namn: 'Leif', befattning: 'ADJUNKT I NATIONALEKONOMI, 58', bild: 'portratt/leif.jpg',
      bio: 'Strumpor i sandalerna, miniräknare på handleden, penna bakom örat. Räknar på flippen i huvudet.',
      stampel: 'MOMS: OKLAR',
      dans: 'floss', plats: [1.5, 3.1],
      utseende: { hud: '#e2ac8e', overdel: '#e9dc9a', kortarm: true, monster: 'argyle-vast', slips: '#6b5a4a',
        byxa: '#7d7a6c', skor: '#6b4226', har: { typ: 'langt-flint', farg: '#8f8272' }, skagg: '#a39a8c',
        glas: 'stora', glasfarg: '#a8a8a8', extra: ['mage', 'sandaler', 'kortbyxa', 'penna-bakom-orat', 'raknarklocka'] } },

    { namn: 'Mattias', befattning: 'MASTERSTUDENT, 23', bild: 'portratt/mattias.jpg',
      bio: 'Självutnämnd forskningsassistent i en kostym han ska växa i. Släpper aldrig pärmen. Inte ens i flossen.',
      stampel: 'HP: 0 AV 120',
      dans: 'floss', plats: [4.2, 2.7],
      utseende: { hud: '#eab9a0', overdel: '#6c6b66', monster: 'kritstreck', kavaj: true, skjorta: '#bfe0cf', slips: '#6e1f2a',
        byxa: '#6c6b66', skor: '#15110e', har: { typ: 'slick', farg: '#2a1c14' },
        glas: 'runda', glasfarg: '#8a6a4a', extra: ['tandstallning', 'parm', 'for-stor-kostym'] } }
  ],

  /* ---------- KAMEROR ----------  p: var kameran står, l: vad den tittar på */
  kameror: [
    { namn: 'HELBILD',      p: [0, 7.5, 17.5],   l: [0, 2.4, 0],        vid: true, upp: 5 },
    { namn: 'PROFESSORN',   p: [0.6, 3.7, 4.9],  l: [0, 2.7, 0],        upp: 0.6 },
    { namn: 'RAKETEN',      p: [0.9, 3.0, 2.9],  l: [6.4, 2.05, -2.2],  upp: 1.3 },
    { namn: 'FLOSSLINJEN',  p: [-6.4, 2.2, 6.6], l: [0.5, 1.4, 2.8],    upp: 1 },
    { namn: 'STATYN',       p: [1.5, 3.1, 3.7],  l: [-2.2, 2.4, -1.6],  upp: 0.6 },   // statyn bakom professorn
    { namn: 'OVANIFRÅN',    p: [0, 13.5, 10.5],  l: [0, 0.6, 0.2],      vid: true, upp: 2 },
    { namn: 'TVÄTTBJÖRNEN', p: [3.2, 2.1, -0.7], l: [4.9, 1.3, -3.1],   upp: 0.4 }    // björnen med raketen bredvid
  ],
  /* ---------- INTROT ----------  låtens första sekunder är flippen: kameran följer professorn och de andra står och tittar */
  intro: { till: 0, kameror: [      // till: 0 = avstängt, eftersom låten nu startar efter flippen
    { p: [0.6, 3.7, 4.9],   l: [0, 2.7, 0],  upp: 0.6 },
    { p: [-2.9, 1.5, 1.9],  l: [0, 2.9, 0],  upp: 0.4 },
    { p: [0.7, 3.3, 2.3],   l: [0, 3.05, 0], upp: 0.3 }
  ] },
  takter_per_kamera: 8,
  takter_helbild_vid_scroll: 16,   // så länge står kameran still i helbild efter att man scrollat
  mobil_hojning_topp: -0.16,       // i mobilen, högst upp på sidan: hur långt ner scenen ligger (under knappen Se musikvideon)
  mobil_hojning: -0.05,            // i mobilen, längre ner på sidan: var scenen ligger mellan texten och knapparna
  mobil_upp_faktor: 0,             // i mobilen: hur mycket av kamerornas upp-värde som används
  mobil_avstand: 0.6,              // i mobilen: hur mycket längre bak kamerorna står (0 = som på datorn)
  nedrakning: 5,
  musik_vid_nedrakning: 0.65,      // låten glider ner till den här volymen under nedräkningen (1 = ingen sänkning)
  kartonger_per_tryck: 2,
  serie_paus: 5,                   // sekunder utan tryck innan nästa tryck räknas som en ny serie (ny LEVERANS)
  chans_stort_drop: 0.15,          // chansen att ett tryck ger ett stort drop (5 till 10 kartonger). Första trycket ger alltid ett             // raketen räknar ner från den här siffran, en siffra varannan takt
  flipp_takter: 16,          // hur länge FLIPPA håller i sig om ingen röstfil finns

  /* ---------- SLÄPPEN ---------- */
  paket: [
    { nr: 'PAKET 01', rubrik: 'Videon', text: 'Mötet. Skriket. Kartongen som skickas fram och tillbaka på beatet. Kontorsstolsbaletten. Uppskjutningen.', stampel: 'LÄNGST UPP' },
    { nr: 'PAKET 02', rubrik: 'Låten', text: 'Tyrolerpolka i 143,6 slag per minut. Tryck MUSIK här nere så dansar hela institutionen i takt.', stampel: 'LEVERERAD' },
    { nr: 'PAKET 03', rubrik: 'Flippen', text: 'Sjutton sekunder ur ett tisdagsmöte som aldrig tog slut. Tryck FLIPPA. Tryck igen, det finns mer.', stampel: 'LEVERERAD' },
    { nr: 'PAKET 04', rubrik: 'Tyrolerutgåvan', text: 'Samma institution, fast med hatt, hängslen och kor. Bergen växer upp ur golvet. Månen har redan sin hatt.', stampel: 'TRYCK TYROLEN' },
    { nr: 'PAKET 05', rubrik: 'Din egen flipp', text: 'Flippen och låten går att hämta här ovanför. Gör en egen musikvideo. Vem som flippar bestämmer du.', stampel: 'HÄMTA OVANFÖR' }
  ],
  byggsats_lank: 'https://github.com/JohannesBurgh/jeff-bezoz/archive/refs/heads/main.zip',         // adressen till zip-filen. Tom rad = ingen nedladdningsknapp
  finstilt: 'Ingen miljardär har medverkat, tillfrågats eller märkt något. Jeff Bezoz stavas med z med flit. Alla personer på institutionen är påhittade, inklusive tvättbjörnen. En produktion av Absurdimo, absurdimo@gmail.com.'
};
