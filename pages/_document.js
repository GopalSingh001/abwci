import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
        <link rel="icon" href="/abwci.ico" />
        <link rel="shortcut icon" href="/abwci.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/abwci.ico" />
        <meta name="author" content="Chittaranjan - https://github.com/chittaranjans" />
        <meta name="developer" content="Chittaranjan" />
      </Head>
      <body>
        <div
          style={{ display: 'none', visibility: 'hidden' }}
          aria-hidden="true"
        >
          ============================================
          Developed by Chittaranjan
          GitHub: https://github.com/chittaranjans
          ============================================
        </div>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
