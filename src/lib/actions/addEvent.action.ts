export async function addEvent(data: any) {
  try {
    const res = await fetch("/api/events/add", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (error) {
    console.error("[ ADD_EVENT_ERROR]", error);
    return { error: "Something went wrong!" };
  }
}
