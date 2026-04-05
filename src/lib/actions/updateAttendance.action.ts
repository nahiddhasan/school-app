export async function updateAttendance(data: any) {
  try {
    const res = await fetch("/api/attendance/update", {
      method: "PUT",
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (error) {
    console.error("[ UPDATE_ATTENDANCE_ERROR]", error);
    return { error: "Something went wrong!" };
  }
}
