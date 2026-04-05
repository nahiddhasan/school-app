export const importResults = async (
  file: File,
  className: string,
  section: string,
  examType: string
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("className", className);
  formData.append("section", section);
  formData.append("examType", examType);

  const res = await fetch("/api/result/import", {
    method: "POST",
    body: formData,
  });

  return res.json();
};
