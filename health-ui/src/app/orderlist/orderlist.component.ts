import { Component, OnInit } from '@angular/core';
import { Orderlist } from '../services/orderlist/orderlist';
import { OrderlistService } from '../services/orderlist/orderlist.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-orderlist',
  templateUrl: './orderlist.component.html',
  styleUrls: ['./orderlist.component.css']
})
export class OrderlistComponent implements OnInit {
  orderlist: Orderlist[] = [];
  selectedOrderId: number = 0;
  showConfirmation: boolean = false;

  // Pagination properties
  pagedOrders: Orderlist[] = [];
  currentPage: number = 1;
  pageSize: number = 10; // Number of items per page
  totalPages: number = 0;

  constructor(private orderlistService: OrderlistService) {}

  ngOnInit(): void {
    this.fetchOrderList();
  }

  fetchOrderList() {
    this.orderlistService.getAppointment()
      .pipe(
        catchError(error => {
          console.error('Error fetching orders:', error);
          // Handle error display or user feedback as needed
          return throwError(error);
        })
      )
      .subscribe((data: Orderlist[]) => {
        this.orderlist = data;
        this.totalPages = Math.ceil(this.orderlist.length / this.pageSize);
        this.updatePage();
      });
  }

  updatePage() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.pagedOrders = this.orderlist.slice(startIndex, startIndex + this.pageSize);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePage();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePage();
    }
  }

  onOptionSelected() {
    if (this.selectedOrderId === 0) {
      this.showConfirmation = false;
    } else {
      this.showConfirmation = true;
    }
  }

  confirmCancellation() {
    this.orderlistService.cancelOrder(this.selectedOrderId)
      .pipe(
        catchError(error => {
          console.error(`Error cancelling order ${this.selectedOrderId}`, error);
          // Handle error display or user feedback as needed
          return throwError(error);
        })
      )
      .subscribe(
        () => {
          console.log(`Order ${this.selectedOrderId} cancelled`);
          this.refreshOrderList();
        }
      );
  }

  cancelCancellation() {
    this.selectedOrderId = 0;
    this.showConfirmation = false;
  }

  private refreshOrderList() {
    this.orderlistService.getAppointment().subscribe((data: Orderlist[]) => {
      this.orderlist = data;
      this.totalPages = Math.ceil(this.orderlist.length / this.pageSize);
      this.updatePage();
      this.selectedOrderId = 0;
      this.showConfirmation = false;
    });
  }
}


// import { Component } from '@angular/core';
// import { Orderlist } from '../services/orderlist/orderlist';
// import { OrderlistService } from '../services/orderlist/orderlist.service';


// @Component({
//   selector: 'app-orderlist',
//   templateUrl: './orderlist.component.html',
//   styleUrls: ['./orderlist.component.css']
// })
// export class OrderlistComponent {
//   orderlist: Orderlist[] = [];
//   selectedOrderId: number = 0;
//   showConfirmation: boolean = false;

//   constructor(private orderlistService: OrderlistService) {}
    
//   ngOnInit(): void {
//     this.orderlistService.getAppointment().subscribe((data: Orderlist[]) => {
//       this.orderlist = data;
//       console.log('data ',data)
//       console.log('orderList ',this.orderlist)
//     });
//   }

//   onOptionSelected() {
//     if (this.selectedOrderId === 0) {
//       this.showConfirmation = false;
//     } else {
//       this.showConfirmation = true;
//     }
//   }

//   confirmCancellation() {
//     this.orderlistService.cancelOrder(this.selectedOrderId).subscribe(
//       () => {
//         console.log(`Order ${this.selectedOrderId} cancelled`);
//         this.orderlistService.getAppointment().subscribe((data: Orderlist[]) => {
//           this.orderlist = data;
//         });
//         this.selectedOrderId = 0;
//         this.showConfirmation = false;
//       },
//       (error) => {
//         console.error(`Error cancelling order ${this.selectedOrderId}`, error);
//       }
//     );
//   }

//   cancelCancellation() {
//     this.selectedOrderId = 0;
//     this.showConfirmation = false;
//   } 
// }