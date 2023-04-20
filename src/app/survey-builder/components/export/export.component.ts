import {Component, OnInit, Input} from '@angular/core';
import * as XLSX from 'xlsx';
import * as moment from 'moment';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {
  @Input()  // define input properties for the component
  excelData: any[][] = [];  // a two-dimensional array that contains the data to be exported to Excel
  @Input()
  excelFileName = 'worksheet-%s.xlsx';  // %s placeholder will be replaced with a timestamp 

  private option: XLSX.WritingOptions = {bookType: 'xlsx', type: 'array'};

  constructor () {}

  ngOnInit(): void {}
  cancel(): void {}
  download(): void {
    // generate worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.excelData);

    // generate a workbook and add the worksheet into it as SHEET1
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // save to file, and timestamp to file
    XLSX.writeFile(workbook, this.excelFileName.replace('%s', moment().format('YYYYMMDDThhmmssZ')));
  }

  downloadExcel(excelData: any, excelFileName: any): void {
    // generate worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(excelData);

    // generate a workbook and add the worksheet into it as SHEET1
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // save to file, and timestamp to file
    XLSX.writeFile(workbook, excelFileName.replace('%s', moment().format('YYYYMMDDThhmmssZ')));
  }
}
