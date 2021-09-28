const express = require("express");
const Tasks = require("../models/task");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
  // const task = new Tasks(req.body);
  const task = new Tasks({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

//GET /tasks?completed=true  **filter
//GET /tasks?limit=10&skip=20  **pagination
//GET /tasks?sortBy=createdAt:desc  **sorting
router.get("/tasks", auth, async (req, res) => {
  try {
    //Option1
    // const tasks = await Tasks.find({ owner: req.user._id });
    // res.send(tasks);

    //Option2
    // await req.user.populate("myTasks");
    // res.send(req.user.myTasks);

    const match = {};
    const sort = {};
    if (req.query.completed) {
      match.completed = req.query.completed === "true";
    }

    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(":");
      sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }

    await req.user.populate({
      path: "myTasks",
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      },
    });
    res.send(req.user.myTasks);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    // const task = await Tasks.findById(_id);
    const task = await Tasks.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const allowUpdates = ["description", "completed"];
  const updates = Object.keys(req.body);
  const isValid = updates.every((update) => allowUpdates.includes(update));

  if (!isValid) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    // const task = await Tasks.findById(req.params.id);
    const task = await Tasks.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();

    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    // const task = await Tasks.findByIdAndDelete(req.params.id);
    const task = await Tasks.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
