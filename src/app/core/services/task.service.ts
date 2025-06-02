import { Injectable } from "@angular/core";
import { Task } from "../models/task";
import { HttpHeaders } from "@angular/common/http";
import { catchError, map, Observable, of, throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { HttpService } from "./http.service";
import { ITaskResponse } from "../interfaces/response/ITaskResponse";
import { Country } from "../models/country";
import { TaskType } from "../models/taskType";
import { TaskStatus } from "../models/taskStatus";
import { TaskState } from "../models/taskState";
import { NotificationService } from "../../share/notification/services/notification.service";
import { Helper } from "../models/helper";

@Injectable({
  providedIn: "root",
})
export class TaskService {
  constructor(
    private http: HttpService,
    private notificationService: NotificationService
  ) {}

  getTask(token: string): Observable<Task> {
    const task: Task = {
      id: 1,
      taskState: TaskState.InProgress,
      taskStatus: TaskStatus.Unknown,
      taskType: TaskType.Unknown,
      orderTimes: [
        {
          start: new Date(),
          end: new Date(),
          isFinalAppointment: false,
        },
        {
          start: new Date(),
          end: new Date(),
          isFinalAppointment: true,
        },
        {
          start: new Date(),
          end: new Date(),
          isFinalAppointment: false,
        },
      ],
      address: {
        id: 1,
        street: "Main Street",
        number: "123",
        city: "Sample City",
        zipCode: "12345",
        country: Country.Unknown,
        longitude: 0,
        latitude: 0,
      },
      customer: {
        id: 1,
        firstName: "John",
        lastName: "Doe",
      },
      helper:{
        id: 2,
        firstName: "Aniksan",
        lastName: "Kapoor",
        profilePicture: '',
        rating: 4.88,
        ratingCount: 78,
        createdAt: new Date('2023-01-01T00:00:00Z'),
        skills: ['Windows', 'macOS', 'iOS', 'Android', 'Internet', 'Drucker', 'TV'],
      }
    };
    return of(task);
    const FullUrl = `${environment.helix.schema}://${environment.helix.host}:${environment.helix.port}/${environment.helix.path}/${token}`;
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http
      .get<ITaskResponse>(FullUrl, { headers: headers }, true)
      .pipe(
        map((response: ITaskResponse) => {
          const task: Task = {
            id: 1,
            taskState: TaskState.InProgress,
            taskStatus: TaskStatus.Unknown,
            taskType: TaskType.Unknown,
            orderTimes: [
              {
                start: new Date(),
                end: new Date(),
                isFinalAppointment: true,
              },
            ],
            address: {
              id: 1,
              street: "Main Street",
              number: "123",
              city: "Sample City",
              zipCode: "12345",
              country: Country.Unknown,
              longitude: 0,
              latitude: 0,
            },
            customer: {
              id: 1,
              firstName: "John",
              lastName: "Doe",
            },
            helper: {
              id: 2,
              firstName: "Aniksan",
              lastName: "Kapoor",
              profilePicture: '',
              rating: 4.88,
              ratingCount: 78,
              createdAt: new Date('2023-01-01T00:00:00Z'),
              skills: ['Windows', 'macOS', 'iOS', 'Android', 'Internet', 'Drucker', 'TV'],
            },
          };
          return task;
        }),
        catchError((error: any) => {
          if (error.status === 404) {
            this.notificationService.error(
              "Nicht Gefunden",
              "Es existiert kein Task mit dieser ID"
            );
          }
          console.error("Error in getTask:", error);
          return throwError(() => new Error("Error"));
        })
      );
  }
}
