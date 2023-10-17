import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public bingoNumbers: BingoNumber[] = [];
  private isDrawingNumber: boolean = false;
  private _drawnBingoNumberSubject: BehaviorSubject<BingoNumber | undefined> =
    new BehaviorSubject<BingoNumber | undefined>(undefined);

  public get drawnBingoNumber(): BehaviorSubject<BingoNumber | undefined> {
    return this._drawnBingoNumberSubject;
  }

  public drawnBingoNumber$: Observable<BingoNumber | undefined> =
    this.drawnBingoNumber.asObservable();

  ngOnInit(): void {
    for (let i = 1; i <= 90; i++) {
      this.bingoNumbers.push(new BingoNumber(i, false));
    }
  }

  public displayBingoNumber(num: number): BingoNumber[] {
    const groupedNumbers: BingoNumber[] = [];
    for (let i = (num + 1) * 10 - 10; i < (num + 1) * 10; i++) {
      if (this.bingoNumbers[i] !== undefined) {
        groupedNumbers.push(this.bingoNumbers[i]);
      }
    }
    return groupedNumbers;
  }

  public async drawBingoNumber(): Promise<void> {
    if (this.isDrawingNumber) {
      return;
    }
    this.isDrawingNumber = true;
    const availableNumbers = this.bingoNumbers.filter((x) => !x.drawn);
    if (availableNumbers.length === 0) {
      return; // All numbers are drawn.
    }

    const startTime = Date.now();
    const endTime = startTime + Math.floor(Math.random() * 2000) + 2000; // Random duration between 3-5 seconds

    let selectedNumber: BingoNumber | undefined;

    while (Date.now() < endTime) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      selectedNumber = availableNumbers[randomIndex];
      // Update the drawnBingoNumber subject
      this._drawnBingoNumberSubject.next(selectedNumber);

      // Optional: You can log the selected number to the console.
      console.log(`Selected Bingo Number: ${selectedNumber.number}`);

      await this.sleep(30); // Wait for 50 milliseconds before selecting the next number
    }

    if (selectedNumber) {
      selectedNumber.drawn = true;
      console.log('Selected Bingo Number: ', selectedNumber);
      this._drawnBingoNumberSubject.next(selectedNumber);
    }

    this.isDrawingNumber = false;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export class BingoNumber {
  public number: number;
  public drawn: boolean;
  constructor(public Number: number, public Drawn: boolean) {
    this.drawn = Drawn;
    this.number = Number;
  }
}
