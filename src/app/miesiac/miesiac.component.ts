import {Component, inject} from '@angular/core';
import {IDaneLogowania} from '../interfaces/IDaneLogowania';
import {FormsModule} from '@angular/forms';
import {loading} from '../services/loading';
import {SerwisService} from '../services/serwis.service';
import {IDane} from '../interfaces/IDane';
import {IDaneDaty} from '../interfaces/IDaneDaty';
import {IPracownik} from '../interfaces/IPracownik';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-miesiac',
  standalone: true,
  imports: [
    FormsModule,
    NgClass
  ],
  templateUrl: './miesiac.component.html',
  styleUrl: './miesiac.component.css'
})
export class MiesiacComponent {
  serwis = inject(SerwisService);

  statusLogowania = 0;
  daneLogowania: IDaneLogowania | undefined;
  dane: IDane | undefined;
  daneDaty: IDaneDaty | undefined;
  pracownik: IPracownik | undefined;
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
          this.dane = dane.dane;
          this.daneDaty = dane.dane_daty;
          this.pracownik = dane.pracownik;
          this.statusLogowania = 2;
        },
        error: (dane: any) => {
          loading.set(false);
          this.wyczysczCalkowiteDaneLogowania();
          this.serwis.errorhandler(dane);
        }
      })
  }
  getDayOfWeek(dateString: string): string {
    const daysOfWeek = ['Nie', 'Pon', 'Wto', 'Śro', 'Czw', 'Pią', 'Sob'];

    const date = new Date(dateString);
    const dayIndex = date.getDay();  // Zwraca liczbę od 0 (Niedziela) do 6 (Sobota)

    return daysOfWeek[dayIndex];
  }
  getMonthName(numerDaty: string): string {
    const months = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
    return months[parseInt(numerDaty) - 1];

  }

  wyloguj() {
    this.statusLogowania = 0;
    this.dane = undefined;
    this.daneDaty = undefined;
    this.pracownik = undefined;
    this.wyczyscDaneLogowania();
  }
  scroll(offset: number) {
    window.scrollBy({
      top: offset, // Ustawienie wartości offsetu w pikselach
      behavior: 'smooth' // Płynne przewijanie
    });
  }

  reverseDateFormat(dateString: string): string {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  }
  isDateExpired(dateString: string): boolean {
    const today = new Date(); // Dzisiejsza data
    const dateToCompare = new Date(dateString); // Konwersja stringa na obiekt Date
    dateToCompare.setDate(dateToCompare.getDate() - 1);
    // Porównanie dat - data musi być starsza lub równa dzisiejszej, by przycisk był aktywny
    return dateToCompare < today;
  }
}
