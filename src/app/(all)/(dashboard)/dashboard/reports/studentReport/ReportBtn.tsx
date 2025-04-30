"use client";
import { Button } from "@/components/ui/button";
import { StudentType } from "@/lib/types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ReportBtn = ({ data }: { data: StudentType[] }) => {
  const handleDownload = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    var before = "text before";
    doc.text(before, 14, 30);
    let newArr = [];
    data.forEach((el) => {
      newArr.push([el.fullName, el.className, el.classRoll, el.section]);
    });

    autoTable(doc, {
      showHead: "everyPage",
      startY: 150,
      head: [["Name", "Class", "Roll", "Section"]],
      body: newArr,
    });
    doc.save("table.pdf");
  };
  return <Button onClick={handleDownload}>ReportBtn</Button>;
};

export default ReportBtn;
