const express = require("express");
const Container = require("./Container");
const container = new Container("products.json");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", "src/views");

const messages = [];

//Servidor--------------------------CLASE6
const http = require("http");
const server = http.createServer(app);

//Socket--------------------------------CLASE6-----
const io = require("socket.io")(server);

const productsRouter = require("./src/routes/productRouter");

//Routes
app.use("/api/products", productsRouter);

//Estaticos
app.use("/static", express.static(__dirname + "/public"));

app.get("/form", (req, res) => {
  res.sendFile(__dirname + "/public/form.html");
});

app.post("/products", async (req, res) => {
  const newProduct = {
    title: req.body.title,
    price: Number(req.body.price),
    thumbnail: req.body.thumbnail,
  };
  await container.save(newProduct);
  res.render("index");
});

//EJS
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/products", async (req, res) => {
  res.render("products", { data: await container.getAll() });
});

//WEBSOCKET---------------------------------------

//PORDUCTOS----------------------------------------
io.on("connection", async (socket) => {
  console.log("cliente conectado");
  socket.emit("msg_client", "Soy el back");

  io.sockets.emit("sendProducts", await container.getAll());

  socket.on("addProducts", async (data) => {
    await container.save(data);
    io.sockets.emit("sendProducts", await container.getAll());
  });

  //CHAT------------------------------------------
  socket.on("sendMessage", (data) => {
    messages.push(data);
    console.log(data, "msg del back");

    io.sockets.emit("messages_back", messages);
  });
});

const port = 8081;
server.listen(port, () => {
  console.log(`Server escuchando al puerto ${port}`);
});

server.on("error", (error) => console.log(`Error en el servidor ${error}`));
