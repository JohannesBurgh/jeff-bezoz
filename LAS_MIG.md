# Byggsatsen: Institutionen för tillämpad bezozologi

Version 0.2, 14 november 2026

Det här är hela Jeff Bezoz-världen som en mapp. Öppna `index.html` i en webbläsare så startar institutionen. Inget behöver installeras och det fungerar utan internet (bara typsnitten hämtas från nätet).

## Vad som ligger i mappen

| Fil | Vad den gör |
|---|---|
| `index.html` | Sidan: rubriker, knappar och utseende |
| `varld.js` | Världen som text: personal, kläder, texter, kameror, låt |
| `motor.js` | Bygger rummet och dockorna, sköter dansstegen |
| `three.min.js` | 3D-biblioteket Three.js (r128). Rör inte |
| `lat/` | Låten |
| `flipp/` | Professorns röst, tre delar som spelas i tur och ordning när man trycker FLIPPA |
| `portratt/` | Passfoton till personalkorten |
| `material/` | Flippljudet, helt och i tre delar |

## Byt eller lägg till en person

Öppna `varld.js` i en textredigerare och leta upp listan `personal`. Varje person är ett stycke mellan `{` och `}`. Kopiera ett stycke, klistra in det efter ett annat, ändra namn, plats och kläder, spara och ladda om sidan.

- `plats: [x, z]` är var personen står. Golvet går från -8 till 8 i sidled och -5 till 5 i djupled. Bordet står i mitten.
- `dans` väljer steg: `flipp`, `floss` eller `stel-sen-floss`.
- `utseende` beskrivs med ord. Alla ord som finns står överst i listan i `varld.js`.
- `bild` är passfotot på kortet. Lägg en kvadratisk bild i `portratt/`. Utan bild visas kortet ändå.

## Byt låt

Lägg ljudfilen i `lat/` och ändra `fil` och `bpm` under `lat` i `varld.js`. Ta bort raden `slag` så räknar motorn takten själv från `bpm` och `start` (sekunden där första slaget kommer).

## Byt flippen

Lägg egna ljudfiler i `flipp/` och peka ut dem under `flippar` i `varld.js`. Skriv in längden i sekunder. Ta bort raden `mun` så gapar professorn i takt i stället för efter rösten.

## Starta en egen institution

Ändra `titel`, `avsandare`, `tavlan` och `skyltar` i `varld.js`, byt personalen och låten. Då är det en ny arbetsplats i samma kartong.

## Det som kräver kod

Det här ligger i `motor.js` och är inte flyttat till `varld.js` ännu:

- Rummet och möblerna (bord, tavla, overhead, lampa)
- Tvättbjörnarna, raketen, månen och alperna
- Nya dansteg. De läggs till under `DANS` och får sedan användas som `dans: 'namnet'` i `varld.js`
- Nya frisyrer, mönster och tillbehör i dockbygget

## Husregler

- Jeff Bezoz stavas med z.
- Ingen verklig person avbildas. Institutionens personal är påhittad.
- Tramsigare än livet, inte elakare.

## Inte bestämt än

Licensen. Innan mappen släpps till andra behöver det stå här vad man får göra med låten, karaktärerna och koden.
