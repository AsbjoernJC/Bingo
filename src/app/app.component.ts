import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Memes } from './memes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private isDrawingNumber: boolean = false;
  public bingoNumbers: BingoNumber[] = [];

  private _animating: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  public get animating(): boolean {
    return this._animating.value;
  }

  private _meme: BehaviorSubject<string> = new BehaviorSubject<string>('');

  public get meme(): string {
    return this._meme.value;
  }

  public memes: Meme[] = new Memes().memes;

  private _drawnBingoNumberSubject: BehaviorSubject<BingoNumber | undefined> =
    new BehaviorSubject<BingoNumber | undefined>(undefined);

  public get drawnBingoNumber(): BehaviorSubject<BingoNumber | undefined> {
    return this._drawnBingoNumberSubject;
  }

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
    this._animating.next(false);
    this.isDrawingNumber = true;
    const availableNumbers = this.bingoNumbers.filter((x) => !x.drawn);
    if (availableNumbers.length === 0) {
      this._meme.next(
        'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcW53azBjYjJyaTQ4cWVwODh6MmIzY3c5ZTY5eDZ5bXhldjkzZm5yciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/IwAZ6dvvvaTtdI8SD5/giphy.gif'
      );
      this._animating.next(true);
      this._drawnBingoNumberSubject.next(undefined);
      return; // All numbers are drawn.
    }

    const startTime = Date.now();
    const endTime = startTime + Math.floor(Math.random() * 2000) + 1500; // Random duration between 3-5 seconds

    let selectedNumber: BingoNumber | undefined;
    let finalNumber: BingoNumber =
      availableNumbers[Math.floor(Math.random() * availableNumbers.length)];

    this.tryStartAnimation(finalNumber);

    while (Date.now() < endTime) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      selectedNumber = availableNumbers[randomIndex];
      // Update the drawnBingoNumber subject
      this._drawnBingoNumberSubject.next(selectedNumber);

      // Optional: You can log the selected number to the console.
      console.log(`Selected Bingo Number: ${selectedNumber.number}`);

      await this.sleep(30); // Wait for 50 milliseconds before selecting the next number
    }

    finalNumber.drawn = true;
    console.log('Selected Bingo Number: ', finalNumber);
    this._drawnBingoNumberSubject.next(finalNumber);

    this.isDrawingNumber = false;
  }

  private tryStartAnimation(finalNumber: BingoNumber): void {
    const meme = this.memes.find((x) => x.number === finalNumber.number);
    if (meme !== undefined) {
      this._meme.next(meme.meme);
      this._animating.next(true);
    }
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

export type Meme = {
  number: number;
  meme: string;
};
