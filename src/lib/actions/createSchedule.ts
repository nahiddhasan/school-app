export async function createSchedule(data: any) {
  try {
    const res = await fetch("/api/schedules/add", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (error) {
    console.error("[ CREATE_SCHEDULE_ERROR]", error);
    return { error: "Something went wrong!" };
  }
}
