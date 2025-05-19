export async function updateSchedule(data: any, id: string) {
  try {
    const res = await fetch(`/api/schedules/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (error) {
    console.error("[UPDATE_SCHEDULE_ERROR]", error);
    return { error: "Something went wrong!" };
  }
}
