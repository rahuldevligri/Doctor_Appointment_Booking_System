import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AppoinmentSummaryService } from '../services/appoinmentSummary/appoinment-summary.service';
import axios from 'axios';

@Component({
  selector: 'app-appoinment-summary',
  templateUrl: './appoinment-summary.component.html',
  styleUrls: ['./appoinment-summary.component.css']
})
export class AppoinmentSummaryComponent implements OnInit{
  selectedCategory: string;
  selectedDoctor: string;
  selectedSlot: string;
  selectedHospital: string;
  selectedFee: number;
  selectedScheduleId: number;
  selectedDoctorId: number;
  
  constructor(private route: ActivatedRoute,
     private appoinmentSummaryService: AppoinmentSummaryService
  ) { }

  ngOnInit(){
    this.selectedCategory = this.appoinmentSummaryService.getSelectedCategory();
    this.selectedDoctor = this.appoinmentSummaryService.getSelectedDoctor();
    this.selectedSlot = this.appoinmentSummaryService.getSelectedSlot();
    this.selectedHospital = this.appoinmentSummaryService.getSelectedHospital();
    this.selectedFee = this.appoinmentSummaryService.getSelectedFee();
    this.selectedScheduleId = this.appoinmentSummaryService.getSelectedScheduleId();
    this.selectedDoctorId = this.appoinmentSummaryService.getSelectedDoctorId();
    
  }
  pay(amount: number, id: any, doctorId: any) {
    console.log('id in pay() in appointment-summary.component.ts ',id);
    console.log('amount in pay() in appointment-summary.component.ts ',amount);
    console.log('doctorID in pay() in appointment-summary.component.ts ',doctorId);
    const formData = new FormData();
    console.log('formData in pay() in appointment-summary.component.ts ',formData);
    formData.append('amount', amount.toString());

    this.createPayment(formData, amount, id, doctorId);
  }

  createPayment(formData: FormData, amount: number, id: any, doctorId: any) {
    axios.post('http://localhost:8080/api/v1/payment', formData)
      .then((response: any) => {
        const paymentId = response.data.paymentId;
        console.log('formData in createPayment() in appointment-summary.component.ts ',formData);
        console.log('amount in createPayment() in appointment-summary.component.ts ',amount);
        console.log('id in createPayment() in appointment-summary.component.ts ',id);
        console.log('doctorId in createPayment() in appointment-summary.component.ts ',doctorId);
        this.paynow(amount, paymentId, id, doctorId);
      })
      .catch((error: any) => {
        console.error('Error initiating payment:', error);
      });
  }

  paynow(amount: number, paymentId: any, id: any, doctorId: number) {
    console.log('amount in Paynow() in appointment-summary.component.ts ',amount);
    console.log('paymentId in Paynow() in appointment-summary.component.ts ',paymentId);
    console.log('id in Paynow() in appointment-summary.component.ts ',id);
    console.log('doctorId in Paynow() in appointment-summary.component.ts ',doctorId);
    const options = {
      key: 'rzp_test_QvfhRP9slPcend',
      amount: amount * 100,
      currency: 'INR',
      name: 'Zumply Health',
      image: 'https://avatars.githubusercontent.com/u/128212455?v=4',
      handler: (response: any) => {
        console.log('Payment successful', response);
        this.bookAppointment(paymentId, id, doctorId);
      },
      prefill: {
        name: '',
        email: '',
        contact: ''
      },
      notes: {
        address: 'Book Appointment'
      },
      theme: {
        color: '#F37254'
      }
    };

    const rzp = new window['Razorpay'](options);

    rzp.on('payment.failed', (response: any) => {
      console.error('Payment failed:', response.error);
      this.handlePaymentFailure(paymentId);
    });

    rzp.open();
  }

