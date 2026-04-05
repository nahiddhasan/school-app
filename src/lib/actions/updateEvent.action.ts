export async function updateEvent(data: any, id: string) {
  try {
    const res = await fetch(`/api/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (error) {
    console.error("[UPDATE_EVENT_ERROR]", error);
    return { error: "Something went wrong!" };
  }
}
