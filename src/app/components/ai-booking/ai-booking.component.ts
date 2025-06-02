import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface Question {
  id: string;
  text: string;
  type: 'yes-no' | 'text' | 'multiple-choice';
  options?: string[];
}

interface Answer {
  questionId: string;
  question: string;
  answer: string;
}

@Component({
  selector: 'app-ai-booking',
  standalone: true,
  templateUrl: './ai-booking.component.html',
  imports: [CommonModule],
  styleUrls: ['./ai-booking.component.css']
})
export class AiBookingComponent implements OnInit {
  currentStep: 'initial' | 'questions' | 'summary' = 'initial';
  initialProblem = '';
  currentDescription = '';
  currentQuestion: Question | null = null;
  currentAnswer = '';
  answers: Answer[] = [];
  isProcessing = false;
  aiThinking = false;
  showTransition = false;
  
  // Mock questions based on common IT issues
  private mockQuestions: Question[] = [
    {
      id: '1',
      text: 'Haben Sie das Gerät bereits aus- und wieder eingeschaltet?',
      type: 'yes-no'
    },
    {
      id: '2',
      text: 'Seit wann tritt das Problem auf?',
      type: 'multiple-choice',
      options: ['Heute', 'Seit gestern', 'Seit einer Woche', 'Länger als eine Woche']
    },
    {
      id: '3',
      text: 'Können Sie beschreiben, welche Fehlermeldung angezeigt wird?',
      type: 'text'
    },
    {
      id: '4',
      text: 'Sind alle Kabel ordnungsgemäß angeschlossen?',
      type: 'yes-no'
    },
    {
      id: '5',
      text: 'Welches Betriebssystem verwenden Sie?',
      type: 'multiple-choice',
      options: ['Windows 10', 'Windows 11', 'Mac', 'Ich weiß nicht']
    }
  ];

  ngOnInit(): void {}

  onDescriptionChange(value: string): void {
    this.currentDescription = value;
    
    if (this.currentStep === 'initial' && value.trim().length > 15) {
      this.startTransition();
    } else if (this.currentStep === 'questions') {
      this.triggerAiThinking();
    }
  }

  private startTransition(): void {
    if (this.currentStep === 'initial') {
      this.showTransition = true;
      this.initialProblem = this.currentDescription;
      
      setTimeout(() => {
        this.currentStep = 'questions';
        this.triggerAiThinking();
      }, 800); // Smooth transition delay
    }
  }

  private triggerAiThinking(): void {
    this.aiThinking = true;
    
    setTimeout(() => {
      this.aiThinking = false;
      this.askNextQuestion();
    }, 1500); // Reduced thinking time
  }

  private askNextQuestion(): void {
    const remainingQuestions = this.mockQuestions.filter(q => 
      !this.answers.find(a => a.questionId === q.id)
    );
    
    if (remainingQuestions.length > 0) {
      this.currentQuestion = remainingQuestions[0];
    } else {
      this.currentQuestion = null;
      this.currentStep = 'summary';
    }
    
    this.currentAnswer = '';
  }

  answerQuestion(answer: string): void {
    if (this.currentQuestion && answer.trim()) {
      this.answers.push({
        questionId: this.currentQuestion.id,
        question: this.currentQuestion.text,
        answer: answer
      });
      
      this.updateDescriptionWithAnswer(this.currentQuestion, answer);
      this.triggerAiThinking();
    }
  }

  private updateDescriptionWithAnswer(question: Question, answer: string): void {
    let addition = '';
    
    switch (question.id) {
      case '1': // Restart question
        if (answer === 'Nein') {
          addition = ' Das Gerät wurde noch nicht neu gestartet.';
        } else {
          addition = ' Ein Neustart wurde bereits versucht, das Problem besteht weiter.';
        }
        break;
      case '2': // Time frame
        addition = ` Das Problem tritt seit ${answer.toLowerCase()} auf.`;
        break;
      case '3': // Error message
        if (answer.trim()) {
          addition = ` Fehlermeldung: "${answer}".`;
        }
        break;
      case '4': // Cables
        if (answer === 'Ja') {
          addition = ' Alle Kabel sind korrekt angeschlossen.';
        } else {
          addition = ' Die Kabelverbindungen könnten fehlerhaft sein.';
        }
        break;
      case '5': // Operating system
        addition = ` Betriebssystem: ${answer}.`;
        break;
    }
    
    if (addition) {
      this.currentDescription += addition;
    }
  }

  answerYesNo(answer: boolean): void {
    this.answerQuestion(answer ? 'Ja' : 'Nein');
  }

  addTextToDescription(): void {
    if (this.currentAnswer.trim()) {
      this.answerQuestion(this.currentAnswer);
    }
  }

  restartBooking(): void {
    this.currentStep = 'initial';
    this.initialProblem = '';
    this.currentDescription = '';
    this.currentQuestion = null;
    this.currentAnswer = '';
    this.answers = [];
    this.isProcessing = false;
    this.aiThinking = false;
    this.showTransition = false;
  }

  bookTechnician(): void {
    // Mock booking process
    alert('Vielen Dank! Ein Techniker wird sich in Kürze bei Ihnen melden.');
    this.restartBooking();
  }
}