  bookAppointment(paymentId: any, id: any, doctorId: number) {
    console.log('paymentId in bookAppointment() in appointment-summary.component.ts ',paymentId);
    console.log('id in bookAppointment() in appointment-summary.component.ts ',id);
    console.log('doctorId in bookAppointment() in appointment-summary.component.ts ',doctorId);
    axios.post('http://localhost:8080/api/v1/payment/success/' + paymentId)
      .then(() => {
        return axios.post('http://localhost:8080/api/v1/appointment', {
          doctorScheduleId: id,
          doctorId: doctorId,
          paymentId: paymentId,
          status: 'booked',
          userId: window.localStorage.getItem('id')
        });
      })
      .then((response: any) => {
        console.log('Appointment booked successfully:', response.data);
        alert('Congratulations! Payment successful and appointment booked!');
        window.location.href = `/payment-summary/${paymentId}`;
      })
      .catch((error: any) => {
        console.error('Error booking appointment:', error);
        alert('Oops! There was an error booking your appointment.');
      });
  }

  handlePaymentFailure(paymentId: any) {
    axios.post(`http://localhost:8080/api/v1/payment/fail/${paymentId}`)
      .then(() => {
        alert('Oops! Payment failed.');
      })
      .catch((error: any) => {
        console.error('Error recording payment failure:', error);
      });
  }
}
//   pay(amount: number, id: any,doctorId: any){
//     const formdata = new FormData();
//     formdata.append('amount', amount.toString());
//     console.log("id in pay() appointment.summary.component ",id);
//     console.log("amount in appointment.summary.component ",amount);
//     console.log("doctorId in appointment.summary.component ",doctorId);
//     // axios.post('http://zumplyhealthh.us-east-1.elasticbeanstalk.com/api/v1/payment', formdata
//       // axios.post('http://localhost:5000/api/v1/payment', formdata
//       axios.post('http://localhost:8080/api/v1/payment', formdata)
//       .then((response: any)=>{
//       console.log("response.data in appointment.summary.component ",response.data);
//       const paymentId = response.data.paymentId;
//       console.log("paymentId in appointment.summary.component ",paymentId);
//       this.paynow(amount, paymentId, id, doctorId);
//       console.log("id in pay() appointment.summary.component ",id);
//       console.log("amount in appointment.summary.component ",amount);
//       console.log("doctorId in appointment.summary.component ",doctorId);
//       console.log("paymentId in appointment.summary.component ",paymentId);

//     }).catch((error: any)=>{
//       console.log("Error initiating payment:", error);
//     });
//   }

//   paynow(amount: number, paymentId: any, id: any, doctorId: number){
//     const options={
//       key:'rzp_test_QvfhRP9slPcend',
//       amount: amount*100,
//       currency: 'INR',
//       name: 'Zumply Health',
//       image: 'https://avatars.githubusercontent.com/u/128212455?v=4',
//       // image: 'C:\Users\DELL\RaHuL\ZumplyHealth Project\health-ui\src\assets\image\zumply_logo.ico',
//       // order_id:response.id,
//       // method:response.method,
//       handler:function(response: any){
//         console.log("razorpay_payment_id ",response.razorpay_payment_id);
//         console.log("razorpay_order_id ",response.razorpay_order_id);
//         console.log("razorpay_signature_id ",response.razorpay_signature);
//         console.log('payment successful !!', response);
//         // axios.post('http://zumplyhealthh.us-east-1.elasticbeanstalk.com/api/v1/payment/success/'+paymentId).then((response: { data: any; })=>{
//         // axios.post('http://localhost:5000/api/v1/payment/success/'+paymentId).then((response: { data: any; })=>{  
//           axios.post(`http://localhost:8080/api/v1/payment/success/${paymentId}`)
//           .then(() => { 
//             console.log("response.data in appointment.summary.component ",response.data);
//           // axios.post('http://zumplyhealthh.us-east-1.elasticbeanstalk.com/api/v1/appointment', {
//           // axios.post('http://localhost:5000/api/v1/appointment', {
//             return axios.post('http://localhost:8080/api/v1/appointment', {
//           "doctorScheduleId": id,
//           "doctorId": doctorId,
//           "paymentId": paymentId,
//           "status": "booked",
//           "userId": window.localStorage.getItem('id')
//         });
//       })
//       .then((response: any) => {
//         console.log('Appointment booked successfully:', response.data);
//         alert('Congratulations! Payment successful and appointment booked!');
//         window.location.href = `/payment-summary/${paymentId}`;
//       })
//       .catch((error: any) => {
//         console.error('Error booking appointment:', error);
//         alert('Oops! There was an error booking your appointment.');
//       });
//       },
//       "prefill": {
//       "name": "",
//       "email": "",
//       "contact": ""
//       },
//       "notes": {
//         "address": "Book Appointment"
//       },
//       "theme": {
//         "color": "#F37254"
//       },
//     };
//     const rzp=new window['Razorpay'](options);

