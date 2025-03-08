import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PdfGeneratorService {
  async generatePdf(htmlContent: string): Promise<any> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the HTML content
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0',
    });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4', // You can adjust format (e.g., Letter)
      printBackground: true, // Include background styles
    });

    await browser.close();

    return pdfBuffer;
  }
}
