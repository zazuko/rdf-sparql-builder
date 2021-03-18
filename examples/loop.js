/*

  This example builds a query using a loop.

*/
const rdf = require('@rdfjs/data-model')
const namespace = require('@rdfjs/namespace')
const sparql = require('..')

const ns = {
  ex: namespace('http://example.org/'),
  rdf: namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#type')
}

const observation = rdf.variable('observation')
const date = rdf.variable('date')
const temperature = rdf.variable('temperature')

const someArray = [
  [observation, ns.rdf.type, ns.ex.Observation],
  [observation, ns.ex.date, date],
  [observation, ns.ex.temperature, temperature]
]

const unions = someArray.map((q) => {
  return [sparql.select(['*']).where([q]).limit(10)]
})

const query = sparql
  .select([observation, date, temperature])
  .where([sparql.union(unions)])

console.log(query.toString())
