import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { StudentType } from "@/lib/types";
type props = {
  student: StudentType;
};
const Profile = ({ student }: props) => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl mb-2">Student Details</h1>
        <Table>
          <TableBody>
            <TableRow className="">
              <TableCell>Admition Date:</TableCell>
              <TableCell className="w-2/3">{student.doa}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Date of Birth: </TableCell>
              <TableCell className="w-2/3">{student.dob}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Mobile: </TableCell>
              <TableCell className="w-2/3">{student.mobile}</TableCell>
            </TableRow>{" "}
            <TableRow>
              <TableCell>Others: </TableCell>
              <TableCell className="w-2/3">{student.others}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div>
        <h1 className="text-2xl mb-2">Address</h1>
        <Table>
          <TableBody>
            <TableRow className="">
              <TableCell>Address:</TableCell>
              <TableCell className="w-2/3">{student.address}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div>
        <h1 className="text-2xl mb-2">Parents</h1>
        <Table>
          <TableBody>
            <TableRow className="">
              <TableCell>Father Name:</TableCell>
              <TableCell className="w-2/3">{student.fatherName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Mother Name: </TableCell>
              <TableCell className="w-2/3">{student.motherName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Father Phone: </TableCell>
              <TableCell className="w-2/3">{student.fatherPhone}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div>
        <h1 className="text-2xl mb-2">Gurdian</h1>
        <Table>
          <TableBody>
            <TableRow className="">
              <TableCell>Gurdian Name:</TableCell>
              <TableCell className="w-2/3">{student.gurdianName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Relation: </TableCell>
              <TableCell className="w-2/3">{student.relation}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Gurdians Phone: </TableCell>
              <TableCell className="w-2/3">{student.gurdianPhone}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Profile;
