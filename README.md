# OpenSphere Tiptap Document Editor

A production-ready rich text editor built with **Next.js** and **Tiptap**, featuring real-time "Print View" pagination, table support, and pixel-perfect PDF export.

## 🚀 Overview

This project was built to solve a core challenge for legal professionals: **Drafting documents with certainty.** Unlike standard web editors that treat text as a continuous scroll, this editor visualizes **US Letter (8.5" x 11")** page boundaries in real-time. It ensures that the specific clause, signature, or table row you see on Page 1 is exactly where it will appear when submitted to USCIS.

### Key Features
* **📄 Real-Time Pagination:** Visual page breaks update instantly as you type.
* **🖨️ 1:1 PDF Export:** Server-side generation (Puppeteer) guarantees the downloaded PDF matches the editor exactly, pixel-for-pixel.
* **📊 Advanced Tables:** Insert tables with row/column controls that correctly split across pages.
* **🎨 Rich Formatting:** Full support for Fonts, Sizes, Colors, Highlights, and Alignment.
* **⚡ Modern Stack:** Built on Next.js 14 (App Router) and Tailwind CSS.

---

## 🛠️ Technology Stack

* **Frontend:** Next.js 16, React 19, Tailwind CSS v4
* **Editor Engine:** Tiptap (Headless wrapper around ProseMirror)
* **Pagination:** `tiptap-pagination-plus` (Community extension for DOM-based splitting)
* **PDF Generation:** Puppeteer Core + Sparticuz Chromium (Serverless-compatible)
* **Icons:** Lucide React

---

## ⚙️ Setup & Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/opensphere-editor.git](https://github.com/your-username/opensphere-editor.git)
    cd opensphere-editor
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open locally**
    Visit `http://localhost:3000` to see the editor in action.

---

## 🧩 Architectural Design Decisions

### 1. The "Pagination Problem"
Rich text on the web usually flows freely (`height: auto`). To simulate paper:
* **Approach:** We utilized the `tiptap-pagination-plus` extension.
* **Why:** Calculating where a paragraph breaks requires measuring the rendered DOM height against a fixed page height (1060px for Letter). Doing this manually involves complex logic to handle "widows," "orphans," and splitting HTML nodes. This library handles the decorations and splitting logic efficiently.

### 2. Server-Side PDF Generation (The "WYSIWYG" Guarantee)
* **Challenge:** The browser's native `window.print()` is unreliable. It often ignores background colors, changes margins based on user printer settings, and scales fonts differently.
* **Solution:** We implemented a Next.js API route (`/api/generate-pdf`) using **Puppeteer**.
* **How it works:** 1. The editor sends its HTML content to the server.
    2. Puppeteer launches a headless Chrome instance.
    3. We inject the *exact same* CSS variables, fonts (Inter), and dimensions (818px width) used in the frontend.
    4. The page is printed to PDF with strict `@page` CSS rules.
* **Result:** The downloaded PDF is indistinguishable from the editor view.

### 3. Headers & Footers
* **Decision:** While the editor supports interactive footers for drafting context (e.g., viewing page numbers), they are currently **excluded** from the final PDF export.
* **Reasoning:** To ensure 100% layout stability across different PDF viewers, we prioritized the main content body. The header/footer implementation in the print engine is currently handled via CSS `@page` margins to keep the document clean for legal submission standards.

### 4. Margins & Dimensions
* **Config:** We used a fixed width of `818px` and height of `1060px` to simulate US Letter size at ~96 DPI.
* **Margins:** Set to ~0.75 inches (70px) to balance readability on smaller laptop screens while maintaining the official aspect ratio required for legal documents.

---

## 🧪 How to Test

1.  **Type & Overflow:** Keep typing until content reaches the bottom of Page 1. Watch it automatically flow to Page 2.
2.  **Tables:** Insert a table near the bottom of a page. Add rows until it splits. The table will elegantly continue on the next page with headers preserved (if configured).
3.  **PDF Export:** Click the "Download PDF" icon in the toolbar. 

---

## 🔮 Future Improvements

* **Dynamic Headers:** Implement CSS Paged Media `@top-center` support to render headers natively in the PDF.
* **Comments & Collaboration:** Leverage Tiptap's Y.js integration to allow real-time multiplayer editing.
* **Docx Export:** Add support for exporting to Microsoft Word format for legacy workflows.

---

**Submitted by:** Sumit  
**For:** OpenSphere Full-Stack Intern Assignment