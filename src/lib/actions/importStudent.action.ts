export const importStudent = async (
  file: File,
  className: string,
  section: string
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("className", className);
  formData.append("section", section);

  const res = await fetch("/api/students/import", {
    method: "POST",
    body: formData,
  });

  return res.json();
};
