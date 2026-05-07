const subjects = ["Mathematics", "Science", "History", "English", "Computer Science", "Geography"];
const statuses = ["pending", "approved", "rejected"];
const previewImages = [
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80",
];

export const demoUsers = [
  {
    id: "principal-1",
    name: "Ananya Mehta",
    email: "principal@school.edu",
    password: "password123",
    role: "principal",
  },
  {
    id: "teacher-1",
    name: "Rohan Sharma",
    email: "teacher@school.edu",
    password: "password123",
    role: "teacher",
  },
   {
    id: "teacher-2",
    name: "Meera Iyer",
    email: "teacherm@school.edu",
    password: "password123",
    role: "teacher",
  },
];

export function createMockContent(count = 240) {
  const now = Date.now();
  return Array.from({ length: count }, (_, index) => {
    const status = statuses[index % statuses.length];
    const start = now + ((index % 18) - 7) * 60 * 60 * 1000;
    const end = start + (2 + (index % 5)) * 60 * 60 * 1000;
    const teacherId = index % 4 === 0 ? "teacher-2" : "teacher-1";
    return {
      id: `content-${index + 1}`,
      teacherId,
      teacherName: teacherId === "teacher-1" ? "Rohan Sharma" : "Meera Iyer",
      title: `${subjects[index % subjects.length]} Broadcast ${index + 1}`,
      subject: subjects[index % subjects.length],
      description: "A concise visual lesson prepared for classroom display and student broadcast screens.",
      fileName: `lesson-${index + 1}.jpg`,
      fileType: "image/jpeg",
      previewUrl: previewImages[index % previewImages.length],
      status,
      startTime: new Date(start).toISOString(),
      endTime: new Date(end).toISOString(),
      rotationDuration: [10, 15, 30, 45][index % 4],
      rejectionReason: status === "rejected" ? "Please improve image clarity and align the lesson with the weekly plan." : "",
      createdAt: new Date(now - index * 36 * 60 * 1000).toISOString(),
    };
  });
}
