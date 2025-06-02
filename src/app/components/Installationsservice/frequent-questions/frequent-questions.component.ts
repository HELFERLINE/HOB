import { Component } from '@angular/core';
import { frequentQuestion } from '../../../core/models/frequentQuestion';
import { O2Service } from '../../../core/services/o2.service';

@Component({
  selector: 'app-frequent-questions',
  standalone: true,
  imports: [],
  templateUrl: './frequent-questions.component.html',
  styleUrl: './frequent-questions.component.css'
})
export class FrequentQuestionsComponent {

  constructor(
    private o2service: O2Service
  ) { }

  get booking() {
    return this.o2service.booking;
  }

  frequentQuestions: frequentQuestion[] = [
    {
      id: 1,
      question: 'Was beinhaltet der O₂ Installationsservice?',
      answer: 'Der O₂ Installationsservice beinhaltet je nach Wunsch max. folgende Leistungen: Anschluss und Einrichtung eines Routers (auch Fremdhardware), Anschluss eines bereits vorhandenen Festnetztelefons, Einrichtung des WLAN-Zugangs auf Endgeräten wie Smartphone, Tablet, Smart-TV und Smart-Home-Basis. Zudem erhältst du Tipps zur WLAN-Optimierung. Leistungen, die darüber hinaus gehen, können kostenpflichtig in Anspruch genommen werden. Der Installationsservice ersetzt keine technischen Arbeiten, wie das Verlegen neuer Leitungen oder das erstmalige Herstellen eines Anschlusses. Diese erfolgen im Vorfeld durch unseren Technikdienst.',
      isToggled: false
    },
    {
      id: 2,
      question: 'Wo erhalte ich weitere Informationen?',
      answer: 'Weitere Informationen zum O₂ Installationsservice findest du hier: https://www.o2online.de/installationsservice',
      isToggled: false
    },
    {
      id: 3,
      question: 'Wer kann den kostenlosen Installationsservice nutzen?',
      answer: 'Der O₂ Installationsservice ist in den O₂ Home Tarifen im Rahmen von Neuaktivierungen, Umzügen oder Vertragsverlängerungen mit Technologiewechsel verfügbar. Er kann bei Bedarf einmalig und kostenlos per Vor-Ort-Termin oder per Videocall bis zu einem Monat nach Aktivierung eines Neuvertrags bzw. im Falle eines Umzugs/einer Vertragsverlängerung mit Technologiewechsel nach Umstellung des Festnetzanschlusses in Anspruch genommen werden.',
      isToggled: false
    },
    {
      id: 4,
      question: 'An wen richtet sich der O₂ Installationsservice?',
      answer: 'Der O₂ Installationsservice richtet sich an Personen, die nach Freischaltung ihres Internetanschlusses Unterstützung beim Anschluss ihres Routers oder bei der Einrichtung des WLAN-Zugangs auf ihren Endgeräten benötigen. Hierfür steht ein Experte kostenlos auf Wunsch vor Ort oder per Videocall zur Verfügung.',
      isToggled: false
    },
    {
      id: 5,
      question: 'Ist die Buchung des Installationsservice Voraussetzung für meine Freischaltung bzw. dass mein Internet funktioniert?',
      answer: 'Nein, ein Techniker schaltet am Tag der Aktivierung das Internet bei dir zuhause frei. Die Buchung eines Installationsexperten ist nicht Voraussetzung für eine funktionierende Leitung. Der Experte hilft lediglich, sofern Bedarf besteht, bspw. bei der Installation des Routers und der Einrichtung auf Endgeräten.',
      isToggled: false
    },
    {
      id: 6,
      question: 'Ersetzt der O₂ Installationsservice den Technikertermin?',
      answer: 'Nein, der Installationsservice ersetzt keine technischen Arbeiten, wie das Verlegen neuer Leitungen oder das erstmalige Herstellen eines Anschlusses. Diese erfolgen im Vorfeld durch unseren Technikdienst. Er dient auch nicht der Leitungsaktivierung. Der O₂ Installationsservice richtet sich an Personen, die nach Freischaltung ihres Internetanschlusses Unterstützung bei der Einrichtung ihres WLAN-Zugangs benötigen. Dieser ist ein optionaler Service, der bei Bedarf in Anspruch genommen werden kann.',
      isToggled: false
    },
    {
      id: 7,
      question: 'Wann kann ich den Installationsservice in Anspruch nehmen?',
      answer: 'Der O₂ Installationsservice kann bei Bedarf einmalig und kostenlos bis zu einen Monat nach Aktivierung eines Neuvertrags bzw. im Falle eines Umzugs/einer Vertragsverlängerung mit Technologiewechsel bis zu einen Monat nach Umstellung des Festnetzanschlusses in Anspruch genommen werden.',
      isToggled: false
    },
    {
      id: 8,
      question: 'Ich habe den Termin innerhalb von 1 Monat ab Aktivierung gebucht, der Installationsservice selbst findet aber erst später statt. Ist der Service dann trotzdem kostenlos?',
      answer: 'Ja. Wichtig ist, dass der Termin innerhalb von 1 Monat ab Aktivierung gebucht wird. Es ist unerheblich, wann der Installationstermin stattfindet.',
      isToggled: false
    },
    {
      id: 9,
      question: 'Wie und wann kann der kostenlose Installationsservice gebucht werden?',
      answer: 'Die Buchung des kostenlosen Installationsservice ist ab Bekanntgabe des Aktivierungstermins möglich unter http://o2.helferline.com/installationsservice oder telefonisch unter 0800 58 92 346.',
      isToggled: false
    },
    {
      id: 10,
      question: 'Kann ich den Installationsservice auch telefonisch buchen?',
      answer: 'Ja, der Service kann auch telefonisch gebucht werden unter 0800 58 92 346.',
      isToggled: false
    },
    {
      id: 11,
      question: 'Zu welchen Zeiten kann ein Installationsservice-Termin stattfinden?',
      answer: 'Einsätze können an 365 Tagen im Jahr zwischen 7 und 22 Uhr vereinbart werden.',
      isToggled: false
    },
    {
      id: 12,
      question: 'Was soll ich tun, wenn mein Aktivierungstermin noch nicht bekannt ist?',
      answer: 'Um eine Terminablehnung zu vermeiden, warte bitte in diesem Fall mit der Buchung, bis der Aktivierungstermin vorliegt.',
      isToggled: false
    },
    {
      id: 13,
      question: 'Auf welchen Tag soll ich den Installationsservicetermin legen?',
      answer: 'Der optimale Zeitpunkt für den Installationsservicetermin ist innerhalb von 3 Tagen nach Freischaltung.',
      isToggled: false
    },
    {
      id: 14,
      question: 'Wie schnell erhalte ich einen Termin?',
      answer: 'Vorlaufzeiten von 1 bis max. 3 Tagen sind ausreichend, um einen Termin zu bekommen.',
      isToggled: false
    },
    {
      id: 15,
      question: 'Wie verschiebe ich meinen Termin?',
      answer: 'Eine Verschiebung oder Absage ist bis 3 Stunden vor dem Termin jederzeit möglich. Antworte hierzu entweder auf deine Buchungsbestätigung (E-Mail an info@helferline.com) oder rufe die Buchungshotline an unter 0800 58 92 346.',
      isToggled: false
    },
    {
      id: 16,
      question: 'Wieso kann ich keinen Vor-Ort-Termin buchen? Es steht nur der Video-Call zur Verfügung.',
      answer: 'Der Vor-Ort-Installationsservice steht in fast ganz Deutschland zur Verfügung, nur einige wenige Regionen können aktuell leider noch nicht abgedeckt werden. Die Verfügbarkeit kannst du mit der Postleitzahl-Abfrage im Buchungssystem ermitteln. Falls der Vor-Ort Service an deiner Adresse nicht verfügbar ist, dann wähle bitte den Videosupport, dieser steht an allen deutschen Adressen zur Verfügung.',
      isToggled: false
    },
    {
      id: 17,
      question: 'Wer führt den O₂ Installationsservice durch?',
      answer: 'Die Durchführung erfolgt durch den Service-Dienstleister „HELFERLINE". Das Unternehmen betreibt ein flächendeckendes Technikernetzwerk und ist mit mehreren tausend Experten in Deutschland, Österreich und der Schweiz vertreten.',
      isToggled: false
    },
    {
      id: 18,
      question: 'Kann ich den Experten von HELFERLINE vertrauen?',
      answer: 'Alle Experten werden vorab aufwändig überprüft. Jeder potentielle Experte muss umfangreiche Tests bestehen, um seine technischen und sozialen Kompetenzen zu beweisen.',
      isToggled: false
    },
    {
      id: 19,
      question: 'Kann ich nach der Buchung eines Termins noch zwischen Video-Support und einem Vor-Ort-Termin wechseln?',
      answer: 'Ja, der Service kann geändert werden (sofern an deiner Adresse beide Services zur Verfügung stehen). Bitte rufe dazu am besten die Buchungshotline unter 0800 58 92 346 an oder schreibe ein Mail an info@helferline.com.',
      isToggled: false
    },
    {
      id: 20,
      question: 'Erhalte ich eine Buchungsbestätigung für den Installationsservice?',
      answer: 'Die Buchungsbestätigung erfolgt via E-Mail an die bei der Buchung angegebene E-Mail-Adresse.',
      isToggled: false
    },
    {
      id: 21,
      question: 'Wie und wann erfolgt die Terminbestätigung für den Installationsservice?',
      answer: 'Die Terminbestätigung erfolgt via SMS an die bei der Buchung angegebene Telefonnummer innerhalb von 24 Stunden nach Terminbuchung.',
      isToggled: false
    },
    {
      id: 22,
      question: 'Wer ist der Absender der Terminbestätigung?',
      answer: 'Die deutsche Nummer von HELFERLINE: +49 3221 23020.',
      isToggled: false
    },
    {
      id: 23,
      question: 'Wie läuft der Videocall genau ab? Bekomme ich einen Zugangslink?',
      answer: 'Diese Informationen erhältst du sofort nach der Buchung per E-Mail. Auf Wunsch kann der telefonische Termin auch ohne Video durchgeführt werden. Ob Video oder nur Sprache gewünscht ist, wird mit dir zu Beginn des Gesprächs vereinbart.',
      isToggled: false
    },
    {
      id: 24,
      question: 'Was ist, wenn die Installation im Rahmen des Videocalls nicht gelöst werden kann?',
      answer: 'Die Experten von HELFERLINE können dir noch während des Videosupport-Calls einen Vor-Ort-Einsatz einbuchen (sofern dieser an deiner Adresse verfügbar ist).',
      isToggled: false
    },
    {
      id: 25,
      question: 'Was ist, wenn der Installationsservice nicht erfolgreich ist?',
      answer: 'Wenn der Installationsservice nicht erfolgreich ist, kümmert sich O₂ proaktiv im Nachgang um eine Lösung deines Anliegens.',
      isToggled: false
    },
    {
      id: 26,
      question: 'Falls die Aktivierung am Aktivierungstag fehlschlägt, der HELFERLINE-Termin aber nicht abgesagt wird, kann der Experte trotzdem etwas tun z.B. alles vorbereiten?',
      answer: 'Prinzipiell ja, der Experte kann grundsätzlich alle Geräte anschließen und so weit wie möglich konfigurieren. Ein finaler Test der Internetverbindung ist aber nicht möglich.',
      isToggled: false
    },
    {
      id: 27,
      question: 'Sollte mein Aktivierungstermin vorverlegt werden, verschiebt sich dann der Installationstermin mit HELFERLINE automatisch?',
      answer: 'Nein, in diesem Fall bitte wir dich, eine Terminverschiebung für den Installationsservice zu veranlassen, um einen neuen, für dich passenden, Wunschtermin zu vereinbaren. Zur Terminverschiebung antworte bitte entweder auf deine Buchungsbestätigung (E-Mail an info@helferline.com) oder rufe die Buchungshotline unter 0800 58 92 346 an.',
      isToggled: false
    },
    {
      id: 28,
      question: 'Was ist vom O₂ Installationsservice ausgenommen?',
      answer: 'Ausgenommen sind komplexe IT-Installationen, wie Servereinrichtungen, oder spezielle Netzwerkkonfigurationen, die über die Standardanforderungen von Privathaushalten hinausgehen. Außerdem Arbeiten, die einen Elektriker erfordern, Stemmarbeiten oder Eingriffe in die Bausubstanz; Installationen in großer Höhe (>4m); Montagen an den Wänden mit Dämmung und/oder Wasser- oder gasführenden Installationen.',
      isToggled: false
    },
    {
      id: 29,
      question: 'Können weitere Services in Anspruch genommen werden, die nicht im Paket inkludiert sind?',
      answer: 'Ja. Die Zubuchung weiterer Services gegen Selbstzahlung ist jederzeit möglich - auch vor Ort.',
      isToggled: false
    },
    {
      id: 30,
      question: 'Bei Buchung beider Services (kostenloser Installationsservice und kostenpflichtige Expertenhilfe) - ab wann entstehen für mich Kosten?',
      answer: 'Die im Leistungsumfang des Installationsservice enthaltenen Anliegen (siehe oben) sind kostenlos. Sofern du darüber hinaus weitere technische Anliegen hast, können diese im Anschluss bearbeitet werden. Hierfür fallen Kosten in der Höhe von 19,- Euro pro angefangene Viertelstunde an. Die Anfahrtskosten sind über den Installationsservice kostenlos abgedeckt. Falls du zusätzliche Leistungen wünschst, buche diese am besten gleich bei der Buchung des Installationsservice dazu, damit sich der Experte auf dein Anliegen vorbereiten kann. Falls du die Zusatzleistung doch nicht benötigst, so kannst du diese jederzeit, auch noch unmittelbar vor Ort oder während des Videocalls, wieder abbestellen.',
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