export async function addAnnouncement(data: any) {
  try {
    const res = await fetch("/api/announcements/add", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (error) {
    console.error("[ ADD_ANNOUNCEMENT_ERROR]", error);
    return { error: "Something went wrong!" };
  }
}
