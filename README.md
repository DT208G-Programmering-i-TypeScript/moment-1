# Kurshantering i TypeScript

Laboration 1 i DT208G. Webbplatsen visar kurser och låter användaren lägga till, redigera och radera dem. Kurslistan sparas i localStorage och läses in igen när sidan öppnas.

## Publicerad webbplats

https://mom-1-courses-list.netlify.app/

## Så fungerar lösningen

`CourseInfo` beskriver en kurs med kurskod, namn, progression och länk till kursplanen. Progressionen är begränsad till A, B eller C.

`CourseManager` lagrar kurserna i en Map och ansvarar för att läsa och skriva till localStorage. `UIManager` hanterar formuläret, kontrollerar inmatningen och uppdaterar kurslistan i DOM.

En kurskod får inte användas av två kurser. Kontrollen bortser från stora och små bokstäver. Vid redigering kan den befintliga kurskoden behållas. När en kurs raderas uppdateras både listan och localStorage.

## Köra lokalt

Kompilera TypeScript från projektmappen med `tsc -p tsconfig.json`. Öppna sedan `index.html` via en lokal webbserver. Kompilerad JavaScript finns också i `dist/app.js`.

## Filer

- `src/app.ts` innehåller interface, kurshantering och gränssnittets logik.
- `src/style.css` innehåller sidans stilmall.
- `index.html` innehåller formuläret och behållaren för kurslistan.
- `tsconfig.json` anger bland annat strikt typkontroll och att JavaScript sparas i `dist`.
