import TestTaskLists from "@/components/ServerFetchingTestTaskLists";

async function fetchData() {
  try {
    const response = await fetch("http://localhost:8080/task-lists");
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching: ", error);
  }
}

export default async function Home() {
  const taskLists = await fetchData();
  return (
    <main className="flex min-h-screen bg-gray-50 text-black">
      <TestTaskLists taskLists={taskLists} />
    </main>
  );
}
