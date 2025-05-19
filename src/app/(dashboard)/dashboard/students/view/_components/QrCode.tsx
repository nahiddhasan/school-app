"use client";
import { StudentType } from "@/lib/types";
import QRCodeStyling from "qr-code-styling";
import { useEffect, useRef } from "react";

const QrCode = ({ student }: { student: StudentType }) => {
  const data = `Name: ${student.fullName}, Class: ${student.enrollments[0].class?.className}, Section: ${student.enrollments[0].section}, Class-Roll: ${student.enrollments[0].classRoll}, Gender: ${student.gender}, Blood-Group: ${student.bloodGroup}, Father-Name: ${student.fatherName}, Address: ${student.address}`;

  const qr = new QRCodeStyling({
    width: 120,
    height: 120,
    type: "svg",
    data: data,
    image: "",
    dotsOptions: {
      color: "#000",
      type: "rounded",
    },
    backgroundOptions: {
      color: "#ffffff",
    },
    cornersSquareOptions: {
      type: "extra-rounded",
    },
    cornersDotOptions: {
      type: "dot",
    },
  });

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      qr.append(ref.current);
    }
  }, []);

  return (
    <div className="p-2 bg-white rounded-xl shadow-lg w-fit border space-y-4">
      <div className="rounded-sm" ref={ref} />
    </div>
  );
};

export default QrCode;
