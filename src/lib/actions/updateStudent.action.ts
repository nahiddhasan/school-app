export async function updateStudent(
  studentId: number,
  selectedYearId: string,
  data: any
) {
  try {
    const res = await fetch(
      `/api/students/${studentId}?selectedYearId=${selectedYearId}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );

    return await res.json();
  } catch (error) {
    console.error("[UPDATE_STUDENT_ERROR]", error);
    return { error: "Something went wrong!" };
  }
}
