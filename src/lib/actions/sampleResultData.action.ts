export async function fetchSampleData(data: any) {
  try {
    const res = await fetch("/api/result/data", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch CSV data");
    }

    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "result_demo.csv";
    a.click();
    window.URL.revokeObjectURL(url);

    return { success: "CSV downloaded successfully!" };
  } catch (error) {
    console.error("[SAMPLE_RESULT_DATA_ERROR]", error);
    return { error: "Something went wrong while downloading CSV!" };
  }
}
