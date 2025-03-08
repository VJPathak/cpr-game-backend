import { Module } from '@nestjs/common';
import { CommonUtilsService } from './common-utils.service';
import { PdfGeneratorService } from './pdf-generator.service';
import { CSVGeneratorService } from './csv-generator.service';
import { DateUtilsService } from './date-utils.service';

@Module({
  providers: [
    CommonUtilsService,
    PdfGeneratorService,
    CSVGeneratorService,
    DateUtilsService,
  ],
  exports: [
    CommonUtilsService,
    PdfGeneratorService,
    CSVGeneratorService,
    DateUtilsService,
  ],
})
export class CommonUtilsModule {}
