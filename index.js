import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import path from "path";
import url from "url";
import fs from "fs";
import morgan from "morgan";

const app = express();
const __dirName = path.dirname(url.fileURLToPath(import.meta.url));
const logStream = fs.createWriteStream(path.join(__dirName, "logging.log"));
const listPost = [];
var id=0;

const test = {
  postId: id,
  category: "category",
  title: "title",
  description: "description",
  content: "content",
  author: "author",
  date: new Date(),
};

listPost.push(test);

app.set("port", process.env.PORT || 3000);
app.set("template-engine", "ejs");

app.use(morgan("common", { stream: logStream }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

function findPostById(postId) {
  return listPost.find((post) => post.postId == postId);
}

app.get("/", (req, res) => {
  res.render("index.ejs", { listPost });
});

app.get("/post/:postId", (req, res) => {
  const post = findPostById(req.params.postId);
  res.render("post-view.ejs", { post });
});
app.get("/post-create", (req, res) => {
  res.render("post-create.ejs");
});

app.get("/post-update", (req, res) => {
  const post = findPostById(req.query["postId"]);
  res.render("post-update.ejs", { post });
});

app.post("/post", (req, res) => {
  id++;
  const post = {
    postId: id,
    category: req.body["category"],
    title: req.body["title"],
    description: req.body["description"],
    content: req.body["content"],
    author: req.body["author"],
    date: new Date(),
  };
  listPost.push(post);
  res.redirect(303, `/post/${post.postId}`);
});

app.put("/post", (req, res) => {
  const post = findPostById(req.body["postId"]);
  console.log(req.body["postId"]);
  if (post) {
    post.title = req.body["title"];
    post.category = req.body["category"];
    post.description = req.body["description"];
    post.content = req.body["content"];
    post.author = req.body["author"];
    post.date = new Date();
    res.redirect(303, `/post/${post.postId}`);
  } else {
    res.sendStatus(404);
  }
});

app.delete("/post", (req, res) => {
  console.log(req.body["postId"]);
  const postIndex = listPost.findIndex(
    (post) => (post.postId == req.body["postId"])
  );
  if (postIndex != -1) {
    listPost.splice(postIndex, 1);
    res.redirect(303, "/");
  } else {
    res.sendStatus("404");
  }
});

app.listen(app.get("port"), () => {
  console.log(`server is running on port ${app.get("port")}`);
});
