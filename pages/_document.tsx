import React from 'react';
import Document, {Head, Html, Main, NextScript} from 'next/document';
import Script from 'next/script';

class AppDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <Script
            strategy="beforeInteractive"
            src="https://www.googletagmanager.com/gtag/js?id=G-P54L18DJYN"
          />

          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
   window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-P54L18DJYN');
`
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default AppDocument;
