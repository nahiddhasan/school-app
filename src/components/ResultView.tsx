"use client";
import { Result } from "@/lib/types";
import { Printer } from "lucide-react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "./ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

type props = {
  result?: Result | null;
};

const ResultView = ({ result }: props) => {
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  if (!result) {
    return;
  }

  const getPageMargins = () => {
    return `@page { margin: ${"50px"} !important; }`;
  };
  return (
    <>
      <style>{getPageMargins()}</style>

      <div ref={printRef}>
        {/* student info  */}
        <div>
          <div className="flex justify-end">
            <Button variant={"link"} onClick={handlePrint}>
              <Printer size={16} />
            </Button>
          </div>
          <h1 className="text-center font-semibold py-2">
            <span className="capitalize">{result.type}</span> Result{" "}
            {result?.year}
          </h1>
          <Table>
            <TableBody>
              <TableRow className="">
                <TableCell>Student Name</TableCell>
                <TableCell className="w-2/3">
                  {result?.student.fullName}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>StudentId </TableCell>
                <TableCell className="w-2/3">{result?.studentId}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Class </TableCell>
                <TableCell className="w-2/3">
                  {result.className} ({result?.student.section})
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Father </TableCell>
                <TableCell className="w-2/3">
                  {result?.student.fatherName}
                </TableCell>
              </TableRow>
              {result.status === "Pass" ? (
                <TableRow>
                  <TableCell>GPA </TableCell>
                  <TableCell className="w-2/3">{result?.gpa}</TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell>Status </TableCell>
                  <TableCell className="w-2/3">{result?.status}</TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell>TotalMarks </TableCell>
                <TableCell className="w-2/3">{result?.totalMarks}</TableCell>
              </TableRow>
              {result.position && (
                <TableRow>
                  <TableCell>Position </TableCell>
                  <TableCell className="w-2/3">{result?.position}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* result info  */}
        <div>
          <h1 className="text-center font-semibold py-2">Subject wise grade</h1>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-primary-base-600 text-white !py-1 w-1/2">
                  Subject Name
                </TableHead>
                <TableHead className="bg-primary-base-600 text-white !py-1">
                  Marks
                </TableHead>
                <TableHead className="bg-primary-base-600 text-white !py-1">
                  Grade
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.subjects.map((sub, i) => (
                <TableRow key={i}>
                  <TableCell className=" w-1/2">{sub.subjectName}</TableCell>
                  <TableCell className="">{sub.marks}</TableCell>
                  <TableCell className="">{sub.grade}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default ResultView;
