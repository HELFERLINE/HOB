import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { catchError, Observable, throwError} from 'rxjs';


export function httpErrorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  return next(req).pipe(
    catchError((error): Observable<HttpEvent<unknown>> => {
      if (error instanceof HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
          console.error('An error occurred:', error.error.message);
        } else {
          switch (error.status) {
            case HttpStatusCode.Unauthorized:
              console.error(`HTTP error: [${error.url}] ${error.status} - ${error.statusText}`);
              
              break;
            case HttpStatusCode.Forbidden:
              console.error(`HTTP error: [${error.url}] ${error.status} - ${error.statusText}`);
              
              break;
            case HttpStatusCode.NotFound:
              // redirect to 404 page
              console.error(`HTTP error: [${error.url}] ${error.status} - ${error.statusText}`);
              break;
            case HttpStatusCode.InternalServerError:
              // redirect to 500 page
              console.error(`HTTP error: [${error.url}] ${error.status} - ${error.statusText}`);
              break;
            default:
              console.error(`HTTP error: [${error.url}] ${error.status} - ${error.statusText}`);
          }
        }
      } else {
        console.error('An unexpected error occurred:', error);
      }

      return throwError(() => error);
    })
  );
}