//     rzp.on('payment.failed', (response: any) => {
//       console.log("code ",response.error.code);
//       console.log("description ",response.error.description);
//       console.log("source ",response.error.source);
//       console.log("step ",response.error.step);
//       console.log("reason ",response.error.reason);
//       console.log("orderId ",response.error.metadata.order_id);
//       console.log("paymentId ",response.error.metadata.payment_id);
//       console.error('Payment failed:', response.error);
//       console.error('Payment failed:', response.error);
//       axios.post(`http://localhost:8080/api/v1/payment/fail/${paymentId}`)
//         .then(() => {
//           alert('Oops! Payment failed.');
//         })
//         .catch((error: any) => {
//           console.error('Error recording payment failure:', error);
//         });
//     });
//     rzp.open();
//   }

// }


//OLD 

// import { Component, Input, OnInit } from '@angular/core';
// import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
// import { AppoinmentSummaryService } from '../services/appoinmentSummary/appoinment-summary.service';
// import axios from 'axios';

// @Component({
//   selector: 'app-appoinment-summary',
//   templateUrl: './appoinment-summary.component.html',
//   styleUrls: ['./appoinment-summary.component.css']
// })
// export class AppoinmentSummaryComponent implements OnInit{
//   selectedCategory: string;
//   selectedDoctor: string;
//   selectedSlot: string;
//   selectedHospital: string;
//   selectedFee: number;
//   selectedScheduleId: number;
//   selectedDoctorId: number;
  
//   constructor(private route: ActivatedRoute,
//      private appoinmentSummaryService: AppoinmentSummaryService
//   ) { }

//   ngOnInit(){

//     this.selectedCategory = this.appoinmentSummaryService.getSelectedCategory();
//     this.selectedDoctor = this.appoinmentSummaryService.getSelectedDoctor();
//     this.selectedSlot = this.appoinmentSummaryService.getSelectedSlot();
//     this.selectedHospital = this.appoinmentSummaryService.getSelectedHospital();
//     this.selectedFee = this.appoinmentSummaryService.getSelectedFee();
//     this.selectedScheduleId = this.appoinmentSummaryService.getSelectedScheduleId();
//     this.selectedDoctorId = this.appoinmentSummaryService.getSelectedDoctorId();
    
//   }
//   pay(amount: any,id: any,doctorId: any){
//     let formdata = new FormData();
//     formdata.append("amount", amount);
//     console.log("id in pay() appointment.summary.component ",id);
//     console.log("amount in appointment.summary.component ",amount);
//     console.log("doctorId in appointment.summary.component ",doctorId);
//     // axios.post('http://zumplyhealthh.us-east-1.elasticbeanstalk.com/api/v1/payment', formdata
//       // axios.post('http://localhost:5000/api/v1/payment', formdata
//       axios.post('http://localhost:8080/api/v1/payment', formdata

     
//     ).then((response: { data: any; })=>{
//       console.log("response.data in appointment.summary.component ",response.data);
//       let paymentId = response.data.paymentId;
//       console.log("paymentId in appointment.summary.component ",paymentId);
//       this.paynow(amount, paymentId,id,doctorId);
//       console.log("id in pay() appointment.summary.component ",id);
//       console.log("amount in appointment.summary.component ",amount);
//       console.log("doctorId in appointment.summary.component ",doctorId);
//       console.log("paymentId in appointment.summary.component ",paymentId);

