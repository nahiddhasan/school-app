export async function addTeacher(data: any) {
  try {
    const res = await fetch("/api/teachers/add", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (error) {
    console.error("[ ADD_EVENT_ERROR]", error);
    return { error: "Something went wrong!" };
  }
}
