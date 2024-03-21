let students = [
  {
    id: 1,
    name: "Priya",
  },
  {
    id: 2,
    name: "Kiran",
    previousMentorId:2,
    CurrentMentorID:3
  },
  {
    id: 3,
    name: "Tharun",
    previousMentorId:3,
    CurrentMentorID:2
  }
]
let mentors = [
  {
    id: 1,
    name: "Bhanu",
  },
  {
    id: 2,
    name: "Ravi",
  },
  {
    id: 3,
    name: "Raghu",
    students: [
      3,
      2
    ]
  },
];