//     }).catch((error: any)=>{
//       console.log("Error initiating payment:", error);
//     });
    
//   }

//   paynow(amount: any, paymentId: any,id: any,doctorId: number){
//     var options={
//       key:'rzp_test_QvfhRP9slPcend',
//       amount: amount*100,
//       currency: 'INR',
//       name: 'Zumply Health',
//       image: 'https://avatars.githubusercontent.com/u/128212455?v=4',
//       // image: 'C:\Users\DELL\RaHuL\ZumplyHealth Project\health-ui\src\assets\image\zumply_logo.ico',
//       // order_id:response.id,
//       // method:response.method,
//       handler:function(response: { razorpay_payment_id: any; razorpay_order_id: any; razorpay_signature: any; }){
//         console.log("razorpay_payment_id ",response.razorpay_payment_id);
//         console.log("razorpay_order_id ",response.razorpay_order_id);
//         console.log("razorpay_signature_id ",response.razorpay_signature);
//         console.log('payment successful !!');
//         // axios.post('http://zumplyhealthh.us-east-1.elasticbeanstalk.com/api/v1/payment/success/'+paymentId).then((response: { data: any; })=>{
//         // axios.post('http://localhost:5000/api/v1/payment/success/'+paymentId).then((response: { data: any; })=>{  
//           axios.post('http://localhost:8080/api/v1/payment/success/'+paymentId).then((response: { data: any; })=>{  
//             console.log("response.data in appointment.summary.component ",response.data);
//           // axios.post('http://zumplyhealthh.us-east-1.elasticbeanstalk.com/api/v1/appointment', {
//           // axios.post('http://localhost:5000/api/v1/appointment', {
//             axios.post('http://localhost:8080/api/v1/appointment', {
//           "doctorScheduleId": id,
//           "doctorId": doctorId,
//           "paymentId": paymentId,
//           "status": "booked",
//           "userId": window.localStorage.getItem('id')
//         }).then((response: { data: any; })=>{
//           console.log("respone.data ",response.data);
//         }).catch((error: any)=>{
//           console.log("error -> ", error);
//         });

//         }).catch((error: any)=>{
//           console.log("error -> ", error);
//         });
//         alert("congrates !! payment successful !!")
//         console.log("paymentId ",paymentId);
//         window.location.href = "/payment-summary/"+paymentId;
//       },
//       "prefill": {
//       "name": "",
//       "email": "",
//       "contact": ""
//       },
//       "notes": {
//         "address": "Book Appointment"
//       },
//       "theme": {
//         "color": "#F37254"
//       },
//     };
//     var rzp=new window['Razorpay'](options);

//     rzp.on('payment.failed', function (response: { error: { code: any; description: any; source: any; step: any; reason: any; metadata: { order_id: any; payment_id: any; }; }; }){
//       console.log("code ",response.error.code);
//       console.log("description ",response.error.description);
//       console.log("source ",response.error.source);
//       console.log("step ",response.error.step);
//       console.log("reason ",response.error.reason);
//       console.log("orderId ",response.error.metadata.order_id);
//       console.log("paymentId ",response.error.metadata.payment_id);
//       // axios.post('http://zumplyhealthh.us-east-1.elasticbeanstalk.com/api/v1/payment/fail/'+paymentId).then((response: { data: any; })=>{
//       // axios.post('http://localhost:5000/api/v1/payment/fail/'+paymentId).then((response: { data: any; })=>{
//       axios.post('http://localhost:8080/api/v1/payment/fail/'+paymentId).then((response: { data: any; })=>{

//         console.log("response.data ",response.data);
//         }).catch((error: any)=>{
//           console.log("error -> ", error);
//         });
//       alert("Oops payment failed !!");
//     });
//     rzp.open();
//   }

// }
