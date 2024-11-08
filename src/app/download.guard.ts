import { CanActivateFn } from '@angular/router';
import { AuthServiceService } from './service/auth-service.service';
import { inject } from '@angular/core';

export const DownloadGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthServiceService);
  const scheme = route.paramMap.get('scheme');
  const version = route.paramMap.get('version');
  console.log("here ", scheme)
  if (scheme && version) {
    auth.directDownload(scheme, version).subscribe((response: Blob) => {
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
  return false; // Prevent navigation
};
