import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthServiceService } from '../service/auth-service.service';

@Component({
  selector: 'app-direct-download',
  template: `<p>Downloading...</p>`,
  styles: []
})
export class DirectDownloadComponent implements OnInit {

  constructor(
    private auth: AuthServiceService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const schema = params.get('scheme');
      const version = params.get('version');
      if (schema && version) {
        this.downloadPDF(schema, version);
      }

      const year = params.get('year');
      const empNo = params.get('empNo');
      if (year && empNo) {
        this.auth.download(1,year, empNo).subscribe((response: Blob) => {
            const url = window.URL.createObjectURL(response);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${empNo}_${year}.pdf`; // Download with the schema name
            a.click();
            window.URL.revokeObjectURL(url);
          }, error => {
            console.error('Download failed', error);
          });
      }

    });
  }

  downloadPDF(scheme: string, version: string): void {
    this.auth.directDownload(scheme, version).subscribe((response: Blob) => {
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${scheme}.pdf`; // Download with the schema name
      a.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Download failed', error);
    });
  }
}
