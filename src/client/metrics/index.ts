import Counter from './Counter'
import { counterID } from './config'
import { v4 as uuidv4 } from 'uuid'
import { getTTFB, getLCP, getFID, getFCP, getCLS } from 'web-vitals'

// Сдесь выполняем инициализацию и отправку первостепенных метрик

const counter = new Counter()

window.__initialCounter = counter
window.__counter = Counter

counter.init(counterID, uuidv4(), globalThis.location.pathname)
counter.setAdditionalParams({
  platform: navigator.platform,
  userAgent: navigator.userAgent,
  enviroment: process.env.NODE_ENV || 'development',
})

counter.send(
  'connect',
  performance.timing.connectEnd - performance.timing.connectStart
)

window.addEventListener(
  'load',
  () => {
    counter.send(
      'pageloadtime',
      performance.timing.loadEventStart - performance.timing.navigationStart
    )

    const loadedResources = performance.getEntriesByType('resource')
    loadedResources.forEach((val) => {
      const path = new URL(val.name)

      counter.send(path.pathname, val.duration)
    })
  },
  {
    once: true,
  }
)

getTTFB((metric) => {
  counter.send('ttfb', metric.delta)
})
getLCP((metric) => {
  counter.send('lcp', metric.delta)
})
getFID((metric) => {
  counter.send('fid', metric.delta)
})
getFCP((metric) => {
  counter.send('fcp', metric.delta)
})
getCLS((metric) => {
  counter.send('cls', metric.delta)
})
