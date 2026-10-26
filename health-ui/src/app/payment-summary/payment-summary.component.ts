import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../services/payment/payment.service';
import { Payment } from '../services/payment/payment';

@Component({
  selector: 'app-payment-summary',
  templateUrl: './payment-summary.component.html',
  styleUrls: ['./payment-summary.component.css']
})

export class PaymentSummaryComponent implements OnInit {
  id: any;
  paymentList: any[] = [];
  hospitalName: string = '';
  hospitalAddress: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id'); // Retrieve 'id' from route parameters
      if (this.id) {
        this.getPaymentList(this.id); // Call method to fetch payment details
        console.log("id in payment summary page", this.id);
      } else {
        console.error('ID parameter is undefined or null');
      }
    });
    window.onpopstate = () => {
      this.router.navigate(['/home']); // Navigate to home or another page
    };
  }

  private getPaymentList(id: any) {
    this.paymentService.getPaymentList(id).subscribe(
      (data: any[]) => {
        this.paymentList = data;
        console.log("paymentList in payment summary page", this.paymentList);
        console.log("data in payment summary page", data);
        console.log("id in payment summary page", id);

        if (this.paymentList.length > 0) {
          const doctor = this.paymentList[0].doctor;
          if (doctor && doctor.hospitals && doctor.hospitals.length > 0) {
            this.hospitalName = doctor.hospitals[0].name;
            this.hospitalAddress = doctor.hospitals[0].address;
          }
        }
      },
      error => {
        console.error('Error fetching payment details:', error);
        // Handle error as needed, e.g., show error message to user
      }
    );
  }
  
   // Handle browser's back button press
   @HostListener('window:popstate', ['$event'])
   onPopState(event: any) {
     this.router.navigate(['/home']); 
   }
}

// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router'
// import { PaymentService } from '../services/payment/payment.service';
// import { Payment } from '../services/payment/payment';

// @Component({
//   selector: 'app-payment-summary',
//   templateUrl: './payment-summary.component.html',
//   styleUrls: ['./payment-summary.component.css']
// })

// export class PaymentSummaryComponent implements OnInit {
//   id: any;
//   paymentList: any[] = [];
//   hospitalName: string = '';
//   hospitalAddress: string = '';

//   constructor(private route: ActivatedRoute,
//               private paymentService: PaymentService) { }

//   ngOnInit(): void {
//     this.route.paramMap.subscribe(paramMap => {
//       this.id = paramMap.get('id'); // Retrieve 'id' from route parameters
//       if (this.id) {
//         this.getPaymentList(this.id); // Call method to fetch payment details
//         console.log("id in payment summary page", this.id);
//       } else {
//         console.error('ID parameter is undefined or null');
//       }
//     });
//   }

//   private getPaymentList(id: any) {
//     this.paymentService.getPaymentList(id).subscribe(
//       (data: any[]) => {
//         this.paymentList = data;
//         console.log("paymentList in payment summary page", this.paymentList);
//         console.log("data in payment summary page", data);
//         console.log("id in payment summary page", id);

//         if (this.paymentList.length > 0) {
//           const doctor = this.paymentList[0].doctor;
//           if (doctor && doctor.hospitals && doctor.hospitals.length > 0) {
//             this.hospitalName = doctor.hospitals[0].name;
//             this.hospitalAddress = doctor.hospitals[0].address;
//           }
//         }
//       },
//       error => {
//         console.error('Error fetching payment details:', error);
//         // Handle error as needed, e.g., show error message to user
//       }
//     );
//   }
  
// }