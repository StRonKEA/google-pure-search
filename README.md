# Google Pure Search — Sade Arama

**A cleaner Google Search, with original result text.**  
**Orijinal sonuç metinleriyle daha sade Google araması.**

Version / Sürüm: **1.0.0**

[Install userscript / Scripti yükle](https://raw.githubusercontent.com/StRonKEA/google-pure-search/main/clean-google-search.user.js)

## Türkçe

Google Pure Search, Google aramasında Tümü sekmesini koruyarak tanınan AI alanlarını gizleyen ve otomatik çevrilen sonuçların sayfada bulunan orijinal başlık ve özetlerini gösteren bir userscripttir.

### Özellikler

- AI Modu bağlantılarını ve tanınan AI özeti alanlarını gizler.
- Web sekmesine yönlendirme yapmaz; mevcut arama adresini değiştirmez.
- Uygun orijinal/çeviri eşleşmesi bulunduğunda orijinal başlığı ve özeti gösterir.
- Film kartlarını, oyuncu listelerini, bilgi panellerini ve normal sonuçları korumayı hedefleyen sınırlı seçiciler kullanır.
- Sayfa öğelerini silmez; hedeflenen öğelerin görünürlüğünü değiştirir.
- Ülke alan adları dahil Google ana ve www arama adreslerini kapsar.

### Kurulum

1. Tarayıcınızda Tampermonkey veya Violentmonkey gibi bir userscript yöneticisi bulunmalıdır.
2. Üstteki **Scripti yükle** bağlantısını açın ve yöneticinizde kurulumu onaylayın.
3. Google arama sayfasını yenileyin. Önceki kopyayı değiştirin; iki sürümü birlikte çalıştırmayın.

Kurulum ekranı açılmazsa [script dosyasını](clean-google-search.user.js) kopyalayıp yöneticinizde yeni bir script olarak kaydedin.

### Performans ve sınırlar

Script ek ağ isteği, otomatik tıklama veya sürekli zamanlayıcı kullanmaz. İlgili sayfa değişikliklerini izler ve işlemleri toplu yürütür. Bu, her cihaz ve sayfada sıfır gecikme garantisi değildir.

Google arayüzü değişebilir. Orijinal metin sayfada yoksa veya eşleşme belirsizse sonuç değiştirilmez. AI alanlarını gizlemek, Google'ın bunları üretmesini veya indirmesini engellemez. Bir sorunun içindeki tanınan AI yanıtı gizlendiğinde soru daha az yanıt içeriğiyle kalabilir.

Önceki doğrulamalar kontrollü tarayıcı senaryolarını ve bazı canlı Google sayfalarını kapsar; tüm Google düzenleri veya userscript yöneticilerindeki kurulum davranışı için garanti değildir.

## English

Google Pure Search is a userscript that hides identified AI areas while keeping Google's All search tab, and displays original titles and snippets already present in automatically translated results.

### Features

- Hides AI Mode links and recognized AI Overview areas.
- Does not redirect to the Web tab or rewrite the search address.
- Restores original titles and snippets when an unambiguous translated/original pair is available.
- Uses targeted selectors intended to preserve movie cards, cast lists, knowledge panels and ordinary results.
- Changes visibility instead of deleting page elements.
- Covers bare and www Google search hosts, including country domains.

### Installation

1. Use a userscript manager such as Tampermonkey or Violentmonkey.
2. Open **Install userscript** above and confirm installation in your manager.
3. Refresh Google Search. Replace older copies; do not run multiple versions together.

If the installation screen does not open, copy the [script file](clean-google-search.user.js) into a new script in your manager.

### Performance and limitations

The script makes no extra network requests, performs no automatic clicks and uses no continuous timer. It observes relevant page changes and batches processing. This does not guarantee zero latency on every device or page.

Google layouts can change. Missing or ambiguous original text remains untouched. Hiding AI content does not block its generation or download by Google. Hiding an identified AI answer inside a question can leave that question with less answer content.

Previous checks covered controlled browser scenarios and selected live Google pages, not every Google layout or userscript-manager installation behavior.

## Feedback / Geri bildirim

[Report an issue / Sorun bildir](https://github.com/StRonKEA/google-pure-search/issues)

Include the search query, interface language, browser and userscript manager, plus the expected and observed behavior. Remove personal information from screenshots.

Arama sorgusunu, arayüz dilini, tarayıcıyı ve script yöneticisini; beklenen ve görülen davranışla birlikte belirtin. Ekran görüntülerinden kişisel bilgileri çıkarın.

**Keywords / Anahtar kelimeler:** userscript, google-search, tampermonkey, violentmonkey, ai-overview, translation.

Independent project; not affiliated with Google. / Google ile bağlantısı olmayan bağımsız bir projedir.
