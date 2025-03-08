import { Injectable } from '@nestjs/common';
import * as fastCsv from 'fast-csv';

@Injectable()
export class CSVGeneratorService {
  async generateCsv(data: any[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      const csvStream = fastCsv.format({ headers: true });

      // Listen to data events and collect chunks
      csvStream.on('data', (chunk) => chunks.push(chunk));

      // Listen to the end event to resolve the buffer
      csvStream.on('end', () => resolve(Buffer.concat(chunks)));

      // Handle errors
      csvStream.on('error', (error) => reject(error));

      // Write the data and end the stream
      data.forEach((row) => csvStream.write(row));
      csvStream.end();
    });
  }
}
