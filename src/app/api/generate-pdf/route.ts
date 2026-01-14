import { NextRequest, NextResponse } from 'next/server';

// Dynamic import to handle different environments
const isDev = process.env.NODE_ENV !== 'production';

/**
 * PDF Generation API Route
 * 
 * PAGINATION LOGIC:
 * The tiptap-pagination-plus extension uses visual decorations (not HTML nodes)
 * to simulate page breaks. The editor.getHTML() returns continuous content.
 * 
 * To match page breaks exactly:
 * - We set PDF page height to match the editor's pageHeight (1060px at 96 DPI)
 * - We apply the same margins (30px top, 50px bottom, 70px left/right)
 * - Puppeteer's natural page breaks will then occur at the same positions
 * 
 * Calculation:
 * - Editor pageHeight: 1060px (at 96 DPI = 11.04" ≈ Letter height)
 * - Editor content area: 1060 - 30 (top) - 50 (bottom) = 980px
 * - PDF page: Letter size (8.5" x 11") with matching margins
 */
export async function POST(request: NextRequest) {
  try {
    const { html } = await request.json();

    if (!html) {
      return NextResponse.json(
        { error: 'HTML content is required' },
        { status: 400 }
      );
    }

    let browser;
    
    if (isDev) {
      const puppeteer = await import('puppeteer');
      browser = await puppeteer.default.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    } else {
      const puppeteerCore = await import('puppeteer-core');
      const { default: chromium } = await import('@sparticuz/chromium');
      
      const executablePath = process.env.CHROME_EXECUTABLE_PATH 
        || await chromium.executablePath();
        
      browser = await puppeteerCore.default.launch({
        args: chromium.args,
        // defaultViewport: chromium.defaultViewport,
        executablePath,
        headless: (chromium as any).headless,
      });
    }

    const page = await browser.newPage();

    // Set viewport to match editor exactly
    await page.setViewport({
      width: 818,
      height: 1060,
      deviceScaleFactor: 1,
    });

    // Create HTML with exact editor styles and page-break-friendly layout
    const fullHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Load Inter font -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    <style>
      /* ========================================
         BASE RESET
         ======================================== */
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      
      html, body {
        width: 100%;
        background: white;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        -webkit-font-smoothing: antialiased;
      }

      /* ========================================
         BODY - Match .ProseMirror exactly
         ======================================== */
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 24px;
        font-weight: 400;
        line-height: 40px;
        color: rgb(54, 65, 83);
        background: white;
      }

      /* ========================================
         CONTENT WRAPPER - Match Editor Page Layout
         
         PaginationPlus config:
         - pageWidth: 818px
         - pageHeight: 1060px (content area)
         - marginTop: 30px
         - marginBottom: 50px
         - marginLeft: 70px
         - marginRight: 70px
         
         Content area = 1060 - 30 - 50 = 980px
         ======================================== */
      .content-wrapper {
        width: 100%;
        margin: 0 auto;
        background: white;
      }

      /* ========================================
         HEADINGS - Exact computed values
         ======================================== */
      h1 {
        font-family: 'Inter', sans-serif;
        font-size: 60px;
        font-weight: 800;
        line-height: 64px;
        color: rgb(16, 24, 40);
        margin-top: 0;
        margin-bottom: 48px;
      }
      
      h2 {
        font-family: 'Inter', sans-serif;
        font-size: 48px;
        font-weight: 700;
        line-height: 52px;
        color: rgb(16, 24, 40);
        margin-top: 72px;
        margin-bottom: 40px;
      }
      
      h3 {
        font-family: 'Inter', sans-serif;
        font-size: 36px;
        font-weight: 600;
        line-height: 40px;
        color: rgb(16, 24, 40);
        margin-top: 56px;
        margin-bottom: 32px;
      }
      
      h4 {
        font-family: 'Inter', sans-serif;
        font-size: 28px;
        font-weight: 600;
        line-height: 36px;
        color: rgb(16, 24, 40);
        margin-top: 40px;
        margin-bottom: 24px;
      }

      h1:first-child,
      h2:first-child,
      h3:first-child,
      h4:first-child {
        margin-top: 0;
      }

      /* ========================================
         PARAGRAPHS - Exact computed values
         ======================================== */
      p {
        font-family: 'Inter', sans-serif;
        font-size: 24px;
        font-weight: 400;
        line-height: 40px;
        color: rgb(54, 65, 83);
        margin-top: 0;
        margin-bottom: 32px;
        
        /* Prevent orphans/widows for better page breaks */
        orphans: 3;
        widows: 3;
      }
      
      p:last-child {
        margin-bottom: 0;
      }

      /* ========================================
         STRONG/BOLD - Exact computed values
         ======================================== */
      strong, b {
        font-weight: 600;
        color: rgb(16, 24, 40);
      }

      em, i {
        font-style: italic;
      }

      u {
        text-decoration: underline;
      }

      /* ========================================
         LISTS
         ======================================== */
      ul, ol {
        font-family: 'Inter', sans-serif;
        font-size: 24px;
        line-height: 40px;
        color: rgb(54, 65, 83);
        margin-top: 0;
        margin-bottom: 32px;
        padding-left: 32px;
      }
      
      ul { list-style-type: disc; }
      ol { list-style-type: decimal; }
      
      li {
        margin-top: 8px;
        margin-bottom: 8px;
        line-height: 40px;
      }
      
      li:first-child { margin-top: 0; }
      
      li > p {
        margin: 0;
        display: inline;
      }

      ul ul, ol ul { list-style-type: circle; margin: 8px 0; }
      ul ul ul, ol ul ul { list-style-type: square; }

      /* ========================================
         BLOCKQUOTES
         ======================================== */
      blockquote {
        border-left: 4px solid rgb(229, 231, 235);
        padding-left: 24px;
        margin: 32px 0;
        font-style: italic;
        color: rgb(107, 114, 128);
      }

      /* ========================================
         CODE
         ======================================== */
      code {
        font-family: monospace;
        font-size: 21px;
        background-color: rgb(243, 244, 246);
        padding: 2px 6px;
        border-radius: 4px;
      }
      
      pre {
        font-family: monospace;
        font-size: 21px;
        background-color: rgb(31, 41, 55);
        color: rgb(229, 231, 235);
        padding: 24px;
        border-radius: 8px;
        overflow-x: auto;
        margin: 32px 0;
      }
      
      pre code {
        background: transparent;
        padding: 0;
        color: inherit;
      }

      /* ========================================
         TABLES
         ======================================== */
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 32px 0;
        font-size: 24px;
        table-layout: fixed;
      }
      
      th, td {
        border: 1px solid #ced4da;
        padding: 12px 16px;
        text-align: left;
        vertical-align: top;
        position: relative;
      }
      
      th {
        background-color: #f1f3f5;
        font-weight: 600;
        color: rgb(16, 24, 40);
      }

      /* ========================================
         HORIZONTAL RULE
         ======================================== */
      hr {
        border: none;
        border-top: 1px solid rgb(229, 231, 235);
        margin: 48px 0;
      }

      /* ========================================
         TEXT ALIGNMENT
         ======================================== */
      [style*="text-align: left"] { text-align: left; }
      [style*="text-align: center"] { text-align: center; }
      [style*="text-align: right"] { text-align: right; }
      [style*="text-align: justify"] { text-align: justify; }

      /* ========================================
         HIDE PAGINATION ARTIFACTS
         ======================================== */
      .rm-pagination-gap,
      .tiptap-page-break-background,
      .rm-page-number,
      .rm-page-header,
      .rm-page-footer,
      .rm-pages-wrapper,
      [data-page-break],
      [data-rm-pagination] {
        display: none !important;
      }

      /* ========================================
         PRINT / PAGE BREAK CONTROL
         ======================================== */
      @page {
        size: 8.5in 11in;
        margin: 30px 70px 50px 70px;
      }
      
      @media print {
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        /* Avoid breaking inside elements */
        h1, h2, h3, h4, h5, h6 {
          page-break-after: avoid;
          break-after: avoid;
        }
        
        p, li, blockquote {
          page-break-inside: avoid;
          break-inside: avoid;
        }
        
        /* Keep headings with following content */
        h1, h2, h3, h4 {
          page-break-after: avoid;
        }
      }
    </style>
  </head>
  <body>
    <div class="content-wrapper">
      ${html}
    </div>
  </body>
</html>`;

    await page.setContent(fullHtml, {
      waitUntil: 'networkidle0',
    });

    // Wait for Inter font to load
    await page.evaluateHandle('document.fonts.ready');

    // Generate PDF with US Letter dimensions
    // Using exact page margins that match the editor
    const pdfBuffer = await page.pdf({
      format: 'Letter', // 8.5" x 11"
      printBackground: true,
      preferCSSPageSize: true, // Respect @page CSS
    });

    await browser.close();

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="document.pdf"',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: String(error) },
      { status: 500 }
    );
  }
}
