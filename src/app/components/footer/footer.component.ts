import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit{

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    const year = this.document.querySelector('.year');

    if(year)
      year.textContent = new Date().getFullYear().toString();
  }
}