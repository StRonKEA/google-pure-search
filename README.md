# Google Pure Search

Google Search userscript with an embedded icon and English/Turkish metadata. Version 1.0.0.

## English

Hides identified AI areas while keeping the All tab, and displays available original titles and snippets in automatically translated results. Existing page elements are hidden rather than deleted. No extra network requests or polling are used by the script.

Install by creating a new script in Tampermonkey or Violentmonkey and pasting the contents of `clean-google-search.user.js`. Replace any earlier copy to avoid duplicate scripts.

The URL rule covers bare and www Google search hosts, including country domains. Google layouts vary: unknown or incomplete translation pairs are left unchanged. Hiding AI content does not stop Google from generating or downloading it.

## Türkçe

Tümü sekmesini koruyarak tanınan AI alanlarını gizler; otomatik çevrilen sonuçlarda mevcut orijinal başlık ve özetleri gösterir. Sayfa öğelerini silmek yerine gizler. Script ek ağ isteği veya sürekli zamanlayıcı kullanmaz.

Tampermonkey veya Violentmonkey içinde yeni bir script oluşturup `clean-google-search.user.js` içeriğini yapıştırın. Önceki kopyayı değiştirin; iki sürümü birlikte çalıştırmayın.

Adres kuralı ülke alan adları dahil Google ana ve www arama adreslerini kapsar. Google arayüzleri değişebilir; eksik veya belirsiz çeviri eşleşmeleri değiştirilmez. AI içeriğinin gizlenmesi, Google tarafından üretilmesini veya indirilmesini durdurmaz.

## Tests / Testler

Run `node --check clean-google-search.user.js` for syntax validation. Run `node tests/server.cjs` and open `http://127.0.0.1:8765/tests/runner.html` for browser fixture tests. These tests execute the script body, not userscript-manager installation or metadata matching. See `tests/verification-report.md` for recorded scope and limitations.
