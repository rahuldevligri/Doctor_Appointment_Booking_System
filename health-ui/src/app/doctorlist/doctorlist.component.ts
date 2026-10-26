import { Component, OnInit } from '@angular/core';
import { Doctor } from '../services/doctor/doctor';
import { DoctorListService } from '../services/doctor/doctorlist.service';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ActivatedRoute } from '@angular/router';
import { ScheduleComponent } from '../schedule/schedule.component';
import { AppoinmentSummaryService } from '../services/appoinmentSummary/appoinment-summary.service';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctorlist.component.html',
  styleUrls: ['./doctorlist.component.css'],
})
export class DoctorlistComponent implements OnInit {
  modalRef: MdbModalRef<ScheduleComponent> | null = null;
  doctors: Doctor[];
  id: number;
  selectedDoctor: Doctor;
  isExpand = false;

  constructor(
    private doctorListService: DoctorListService,
    private route: ActivatedRoute,
    private modalService: MdbModalService,
    private appoinmentSummaryService: AppoinmentSummaryService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const idStr = paramMap.get('id');
      this.id = +idStr;  // Convert string to number using unary plus operator
      this.getDoctorsList(this.id);
    });
  }

  private getDoctorsList(id: number) {
    this.doctorListService.getDoctorsList(id).subscribe((data: Doctor[]) => {
      this.doctors = data.map((doctor) => ({
        ...doctor,
        isExpanded: false, 
      }));
    });
  }

 toggleExpand(doctor: Doctor) {
  doctor.isExpand = !doctor.isExpand;
}

  openModal(doctor) {
    this.selectedDoctor = doctor;
    console.log(doctor);
    console.log("doctor id ",doctor.id);
    console.log("Doctor Name ",doctor.fullName);
    console.log("Hospital Name ",doctor.hospitals[0].hospitalName);
    console.log("doctor Fees ",doctor.fees);
    this.appoinmentSummaryService.setSelectedDoctor(doctor.id);
    this.appoinmentSummaryService.setSelectedDoctor(doctor.fullName);
    this.appoinmentSummaryService.setSelectedHospital(doctor.hospitals[0].hospitalName); // Assuming first hospital for simplicity
    this.appoinmentSummaryService.setSelectedFee(doctor.fees);
    this.modalRef = this.modalService.open(ScheduleComponent, {
      modalClass: 'modal-lg',
      data: {
        doctorId: doctor.id
      }
    });
  }
}


// import { Component, OnInit } from '@angular/core';
// import { Doctor } from '../services/doctor/doctor';
// import { DoctorListService } from '../services/doctor/doctorlist.service';
// import { Router } from '@angular/router';
// import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
// import { ActivatedRoute } from '@angular/router'
// import { ScheduleComponent } from '../schedule/schedule.component';
// import { AppoinmentSummaryService } from '../services/appoinmentSummary/appoinment-summary.service';

// @Component({
//   selector: 'app-doctor-list',
//   templateUrl: './doctorlist.component.html',
//   styleUrls: ['./doctorlist.component.css'],
// })
// export class DoctorlistComponent implements OnInit {
//   modalRef: MdbModalRef<ScheduleComponent> | null = null;
//   doctors: Doctor[];
//   id: number;
//   selectedDoctor: Doctor;
//   hospital: any;

//   constructor(
//     private doctorListService: DoctorListService,
//     private route: ActivatedRoute,
//     private modalService: MdbModalService,
//     private appoinmentSummaryService: AppoinmentSummaryService
//   ) {}

//   ngOnInit(): void {
//     // this.id = Number(params.get('id') );
//     this.route.paramMap.subscribe((paramMap) => {
//       const idStr = paramMap.get('id');
//         this.id = +idStr;  // Convert string to number using unary plus operator
//         console.log(this.id);
//         this.getDoctorsList(this.id);
//     });
//   }
//   private getDoctorsList(id: number) {
//     this.doctorListService.getDoctorsList(id).subscribe((data: Doctor[]) => {
//       this.doctors = data;
//       console.log("data in getDOctorList() doctorlistcomponent.list",data);
//       this.doctors.forEach((doctor) => {
//           console.log(doctor.hospitalName);
//       });
//     });
//   }
//   openModal(doctor) {
//     this.selectedDoctor = doctor;
//     console.log(doctor);
//     console.log(doctor.doctorId);
//     console.log(doctor.hospitalName);
//     console.log(doctor.fee);
//     console.log(doctor.fees);
//     this.appoinmentSummaryService.setSelectedDoctor(doctor.doctorId);
//     this.appoinmentSummaryService.setSelectedDoctor(doctor.doctorName);
//     this.appoinmentSummaryService.setSelectedHospital(doctor.hospitalName);
//     this.appoinmentSummaryService.setSelectedFee(doctor.fees);
//     // this.appoinmentSummaryService.setSelectedDoctor(doctor["fullName"]);
//     // this.appoinmentSummaryService.setSelectedDoctor(doctor["doctorName"]);
//     // this.appoinmentSummaryService.setSelectedHospital(doctor["hospital"]["name"]);
//     // this.appoinmentSummaryService.setSelectedHospital(doctor.hospital["name"]);
//     // this.appoinmentSummaryService.setSelectedFee(doctor["fees"]);
//     this.modalRef = this.modalService.open(ScheduleComponent, {
//       modalClass: 'modal-lg',
//       data: {
//         doctorId: doctor.doctorId
//       }
//     });
//   }

// }

// VERY OLD

// export class DoctorlistComponent implements OnInit {
//   modalRef: MdbModalRef<ScheduleComponent> | null = null;
//   doctors: Doctor[];
//   id: string;
//   selectedDoctor: Doctor;
//   hospital: any;


//   constructor(
//     private doctorListService: DoctorListService,
//     private route: ActivatedRoute,
//     private modalService: MdbModalService,
//     private appoinmentSummaryService: AppoinmentSummaryService
//   ) {}
//   ngOnInit(): void {
//     // this.id = Number(params.get('id') );
//     this.route.paramMap.subscribe((paramMap) => {
//       this.id = paramMap.get('id');
//     });
//     console.log(this.id);
//     this.getDoctorsList(this.id);
//   }

//   private getDoctorsList(id) {
//     this.doctorListService.getDoctorsList(id).subscribe((data: Doctor[]) => {
//       this.doctors = data;
//       this.doctors.forEach((element) => {
//         console.log(element.hospital['name']);
//       });
//     });
//   }
//   openModal(doctor) {
//     this.selectedDoctor = doctor;
//     console.log(doctor);
//     console.log(doctor.hospital.name);
//     this.appoinmentSummaryService.setSelectedDoctor(doctor["fullName"]);
//     // this.appoinmentSummaryService.setSelectedHospital(doctor["hospital"]["name"]);
//     this.appoinmentSummaryService.setSelectedHospital(doctor.hospital["name"]);
//     this.appoinmentSummaryService.setSelectedFee(doctor["fees"]);
//     this.modalRef = this.modalService.open(ScheduleComponent, {
//       modalClass: 'modal-lg',
//       data: {
//         doctorId: doctor.id
//       }
//     });
//   }

// }