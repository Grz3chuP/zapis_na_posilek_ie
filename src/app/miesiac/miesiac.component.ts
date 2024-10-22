import {Component, inject} from '@angular/core';
import {IDaneLogowania} from '../interfaces/IDaneLogowania';
import {FormsModule} from '@angular/forms';
import {loading} from '../services/loading';
import {SerwisService} from '../services/serwis.service';

@Component({
  selector: 'app-miesiac',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './miesiac.component.html',
  styleUrl: './miesiac.component.css'
})
export class MiesiacComponent {
  serwis = inject(SerwisService);

  statusLogowania = 0;
  daneLogowania: IDaneLogowania | undefined;
  constructor() {
 this.daneLogowania = {
    id: '',
    nr: ''
  };

  }

dodawanieLiczbyDoDanychLogowania(liczba: number) {
  if(!this.statusLogowania) {
    this.daneLogowania!.id += liczba.toString();
  } else {
    this.daneLogowania!.nr += liczba.toString();
  }

}

  wprowadzID() {
   if(this.statusLogowania === 1) {
     console.log('wprowadzono za duzo danych');
   this.wczytajDaneUrzytkowniak();
   } else {
     this.statusLogowania += 1;
   }
  }

  wyczyscDaneLogowania() {
    if(this.statusLogowania === 0) {
      this.daneLogowania!.id = '';
    } else {
      this.daneLogowania!.nr = '';
    }
  }
  wyczysczCalkowiteDaneLogowania() {
    this.daneLogowania!.id = '';
    this.daneLogowania!.nr = '';
    this.statusLogowania = 0;
  }
  wczytajDaneUrzytkowniak() {
    loading.set(true);
    this.serwis.zapytaj_o('numer_karty', this.daneLogowania)
      .subscribe({
        next:(dane: any) => {
          loading.set(false);
          console.log(dane);
          this.statusLogowania = 2;
        },
        error: (dane: any) => {
          loading.set(false);
          this.wyczysczCalkowiteDaneLogowania();
          this.serwis.errorhandler(dane);


        }
      })
  }

}
