const express = require("express");
const app = express();
const port = 8000;
const connection = "mongodb://localhost:27017/usersexp";
const mongoose = require("mongoose");
const User = require("./usermodel");
app.use(express.json({ limit: "50mb" }));

//connect to db
mongoose
  .connect(connection, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log("Error Connecting DB");
  });

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.json({ message: "SERVER STARTED" });
});

app.post("/createuser", (req, res) => {
  let { name, lastname, email } = req.body;
  const user = new User({
    name,
    lastname,
    email,
  });
  user.save((err, suser) => {
    if (err) {
      return res.status(422).json({ msg: "error saving user" });
    }
    res.status(200).send(suser);
  });
});

app.get("/getallusers", (req, res) => {
  User.find()
    .then((users) => {
      return res.status(200).json(users);
    })
    .catch((err) => {
      return res.status(400).json({ error: "server error" });
    });
});

app.get("/getuserbyemail", (req, res) => {
  User.find({ email: req.body.email }, (err, user) => {
    if (err) return res.status(400).json({ error: "user not found" });
    else return res.status(200).json(user);
  });
});

app.put("/updateuser", (req, res) => {
  User.findOneAndUpdate(
    req.body.email,
    req.body,
    {
      new: true,
    },
    (err, user) => {
      if (err) return res.status(400).json({ error: "failed to update user" });
      else
        return res
          .status(200)
          .json({ message: "User updated successfully", user });
    }
  );
});

app.delete("/deleteuser", (req, res) => {
  User.findOneAndDelete(req.body.email, (err, user) => {
    if (err) return res.status(400).json({ error: "failed to delete user" });
    else return res.status(200).json({ message: "User deleted successfully" });
  });
});
