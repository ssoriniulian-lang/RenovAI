RenovAI - pachet pentru instalare ca aplicație Android (PWA)

Acesta este un pachet PWA, nu un APK. Pentru instalare pe Android, fișierele trebuie publicate pe un site HTTPS.

Pașii de publicare gratuită (GitHub Pages):
1. Descarcă și dezarhivează RenovAI_PWA.zip.
2. Creează/folosește un cont GitHub și creează un repository nou (de ex. renovai-app).
3. În repository, încarcă toate fișierele din folder (index.html, manifest.json, service-worker.js, icon.svg).
4. În Settings > Pages, activează publicarea din branch main și folder root.
5. Deschide URL-ul publicat pe telefonul Android, în Chrome.
6. În Chrome, apasă meniul ⋮ și alege „Instalează aplicația” sau „Adaugă la ecranul principal”.

PWA se poate încărca offline după prima accesare, în limitele cache-ului. Acest prototip nu include backend sau salvare cloud.
