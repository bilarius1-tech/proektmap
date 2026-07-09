import { getDb } from "@/lib/db/index";

export default async function AnalyticsScripts() {
  let metrikaId = "";
  let webmasterId = "";
  let googleId = "";
  let headerCode = "";
  let footerCode = "";

  try {
    const db = await getDb();
    const s = await db.siteSettings.findUnique({ where: { id: "main" } });
    if (s) {
      metrikaId = s.yandexMetrikaId || "";
      webmasterId = s.yandexWebmasterId || "";
      googleId = s.googleAnalyticsId || "";
      headerCode = s.headerCode || "";
      footerCode = s.footerCode || "";
    }
  } catch {}

  return (
    <>
      {/* Yandex.Metrika */}
      {metrikaId && (
        <>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0];k.async=1;k.src=r;a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(${metrikaId},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});`,
            }}
          />
          <noscript>
            <div>
              <img
                src={`https://mc.yandex.ru/watch/${metrikaId}`}
                style={{ position: "absolute", left: "-9999px" }}
                alt=""
              />
            </div>
          </noscript>
        </>
      )}

      {/* Yandex.Webmaster */}
      {webmasterId && (
        <meta name="yandex-verification" content={webmasterId} />
      )}

      {/* Google Analytics */}
      {googleId && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${googleId}`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${googleId}');`,
            }}
          />
        </>
      )}

      {/* Custom header code */}
      {headerCode && (
        <script dangerouslySetInnerHTML={{ __html: headerCode }} />
      )}
    </>
  );
}

// Also export a footer component for footer codes
export async function AnalyticsFooter() {
  let footerCode = "";
  try {
    const db = await getDb();
    const s = await db.siteSettings.findUnique({ where: { id: "main" } });
    if (s) footerCode = s.footerCode || "";
  } catch {}

  if (!footerCode) return null;
  return <div dangerouslySetInnerHTML={{ __html: footerCode }} />;
}
