export const studies = [
  {
    title: "B.S. in Computer Science",
    institution: "State University",
    description:
      "Core CS foundations: data structures, algorithms, operating systems, networking, and databases; team capstone in web systems.",
    tags: [
      "Algorithms",
      "Data Structures",
      "Operating Systems",
      "Databases",
      "Networking",
    ],
  },
  {
    title: "M.S. in Software Engineering",
    institution: "Tech Institute",
    description:
      "Focus on distributed systems, testing strategies, and cloud architecture; thesis on resilience patterns in microservices.",
    tags: [
      "Distributed Systems",
      "Cloud Architecture",
      "Testing",
      "Microservices",
    ],
  },
];

export type StudyItem = (typeof studies)[number];

