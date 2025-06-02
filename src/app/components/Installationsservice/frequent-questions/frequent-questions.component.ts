import { Component } from '@angular/core';
import { frequentQuestion } from '../../../core/models/frequentQuestion';
import { onlineService } from '../../../core/services/online.service';

@Component({
  selector: 'app-frequent-questions',
  standalone: true,
  imports: [],
  templateUrl: './frequent-questions.component.html',
  styleUrl: './frequent-questions.component.css'
})
export class FrequentQuestionsComponent {

  constructor(
    private onlineService: onlineService
  ) { }

  get booking() {
    return this.onlineService.booking;
  }

  frequentQuestions: frequentQuestion[] = [
    {
      id: 1,
      question: 'ABC',
      answer: 'ABC',
      isToggled: false
    }
  ]

  toggleQuestion(questionIndex: any): void {
    this.frequentQuestions[questionIndex].isToggled = !this.frequentQuestions[questionIndex].isToggled;
    this.frequentQuestions.forEach((question, index) => {
      if (index !== questionIndex) {
        question.isToggled = false;
      }
    }
    );
  }
}