export async function deleteSchedule(id: string) {
  try {
    const res = await fetch(`/api/schedules/${id}`, {
      method: "DELETE",
    });

    return await res.json();
  } catch (error) {
    console.error("[DELETE_SCHEDULE_ERROR]", error);
    return { error: "Something went wrong!" };
  }
}
