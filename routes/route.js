const express = require("express");
const mentorAndStudentController = require("../controller/MentorAndStudent");

const router = express.Router();

router.get("/students", mentorAndStudentController.getStudents);

router.get("/mentors", mentorAndStudentController.getStudents);

router.post("/addMentor", mentorAndStudentController.addMentors);

router.post("/addStudent", mentorAndStudentController.addStudent);

router.post("/assignMentor", mentorAndStudentController.assignMentor);

router.post("/changeMentor", mentorAndStudentController.changeMentor);

router.get(
  "/students/mentor/:mentorId",
  mentorAndStudentController.assignStudentToMentor
);

router.get("/students/:studentId", mentorAndStudentController.getStudents);

module.exports = router;
