import puppeteer from 'puppeteer'
import { times } from 'ramda'
import path from 'path'
import { mkdirpSync } from 'fs-extra'

const ERROR = 10
const ITERATIONS = 10
const SAMPLE_SIZE = 500
const OFFSET_FRAMES = 2

mkdirpSync('./tmp')

const compare = async (optionA: string, optionB: string, targetRelativePerformance: number, measureTimeout: number) => {
  if (!optionA || !optionB) {
    console.log('Missing options to compare.')
    process.exit(1)
  }

  if (!(targetRelativePerformance > 0)) {
    console.log('Invalid target performance.')
    process.exit(1)
  }

  // Puppeteer doesn't really have a `launch` named export.
  // eslint-disable-next-line import/no-named-as-default-member
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
  })

  interface TraceEvent {
    name: string
    dur: number
  }

  const runExample = async (example: string, iteration: number): Promise<number> => {
    const traceFile = `./tmp/${example}-${iteration}.json`
    const page = await browser.newPage()
    const filename = path.join(__dirname, './dist', `${example}.html`)
    await page.goto(`file://${filename}`)

    await timeout(100)

    await page.tracing.start({ path: traceFile })

    await timeout(measureTimeout)

    await page.tracing.stop()

    const { traceEvents } = require(traceFile)

    const events = traceEvents.filter(
      (event: TraceEvent) => event.name === 'FireAnimationFrame' || event.name === 'MinorGC',
    )
    const sampledEvents = events.slice(OFFSET_FRAMES, SAMPLE_SIZE + OFFSET_FRAMES)

    const totalTime = sampledEvents.reduce((total: number, event: TraceEvent) => total + event.dur, 0)

    if (sampledEvents.length !== SAMPLE_SIZE) {
      console.log(`Not enough samples. Measured "${events.length}" of target "${SAMPLE_SIZE}".`)
      process.exit(1)
    }

    await page.close()

    return totalTime
  }

  const compareExamples = async (iteration: number): Promise<[number, number]> => {
    const optionAResult = await runExample(optionA, iteration)
    const optionBResult = await runExample(optionB, iteration)
    return [optionAResult, optionBResult]
  }

  const iterations = await times((iteration) => iteration, ITERATIONS).reduce(async (previous, iteration) => {
    const previousResult = await previous
    const result = await compareExamples(iteration)

    console.log(
      `Iteration ${iteration}: \t${result[0]}\t${result[1]}\t${calculateRelativePerformance(result).toFixed(2)}%`,
    )

    return [...previousResult, result]
  }, Promise.resolve<[number, number][]>([]))

  const totalTimes = iterations.reduce((totals, current) => [totals[0] + current[0], totals[1] + current[1]], [0, 0])
  const relativePerformance = calculateRelativePerformance(totalTimes)

  console.log(`Relative performance ${optionA}/${optionB}:`, relativePerformance.toFixed(2))

  if (relativePerformance > targetRelativePerformance + ERROR) {
    console.log('Unable to reach target performance number.')
    process.exit(1)
  }

  await browser.close()
}

const calculateRelativePerformance = ([a, b]: [number, number]) => (a / b) * 100

const timeout = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

if (process.argv.length < 5) {
  console.log('Missing arguments. Ex: yarn compare toggleRealisticClassFacet toggleRealisticClassState 20')
  process.exit(1)
}

compare(process.argv[2], process.argv[3], parseInt(process.argv[4], 10), parseInt(process.argv[5], 10) || 10000)
