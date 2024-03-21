const mongoDB = require("mongodb");

const mongoClient = mongoDB.MongoClient;
const MONGO_URL = process.env.MONGO_URL;

let client = mongoClient.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function getStudents(req, res) {
  try {
    let db = client.db("MentorStudentAssigning");
    let data = await db.collection("students").find().toArray();
    res.send(data);
  } catch (err) {
    console.log("Error", err.message);
  }
}

async function getMentors(req, res) {
  try {
    let db = client.db("MentorStudentAssigning");
    let data = await db.collection("mentors").find().toArray();
    res.send(data);
  } catch (err) {
    console.log("Error", err.message);
  }
}

async function addMentors(req, res) {
  try {
    let db = client.db("MentorStudentAssigning");
    await db
      .collection("mentors")
      .insertOne({ id: req.body.id, name: req.body.name });
    let result2 = await db.collection("mentors").find().toArray();
    res.send(result2);
  } catch (err) {
    console.log("Error", err.message);
  }
}

async function addStudent(req, res) {
  try {
    let db = client.db("MentorStudentAssigning");
    await db
      .collection("students")
      .insertOne({ id: req.body.id, name: req.body.name });
    let display = await db.collection("students").find().toArray();
    res.send(display);
  } catch (err) {
    console.log("Error", err.message);
  }
}

async function assignMentor(req, res) {
  let mentorId = req.body.mentorId;
  let studentId = req.body.studentId;

  try {
    let db = client.db("MentorStudentAssigning");
    await db
      .collection("students")
      .updateOne(
        { id: { $eq: studentId } },
        { $set: { CurrentMentorID: mentorId } }
      );
    await db
      .collection("mentors")
      .updateOne(
        { id: { $eq: mentorId }, students: { $ne: studentId } },
        { $push: { students: studentId } }
      );
    let unassignedstudents = await db
      .collection("students")
      .find({
        $or: [
          { CurrentMentorID: { $exists: false } },
          { CurrentMentorID: { $eq: "" } },
        ],
      })
      .toArray();
    res.send(unassignedstudents);
  } catch (err) {
    console.log("Error", err.message);
  }
}

async function changeMentor(req, res) {
  let mentorId = req.body.mentorId;
  let studentId = req.body.studentId;

  try {
    let db = client.db("MentorStudentAssigning");
    let getData = await db
      .collection("students")
      .findOne({ id: { $eq: studentId } });
    if (getData && getData.CurrentMentorID) {
      await db
        .collection("students")
        .updateOne(
          { id: { $eq: studentId } },
          { $set: { previousMentorId: getData.CurrentMentorID } }
        );
    }
    let studentRec = await db
      .collection("students")
      .findOne({ id: { $eq: studentId } });
    await db
      .collection("students")
      .updateOne(
        { id: { $eq: studentId } },
        { $set: { CurrentMentorID: mentorId } }
      );
    await db
      .collection("mentors")
      .updateOne(
        { id: { $eq: studentRec.CurrentMentorID } },
        { $pull: { students: studentId } }
      );
    await db
      .collection("mentors")
      .updateOne(
        { id: { $eq: mentorId }, students: { $ne: studentId } },
        { $push: { students: studentId } }
      );
    let data = await db
      .collection("students")
      .find({ id: { $eq: studentId } })
      .toArray();
    res.send(data);
  } catch (err) {
    console.log("Error", err.message);
  }
}

async function assignStudentToMentor(req, res) {
  try {
    let db = client.db("MentorStudentAssigning");
    let data = await db
      .collection("students")
      .find({ CurrentMentorID: Number(req.params.mentorId) })
      .toArray();
    res.send(data);
  } catch (err) {
    console.log("Error", err.message);
  }
}

async function ChangeMentorForParticularStudent(req, res) {
  try {
    let db = client.db("MentorStudentAssigning");
    let previousMentors = await db
      .collection("students")
      .find({
        $and: [
          { previousMentorId: { $exists: true } },
          { id: Number(req.params.studentId) },
        ],
      })
      .toArray();
    let previousMentorIds = previousMentors.map(
      (mentor) => mentor.previousMentorId
    );
    res.send("previousMentorIds:" + previousMentorIds);
  } catch (err) {
    console.log("Error", err.message);
  }
}

module.exports = {
  getStudents,
  getMentors,
  addMentors,
  addStudent,
  assignMentor,
  changeMentor,
  assignStudentToMentor,
  ChangeMentorForParticularStudent,
};
