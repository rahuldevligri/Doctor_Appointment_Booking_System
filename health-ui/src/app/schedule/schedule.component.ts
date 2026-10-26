import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScheduleService } from '../services/schedule/schedule.service';
import { Schedule } from '../services/schedule/schedule';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Time } from '@angular/common';
import { Doctor } from '../services/doctor/doctor';
import { AppoinmentSummaryService } from '../services/appoinmentSummary/appoinment-summary.service';



@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
})

export class ScheduleComponent  { 
  doctorId: number;
  scheduleList: Schedule[] = [];
  selectedDoctor: Doctor;
  selectedSchedule: Schedule;
  fees: number;
  

  constructor(public modalRef: MdbModalRef<ScheduleComponent>,
    private scheduleService: ScheduleService, 
    private appoinmentSummaryService: AppoinmentSummaryService, 
    private router: Router
    ) { }

    ngOnInit(): void {
      this.scheduleService.getScheduleList(this.doctorId).subscribe(
        (response: any) => {
          const schedules = response.schedules;
          console.log('Schedules in ngOnInit() schedule.component.ts ', schedules);
          console.log('doctorId in ngOnInit() schedule.component.ts ',this.doctorId);
          this.formatScheduleList(schedules);
        },
        (error) => {
          console.error('Error fetching schedule:', error);
        }
      );
    }
  
    private formatScheduleList(schedules: any[]): void {
      this.scheduleList = [];
      console.log('scheduleList in formatScheduleList() schedule.component.ts ',this.scheduleList);
      schedules.forEach((schedule: any) => {
        const doctorScheduleId = schedule.doctorScheduleId;
        console.log('DoctorScheduleId:', doctorScheduleId);
        const formattedStartTime = this.formatTime(schedule.startTime);
        const formattedEndTime = this.formatTime(schedule.endTime);
        const formattedSchedule: Schedule = {
          doctorScheduleId: doctorScheduleId,
          startTime: new String(formattedStartTime),
          endTime: new String(formattedEndTime),
        };
        this.scheduleList.push(formattedSchedule);
        console.log('DoctorScheduleId:', doctorScheduleId);
        console.log('FormatedSchedule: ',formattedSchedule);
      });
    }

  private formatTime(time: String): String {
    const date = new Date(time.toString());
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = (hours % 12) || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedTime = `${formattedHours}:${formattedMinutes} ${period}`;
    return new String(formattedTime);
  }


  book(slot:any) {
    console.log('DoctorScheduleId:', slot["doctorScheduleId"]);
    console.log('Selected Id:', slot["doctorScheduleId"]);
    console.log('Selected time slot:', slot["startTime"]);
    console.log('Selected time slot:', slot["endTime"]);
    console.log("slot",slot);
    console.log("SelectedDoctorId ",this.doctorId);
    this.appoinmentSummaryService.setSelectedSlot(slot["startTime"]+slot["endTime"]);
    this.appoinmentSummaryService.setSelectedScheduleId(slot["doctorScheduleId"]);
    this.appoinmentSummaryService.setSelectedDoctorId(this.doctorId);
    this.router.navigate(['/summary']
     ,{
      queryParams: {
        category: 'selectedCategory',
        doctor:'selectedDoctor',
        schedule: 'selectedSlot',
        scheduleId: 'selectedScheduleId'
      }
    }
    );
    this.modalRef?.close();
  }
}