import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppoinmentSummaryService {

  private selectedCategory: string;
  private selectedDoctor: string;
  private selectedSlot: string;
  private selectedHospital: string;
  private selectedFee: number;
  private selectedScheduleId: number;
  private selectedDoctorId: number;


  constructor() { }

  setSelectedDoctorId(doctorId: number){
    this.selectedDoctorId = doctorId;
    console.log("DoctorID in appointment-summar.service.ts ", this.selectedDoctorId);
    console.log("doctorId in appointment-summar.service.ts ", doctorId);
    console.log("selectedFee in setSelectedDoctorId()  appointment-summar.service.ts ", this.selectedFee);
  }

  setSelectedFee(fee:number){
    this.selectedFee=fee
    console.log("selectedFee in appointment-summar.service.ts ", this.selectedFee);
    console.log("fee in appointment-summar.service.ts ", fee);
  }

  setSelectedCategory(category: string) {
    this.selectedCategory = category;
    console.log("selectedCategory in appointment-summar.service.ts ", this.selectedCategory);
    console.log("category in appointment-summar.service.ts ", category);
    console.log("selectedFee in setSelectedCaregory()  appointment-summar.service.ts ", this.selectedFee);
  }

  setSelectedDoctor(doctor: string) {
    this.selectedDoctor = doctor;
    console.log("selectedDoctor in appointment-summar.service.ts ", this.selectedDoctor);
    console.log("doctor in appointment-summar.service.ts ", doctor);
    console.log("selectedFee in setSelectedDoctor()  appointment-summar.service.ts ", this.selectedFee);
  }

  setSelectedSlot(slot: string) {
    this.selectedSlot = slot;
    console.log("selectedSlot in appointment-summmar.service.ts ", this.selectedSlot);
    console.log("slot in appointment-summar.service.ts ", slot);
    console.log("selectedFee in setSelectedSlot()  appointment-summar.service.ts ", this.selectedFee);
  }

  setSelectedHospital(hospital: string){
    this.selectedHospital = hospital;
    console.log("selectedHospital in appointment-summar.service.ts ", this.selectedHospital);
    console.log("hospital in appointment-summar.service.ts ", hospital);
    console.log("selectedFee in setSelectedHospital()  appointment-summar.service.ts ", this.selectedFee);
  }
  setSelectedScheduleId(scheduleId: number){
    this.selectedScheduleId = scheduleId;
    console.log("selectedScheduleId in appointment-summar.service.ts ", this.selectedScheduleId);
    console.log("ScheduleId in appointment-summar.service.ts ", scheduleId);
    console.log("selectedFee in setSelectedHospital()  appointment-summar.service.ts ", this.selectedFee);
  }
  
  getSelectedDoctorId(){
    return this.selectedDoctorId;
  }

  getSelectedFee(){
    return this.selectedFee;
  }

  getSelectedCategory() {
    return this.selectedCategory;
  }

  getSelectedDoctor() {
    return this.selectedDoctor;
  }

  getSelectedSlot() {
    return this.selectedSlot;
  }

  getSelectedHospital(){
    return this.selectedHospital;
  }

  getSelectedScheduleId(){
    return this.selectedScheduleId;
  }
}