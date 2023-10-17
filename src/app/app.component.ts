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

  public memes: Meme[] = [
    {
      number: 1,
      meme: 'https://media.tenor.com/kcpKqzMdJu4AAAAd/bowling-ball-bowling-pin.gif',
    },
    {
      number: 10,
      meme: 'https://media.tenor.com/fo0rUUBalvoAAAAC/bowling-ball-crash.gif',
    },
    {
      number: 15,
      meme: 'https://media.tenor.com/luPargXFICQAAAAd/walking-kitchen.gif',
    },
    {
      number: 21,
      meme: 'https://media.tenor.com/rOaZl9xBDfwAAAAd/vine-21.gif',
    },
    {
      number: 69,
      meme: '../assets/69.gif',
    },
  ];

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
    this.isDrawingNumber = true;
    const availableNumbers = this.bingoNumbers.filter((x) => !x.drawn);
    if (availableNumbers.length === 0) {
      return; // All numbers are drawn.
    }

    const startTime = Date.now();
    const endTime = startTime + Math.floor(Math.random() * 2000) + 2000; // Random duration between 3-5 seconds

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
    this._animating.next(false);
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
