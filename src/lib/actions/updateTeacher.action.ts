export async function updateTeacher(data: any, id: number) {
  try {
    const res = await fetch(`/api/teachers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (error) {
    console.error("[UPDATE_TEACHER_ERROR]", error);
    return { error: "Something went wrong!" };
  }
}
