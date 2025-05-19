"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  teacherId: string;
  classId: string;
  section: string;
  subjectId: string;
};

const dummyTeachers = [
  { id: "1", name: "Mr. Smith" },
  { id: "2", name: "Ms. Johnson" },
];

const dummyClasses = [
  { id: "class-1", name: "Class 1", sections: ["A", "B"] },
  { id: "class-2", name: "Class 2", sections: ["A", "B", "C"] },
];

const dummySubjects = [
  { id: "math", name: "Math" },
  { id: "sci", name: "Science" },
];

export default function AssignTeacherPage() {
  const { register, handleSubmit, watch } = useForm<FormValues>();
  const [submitted, setSubmitted] = useState(false);

  const selectedClassId = watch("classId");
  const selectedClass = dummyClasses.find((c) => c.id === selectedClassId);

  const onSubmit = (data: FormValues) => {
    console.log("Assigning teacher:", data);
    // POST to /api/assign-teacher or use mutation
    setSubmitted(true);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">
        Assign Teacher to Class & Section
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Teacher</label>
          <select
            {...register("teacherId")}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Teacher</option>
            {dummyTeachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Class</label>
          <select
            {...register("classId")}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Class</option>
            {dummyClasses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {selectedClass && (
          <div>
            <label className="block font-medium">Section</label>
            <select
              {...register("section")}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Section</option>
              {selectedClass.sections.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block font-medium">Subject</label>
          <select
            {...register("subjectId")}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Subject</option>
            {dummySubjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Assign Teacher
        </button>
      </form>

      {submitted && (
        <div className="mt-4 text-green-700 font-semibold">
          ✅ Teacher assigned successfully!
        </div>
      )}
    </div>
  );
}
