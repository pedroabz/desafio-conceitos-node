const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const validateId = (request, response, next) => 
{
    const {id} = request.params;
    response.locals.repositoryIndex = repositories.findIndex(repo => repo.id === id);

    if (response.locals.repositoryIndex < 0) return response.status(400).send("Repository not found.")
    
    return next()
}

app.use('/repositories/:id', validateId)

app.get("/repositories", (request, response) => {
  response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body; 
  const repository = {id: uuid(), title, url, techs, likes:0};

  repositories.push(repository);

  response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const repositoryIndex = response.locals.repositoryIndex

  const {title, url, techs} = request.body;

  const repository = {id, title, url, techs, likes : 0} 

  repositories[repositoryIndex] = repository

  response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const repositoryIndex = response.locals.repositoryIndex

  repositories.splice(repositoryIndex,1);
  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const repositoryIndex = response.locals.repositoryIndex

  repositories[repositoryIndex].likes++   

  response.json(repositories[repositoryIndex]);
});

module.exports = app;
