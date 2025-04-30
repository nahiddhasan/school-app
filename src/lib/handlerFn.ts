// import { writeFile } from "node:fs/promises";
import Papa from "papaparse";

export const parseCSV = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(results.errors);
        } else {
          resolve(results.data);
        }
      },
      error: (error) => {
        reject(error.message);
      },
    });
  });
};

//upload file
// export const uploadImage = async (file: File) => {
//   const buffer = Buffer.from(await file.arrayBuffer());
//   const filename = file.name.replaceAll(" ", "_");
//   const timestamp = new Date().getTime();
//   const fileNameWithtimestamp = timestamp + filename;
//   try {
//     const toPath = path.join(
//       process.cwd(),
//       "public/upload/" + fileNameWithtimestamp
//     );

//     await writeFile(toPath, buffer);
//     return { Message: "Success", url: `/upload/${fileNameWithtimestamp}` };
//   } catch (error) {
//     console.log("Error occured ", error);
//     return { Message: "Upload Failed" };
//   }
// };

export const marksToGrade = async (marks: number) => {
  if (marks >= 80) return "A+";
  if (marks >= 70) return "A";
  if (marks >= 60) return "B";
  if (marks >= 50) return "C";
  if (marks >= 33) return "D";
  return "F";
};
