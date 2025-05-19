export async function deleteEvent(id: string) {
  try {
    const res = await fetch(`/api/events/${id}`, {
      method: "DELETE",
    });

    return await res.json();
  } catch (error) {
    console.error("[DELETE_EVENT_ERROR]", error);
    return { error: "Something went wrong!" };
  }
}
