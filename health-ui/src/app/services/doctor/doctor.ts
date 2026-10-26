// export class Doctor {
//     id:number;
//     fullName: String;
//     name: String;
//     // hospital: String;
//     hospital: {
//         name: string;
//     };
//     rating: number;
//     registrationNumber: number;
//     doctorId: number;
//     doctorName: String;
//     startDate: Date;
//     endDate: Date;
//     fees: number;

//     hospitalName: String;
//     registrationNo: number;
    
// }

export class Doctor {
    id: number;
    fullName: string;
    doctorName: string;
    rating: number;
    registrationNumber: string;
    startDate: Date;
    endDate: Date;
    fees: number;
    hospitals: {
    //   id: number;
      hospitalName: string;
      hospitalAddress: string;
    }[];
    isExpand: boolean = false;
}