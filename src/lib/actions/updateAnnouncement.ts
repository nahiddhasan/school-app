export async function updateAnnouncemnt(data: any, id: string) {
  try {
    const res = await fetch(`/api/announcemens/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (error) {
    console.error("[UPDATE_ANNOUNCEMENT_ERROR]", error);
    return { error: "Something went wrong!" };
  }
}
