export async function deleteAnnouncement(id: string) {
  try {
    const res = await fetch(`/api/announcements/${id}`, {
      method: "DELETE",
    });

    return await res.json();
  } catch (error) {
    console.error("[DELETE_ANNOUNCEMENT_ERROR]", error);
    return { error: "Something went wrong!" };
  }
}
