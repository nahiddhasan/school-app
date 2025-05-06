// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { useState } from "react";

// const classes = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
// const sections = ["A", "B", "C"];

// export default function PromotePage() {
//   const [fromClass, setFromClass] = useState("");
//   const [fromSection, setFromSection] = useState("");
//   const [toClass, setToClass] = useState("");
//   const [toSection, setToSection] = useState("");
//   const [students, setStudents] = useState<any[]>([]);

//   const handleFetchStudents = async () => {
//     if (!fromClass || !fromSection) return;
//     const res = await fetch(
//       `/api/promote/preview?class=${fromClass}&section=${fromSection}`
//     );
//     const data = await res.json();
//     setStudents(data.students || []);
//   };

//   const handlePromote = async () => {
//     const res = await fetch("/api/promote", {
//       method: "POST",
//       body: JSON.stringify({ fromClass, fromSection, toClass, toSection }),
//       headers: { "Content-Type": "application/json" },
//     });
//     const result = await res.json();
//     alert(result.message || "Promoted");
//   };

//   return (
//     <div className="p-6 space-y-4 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-bold">Promote Students</h2>

//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label>From Class</label>
//           <Select onValueChange={setFromClass}>
//             <SelectTrigger>
//               <SelectValue placeholder="Select class" />
//             </SelectTrigger>
//             <SelectContent>
//               {classes.map((c) => (
//                 <SelectItem key={c} value={c}>
//                   {c}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         <div>
//           <label>From Section</label>
//           <Select onValueChange={setFromSection}>
//             <SelectTrigger>
//               <SelectValue placeholder="Select section" />
//             </SelectTrigger>
//             <SelectContent>
//               {sections.map((s) => (
//                 <SelectItem key={s} value={s}>
//                   {s}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       <Button onClick={handleFetchStudents}>Preview Students</Button>

//       {students.length > 0 && (
//         <>
//           <h3 className="text-lg mt-6 font-semibold">Student Preview</h3>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Name</TableHead>
//                 <TableHead>Roll</TableHead>
//                 <TableHead>GPA</TableHead>
//                 <TableHead>Position</TableHead>
//                 <TableHead>Status</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {students.map((s) => (
//                 <TableRow key={s.studentId}>
//                   <TableCell>{s.fullName}</TableCell>
//                   <TableCell>{s.classRoll}</TableCell>
//                   <TableCell>{s.gpa ?? "N/A"}</TableCell>
//                   <TableCell>{s.position ?? "-"}</TableCell>
//                   <TableCell>
//                     <span
//                       className={`px-2 py-1 rounded text-white ${
//                         s.status === "PASS" ? "bg-green-500" : "bg-red-500"
//                       }`}
//                     >
//                       {s.status}
//                     </span>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>

//           <div className="grid grid-cols-2 gap-4 mt-6">
//             <div>
//               <label>To Class</label>
//               <Select onValueChange={setToClass}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select class" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {classes.map((c) => (
//                     <SelectItem key={c} value={c}>
//                       {c}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <label>To Section</label>
//               <Select onValueChange={setToSection}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select section" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {sections.map((s) => (
//                     <SelectItem key={s} value={s}>
//                       {s}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <Button className="mt-4" onClick={handlePromote}>
//             Promote Selected Students
//           </Button>
//         </>
//       )}
//     </div>
//   );
// }

import { fetchClasses } from "@/lib/actions/classes.action";
import { fetcher } from "@/lib/fetcher";
import { Suspense } from "react";
import SearchForm from "../../_components/searchFrom/SearchForm";
import EnrollmentDataTable from "./EnrollmentDataTable";
import columns from "./columns";

type searchParams = { [key: string]: string | string[] | undefined };

const fetchPromotePreview = async (searchParams: searchParams) => {
  const query = new URLSearchParams(
    searchParams as Record<string, string>
  ).toString();
  return fetcher(`/api/promote/preview?${query}`);
};

const Enrollment = async ({ searchParams }: { searchParams: searchParams }) => {
  const classes = await fetchClasses();
  const students = await fetchPromotePreview(searchParams);

  return (
    <div className="p-4 h-full overflow-y-scroll pb-14">
      <SearchForm classes={classes} />

      <Suspense fallback={<span>Loading...</span>}>
        <EnrollmentDataTable columns={columns} data={students} />
      </Suspense>
    </div>
  );
};

export default Enrollment;
