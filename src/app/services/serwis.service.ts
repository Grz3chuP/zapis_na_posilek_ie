import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
declare let toastr: any;
@Injectable({
  providedIn: 'root'
})
export class SerwisService {

  constructor(private http: HttpClient) { }
  zapytaj_o(co: string , dla: any): Observable<any> {
    return this.http.post(`/apps/xhr/zapis_na_posilek/zapytaj_o/${co}`, {
      dla: dla
    })
  }

  zapisz(co: string , dla: any): Observable<any> {
    return this.http.post(`/apps/xhr/zapis_na_posilek/zapisz/${co}`, {
      payload: dla
    })
  }

  upload(formData: any, options: any): Observable<any> {
    return this.http.post(`/apps/xhr/przyrzady/upload`, formData, options);
  }

  errorhandler(d: any) {
    let byl_juz_komunikat = false;
    if (d.error.errors) {
      console.error(d);
      if (typeof d.error.errors === 'string') {
        //this.message.add({summary: d.error.errors, severity: 'error', icon: 'pi pi-times'});
        toastr.error(d.error.errors);
        if (d.error.message) {
          toastr.error(d.error.message);
          //this.message.add({summary: d.error.message, severity: 'error', icon: 'pi pi-times'});
          if (d.error.message.toLowerCase().includes('unauthenticated')) {
            document.location.replace('../../logout?akcja=logout&target=' + location.pathname.substring(1));
          }
        }
        return;
      }
      for (let key in d.error.errors) {
        if (d.error.errors.hasOwnProperty(key)) {
          d.error.errors[key].forEach((wiadomosc: string) => {
            toastr.error(wiadomosc);
            // this.message.add({summary: d.error.message, severity: 'error', icon: 'pi pi-times'});
            byl_juz_komunikat = true;
          });
        }
      }
      if (!byl_juz_komunikat) {
        toastr.error(d.error.message);
        // this.message.add({summary: d.error.message, severity: 'error', icon: 'pi pi-times'});
      }
    }
    if (!byl_juz_komunikat) {
      toastr.error('Bład ' + d.message);
      // this.message.add({summary: d.error.message, severity: 'error', icon: 'pi pi-times'});
    }
  }
}
