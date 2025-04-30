export async function studentAdmission(data: any) {
  try {
    const res = await fetch("/api/students/admission", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (error) {
    console.error("[STUDENT_ADMISSION_ERROR]", error);
    return { error: "Something went wrong!" };
  }
}
