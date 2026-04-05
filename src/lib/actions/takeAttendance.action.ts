export async function takeAttendance(data: any) {
  try {
    const res = await fetch("/api/attendance/take", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (error) {
    console.error("[ TAKE_ATTENDANCE_ERROR]", error);
    return { error: "Something went wrong!" };
  }
}
