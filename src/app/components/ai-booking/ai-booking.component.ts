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

enum AIState {
  INACTIVE = 'inactive',
  ACTIVATING = 'activating',
  STARTING = 'starting', 
  PREPARING = 'preparing',
  TYPING = 'typing',
  ANALYZING = 'analyzing',
  READY = 'ready'
}

@Component({
  selector: 'app-ai-booking',
  standalone: true,
  templateUrl: './ai-booking.component.html',
  imports: [CommonModule],
  styleUrls: ['./ai-booking.component.css']
})
export class AiBookingComponent implements OnInit {
  currentStep: 'initial' | 'questions' | 'contact' | 'summary' = 'initial';
  initialProblem = '';
  currentDescription = '';
  currentQuestion: Question | null = null;
  currentAnswer = '';
  answers: Answer[] = [];
  isProcessing = false;
  
  // Simplified state management
  aiState = AIState.INACTIVE;
  analysisPhase = '';
  analysisStep = 0;
  firstAnalysisComplete = false;
  showTransition = false;
  
  // Single timer for all debouncing
  debounceTimer: any = null;
  lastTypingTime = 0;
  
  private analysisSteps = [
    'Verbindung zur Wissensdatenbank...',
    'Analyse ähnlicher IT-Probleme...',
    'Pattern-Matching durchführen...',
    'Diagnostik-Algorithmus anwenden...',
    'Lösungsvorschläge generieren...',
    'Frage wird vorbereitet...'
  ];

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

  // Getter for display text based on state
  get aiHintDisplay(): { text: string; isTransitioning: boolean } {
    switch (this.aiState) {
      case AIState.ACTIVATING:
        return { text: '✨ KI wird aktiviert...', isTransitioning: true };
      case AIState.STARTING:
        return { text: '🚀 KI-Assistent startet...', isTransitioning: true };
      case AIState.PREPARING:
        return { text: '🚀 System wird vorbereitet...', isTransitioning: true };
      case AIState.TYPING:
        return { text: `🚀 ${this.analysisPhase}`, isTransitioning: true };
      case AIState.ANALYZING:
        return { text: `🚀 ${this.analysisPhase}`, isTransitioning: true };
      case AIState.READY:
        return { text: '✨ KI bereit', isTransitioning: false };
      default:
        return { text: '✨ KI wird aktiviert...', isTransitioning: false };
    }
  }

  // Getter for backward compatibility
  get isTyping(): boolean {
    return this.aiState === AIState.TYPING;
  }

  get aiThinking(): boolean {
    return this.aiState === AIState.ANALYZING;
  }

  onDescriptionChange(value: string): void {
    this.currentDescription = value;
    this.lastTypingTime = Date.now();

    // Clear any existing timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    if (this.currentStep === 'initial' && value.trim().length > 15) {
      this.debounceTimer = setTimeout(() => {
        if (Date.now() - this.lastTypingTime >= 800) {
          this.setState(AIState.ACTIVATING);
          setTimeout(() => this.startTransition(), 1200);
        }
      }, 800);
      return;
    }

    if (this.currentStep === 'questions') {
      this.setState(AIState.TYPING);
      this.analysisPhase = 'Eingabe wird analysiert...';

      // Debounce typing with single timer
      this.debounceTimer = setTimeout(() => {
        if (this.currentDescription === value && Date.now() - this.lastTypingTime >= 4000) {
          this.onTypingComplete(value);
        }
      }, 4000);
    }
  }

  private setState(newState: AIState): void {
    this.aiState = newState;
  }

  private onTypingComplete(value: string): void {
    if (value.trim().length > 0 && this.firstAnalysisComplete) {
      // Start analysis after a brief pause
      setTimeout(() => {
        if (this.aiState === AIState.TYPING) {
          this.triggerAnalysis();
        }
      }, 800);
    } else {
      this.setState(AIState.READY);
    }
  }

  private startTransition(): void {
    if (this.currentStep === 'initial') {
      this.showTransition = true;
      this.setState(AIState.STARTING);
      this.initialProblem = this.currentDescription;

      setTimeout(() => {
        this.currentStep = 'questions';
        this.setState(AIState.PREPARING);
        this.analysisPhase = 'KI-System wird initialisiert...';

        setTimeout(() => {
          this.triggerFirstAnalysis();
        }, 2000);
      }, 1200);
    }
  }

  private triggerFirstAnalysis(): void {
    this.setState(AIState.ANALYZING);
    this.analysisStep = 0;

    this.runAnalysisSequence(() => {
      this.setState(AIState.READY);
      this.analysisPhase = '';

      setTimeout(() => {
        this.firstAnalysisComplete = true;
        setTimeout(() => {
          this.askNextQuestion();
        }, 600);
      }, 400);
    });
  }

  private triggerAnalysis(): void {
    if (!this.firstAnalysisComplete) return;

    this.setState(AIState.ANALYZING);
    this.analysisStep = 0;

    this.runAnalysisSequence(() => {
      this.setState(AIState.READY);
      this.analysisPhase = '';

      setTimeout(() => {
        this.askNextQuestion();
      }, 600);
    });
  }

  private runAnalysisSequence(callback: () => void): void {
    const runStep = () => {
      if (this.analysisStep < this.analysisSteps.length) {
        this.analysisPhase = this.analysisSteps[this.analysisStep];
        this.analysisStep++;

        const delay = this.analysisStep === 1 ? 1000 : 
                     this.analysisStep === 2 ? 900 :
                     this.analysisStep === 3 ? 800 :
                     this.analysisStep === 4 ? 700 :
                     this.analysisStep === 5 ? 900 :
                     1100;

        setTimeout(runStep, delay);
      } else {
        setTimeout(callback, 400);
      }
    };

    setTimeout(runStep, 300);
  }

  private askNextQuestion(): void {
    const remainingQuestions = this.mockQuestions.filter(q => 
      !this.answers.find(a => a.questionId === q.id)
    );
    
    if (remainingQuestions.length > 0) {
      this.currentQuestion = remainingQuestions[0];
    } else {
      this.currentQuestion = null;
      this.currentStep = 'contact';
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
      
      this.currentQuestion = null;
      setTimeout(() => {
        this.triggerAnalysis();
      }, 600);
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
    this.showTransition = false;
    this.firstAnalysisComplete = false;
    this.analysisPhase = '';
    this.analysisStep = 0;
    this.lastTypingTime = 0;
    
    // Reset state
    this.setState(AIState.INACTIVE);

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }

  ngOnDestroy(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  }
}
