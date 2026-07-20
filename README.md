# OtelKirala

Türkiye genelinde otel arama, karşılaştırma ve rezervasyon için Next.js 16 + MongoDB tabanlı bir web uygulaması. Site içeriği (oteller, bölgeler, yorumlar) `/admin` altındaki yönetici panelinden düzenlenir; arayüz Türkçe ve İngilizce (`/tr`, `/en`) olarak sunulur.

## MongoDB ve Admin Paneli Kurulumu

Site verileri (oteller, bölgeler, yorumlar) MongoDB'de tutulur ve `/admin` altındaki yönetici panelinden düzenlenir.

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)'ta ücretsiz bir cluster oluşturun (veya kendi MongoDB sunucunuzu kullanın).
2. "Connect > Drivers" adımından connection string'i alın.
3. `.env.example` dosyasını `.env.local` olarak kopyalayıp aşağıdaki değerleri doldurun:
   - `MONGODB_URI`: Atlas connection string'iniz.
   - `ADMIN_USERNAME` / `ADMIN_PASSWORD`: Admin paneline giriş bilgileri.
   - `SESSION_SECRET`: `openssl rand -base64 32` komutuyla üretilen rastgele bir anahtar.
4. `npm run dev` ile sunucuyu başlatın, `http://localhost:3000/admin/login` adresinden giriş yapın.
5. Veritabanı boşsa panel ana sayfasında çıkan "Örnek Verileri Yükle" butonuyla başlangıç verilerini ekleyebilirsiniz.

`MONGODB_URI` tanımlı değilse veya bağlantı kurulamazsa, genel site örnek (statik) verilerle çalışmaya devam eder; admin panelindeki sayfalar ise bağlantı hatası uyarısı gösterir.

## Geliştirme

```bash
npm install        # bağımlılıkları kur
npm run dev        # geliştirme sunucusu (yerel ağ IP'sini de yazdırır)
npm run build      # üretim derlemesi
npm run start      # derlenmiş uygulamayı çalıştır
npm run lint       # ESLint
```

Geliştirme sunucusu başladıktan sonra tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın. Ana sayfayı düzenlemek için `src/app/[lang]/page.tsx` dosyasından başlayabilirsiniz; kaydettikçe sayfa otomatik güncellenir.
