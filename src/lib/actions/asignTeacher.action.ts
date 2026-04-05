export async function asignTeacher(data: any) {
  try {
    const res = await fetch("/api/attendance/asign", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (error) {
    console.error("[ ASIGN_TEACHER_ERROR]", error);
    return { error: "Something went wrong!" };
  }
}
