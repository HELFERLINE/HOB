export class Util {
    static formatDate(date: Date | undefined, leadingZero?: boolean): string {
        if (!date) {
            return '';
        }
      const dateObj = [
          date.getDate().toString(),
          (date.getMonth() + 1).toString(),
          date.getFullYear().toString()
      ];
  
      // day
      if (leadingZero && dateObj[0].length < 2) {
          dateObj[0] = `0${dateObj[0]}`;
      }
  
      // month
      if (leadingZero && dateObj[1].length < 2) {
          dateObj[1] = `0${dateObj[1]}`;
      }
  
      return `${dateObj[0]}.${dateObj[1]}.${dateObj[2]}`;
    }
  
    static formatTime(time: Date | undefined) {
        if (!time) {
            return '';
        }
      const timeObj = [
          time.getHours().toString(),
          time.getMinutes().toString()
      ];
  
      // hours
      if (timeObj[0].length < 2) {
          timeObj[0] = `0${timeObj[0]}`;
      }
  
      // minutes
      if (timeObj[1].length < 2) {
          timeObj[1] = `0${timeObj[1]}`;
      }
  
      return `${timeObj[0]}:${timeObj[1]}`;
    }
    static formatPhoneNumber(phoneNumber: number | undefined | null): string | null {
      if (!phoneNumber) {
        return null;
      }
      const phoneNumberStr = phoneNumber.toString();
      return phoneNumberStr.startsWith('+') ? phoneNumberStr : `+${phoneNumberStr}`;
    }
  
  }