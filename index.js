const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('post-data', (req, res) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))
app.use(cors())
app.use(express.static('build'))

var persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
  },
  {
    id: 5,
    name: "Song Hellas",
    number: "04-3456"
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.get('/info', (req, res) => {
  const date = new Date()
  res.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${date}</p>`)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

const generateId = () => {
  min = 1
  max = 1_000_000
  return Math.floor(Math.random() * (max - min) + min)
}

app.post('/api/persons', (req, res) => {
  console.log(req.body)
  const body = req.body
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "Name or number missing"
    })
  }
  if (persons.find(person => person.name === body.name)) {
    return res.status(400).json({
      error: "Name must be unique"
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }
  res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})