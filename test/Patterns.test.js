const { strictEqual } = require('assert')
const { describe, it } = require('mocha')
const rdf = require('@rdfjs/data-model')
const GraphPattern = require('../lib/GraphPattern')
const Patterns = require('../lib/Patterns')
const SubQuery = require('../lib/SubQuery')
const TriplePattern = require('../lib/TriplePattern')
const ignoreWhitespaceEqual = require('./support/ignoreWhitespaceEqual')
const ns = require('./support/namespace')

describe('Patterns', () => {
  it('should be a constructor', () => {
    strictEqual(typeof Patterns, 'function')
  })

  it('should handle patterns with graph, path and subquery', () => {
    const observation = rdf.variable('observation')
    const humidity = rdf.variable('humidity')
    const pressure = rdf.variable('pressure')
    const graph = rdf.variable('graph')
    const temperature = rdf.variable('temperature')

    const patterns = new Patterns()

    patterns.children = [
      new TriplePattern(observation, [ns.ex.measure, ns.ex.temperature], temperature),
      new GraphPattern([
        new TriplePattern(observation, ns.ex.humidity, humidity, graph),
        new TriplePattern(observation, ns.ex.pressure, pressure, graph)
      ]),
      new TriplePattern(observation, [ns.ex.measure, ns.ex.temperature], temperature),
      new SubQuery('BIND("a" ?a)')
    ]

    const expected = `
      ?observation <http://example.org/measure>/<http://example.org/temperature> ?temperature .

      GRAPH ?graph {
        ?observation <http://example.org/humidity> ?humidity .
        ?observation <http://example.org/pressure> ?pressure .
      }

      ?observation <http://example.org/measure>/<http://example.org/temperature> ?temperature .

      {
        BIND("a" ?a)
      }
    `

    ignoreWhitespaceEqual(patterns, expected)
  })
})
