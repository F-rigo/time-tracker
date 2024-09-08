declare module 'react-native-pdf-lib' {
  export class PDFDocument {
    static create(filePath: string): PDFDocument;
    addPages(...pages: Page[]): PDFDocument;
    write(): Promise<void>;
  }

  export class Page {
    static create(): Page;
    setMediaBox(width: number, height: number): Page;
    drawText(text: string, options: { x: number; y: number; fontSize: number }): Page;
  }
}
