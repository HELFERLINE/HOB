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
      question: 'Was beinhaltet der O₂ Installationsservice?',
      answer: 'Der O₂ Installationsservice beinhaltet je nach Wunsch max. folgende Leistungen: Anschluss und Einrichtung eines Routers (auch Fremdhardware), Anschluss eines bereits vorhandenen Festnetztelefons, Einrichtung des WLAN-Zugangs auf Endgeräten wie Smartphone, Tablet, Smart-TV und Smart-Home-Basis. Zudem erhältst du Tipps zur WLAN-Optimierung. Leistungen, die darüber hinaus gehen, können kostenpflichtig in Anspruch genommen werden. Der Installationsservice ersetzt keine technischen Arbeiten, wie das Verlegen neuer Leitungen oder das erstmalige Herstellen eines Anschlusses. Diese erfolgen im Vorfeld durch unseren Technikdienst.',
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