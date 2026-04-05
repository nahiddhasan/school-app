import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { marksToGrade } from "@/lib/handlerFn";
import { StudentType } from "@/lib/types";

const ExamResult = ({ student }: { student: StudentType }) => {
  return (
    <div className="my-4 mb-12">
      {student.results && student.results.length > 0 ? (
        student.results.map((result) => (
          <Card key={result.id} className="mb-6">
            <CardHeader className="bg-zinc-200 dark:bg-zinc-900 rounded-t-lg">
              <CardTitle className="text-xl">
                {result.type} Exam - {result.academicYear.year}
              </CardTitle>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4">
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Status
                  </p>
                  <p className="font-medium">{result.status}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    GPA
                  </p>
                  <p className="font-medium">{result.gpa}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Total Marks
                  </p>
                  <p className="font-medium">{result.totalMarks}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="p-6">
                <h4 className="text-lg font-semibold mb-4">Subject Details</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Subject</TableHead>
                      <TableHead className="text-center">Marks</TableHead>
                      <TableHead className="text-center">Grade</TableHead>
                      <TableHead className="text-center">Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.subjects.map((subject, index) => (
                      <TableRow key={subject.name + index}>
                        <TableCell className="font-medium">
                          {subject.name}
                        </TableCell>
                        <TableCell className="text-center">
                          {subject.marks}
                        </TableCell>
                        <TableCell className="text-center">
                          {marksToGrade(+subject.marks)}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>No results available.</p>
      )}
    </div>
  );
};

export default ExamResult;

{
  /* <div
            key={result.id}
            className="ring-1 p-4 rounded-md ring-zinc-800 mb-4"
          >
            <h3>
              {result.type} Exam - {result.academicYear.year}
            </h3>
            <p>
              <strong>Status:</strong> {result.status}
            </p>
            <p>
              <strong>GPA:</strong> {result.gpa}
            </p>
            <p>
              <strong>Total Marks:</strong> {result.totalMarks}
            </p>
            <p>
              <strong>Section:</strong> {result.section}
            </p>
            <h4>Subjects:</h4>
            <ul>
              {result.subjects.map((subject, index) => (
                <li key={index}>
                  {subject.name}: {subject.marks} marks
                </li>
              ))}
            </ul>
          </div> */
}
