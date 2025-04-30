export async function updateStudent(
  id: string,
  selectedYearId: string,
  data: any
) {
  try {
    const res = await fetch(
      `/api/students/${id}?selectedYearId=${selectedYearId}`,
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
