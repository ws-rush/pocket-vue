import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick, queueJob } from '../src/scheduler'

describe('scheduler', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('nextTick', () => {
    it('should execute callback in next microtask', async () => {
      const fn = vi.fn()
      nextTick(fn)

      expect(fn).not.toHaveBeenCalled()
      await vi.runAllTimers()
      expect(fn).toHaveBeenCalled()
    })

    it('should return promise that resolves in next microtask', async () => {
      let resolved = false

      const promise = nextTick(() => {
        resolved = true
      })

      expect(resolved).toBe(false)
      await promise
      expect(resolved).toBe(true)
    })
  })

  describe('queueJob', () => {
    it('should queue job and execute it', async () => {
      const job = vi.fn()
      queueJob(job)

      expect(job).not.toHaveBeenCalled()
      await vi.runAllTimers()
      expect(job).toHaveBeenCalled()
    })

    it('should not queue duplicate jobs', async () => {
      const job = vi.fn()
      queueJob(job)
      queueJob(job)

      await vi.runAllTimers()

      expect(job).toHaveBeenCalledTimes(1)
    })

    it('should execute jobs in order', async () => {
      const order: number[] = []
      const job1 = vi.fn(() => order.push(1))
      const job2 = vi.fn(() => order.push(2))
      const job3 = vi.fn(() => order.push(3))

      queueJob(job1)
      queueJob(job2)
      queueJob(job3)

      await vi.runAllTimers()
      expect(order).toEqual([1, 2, 3])
    })

    it('should handle jobs that queue more jobs', async () => {
      const job1 = vi.fn()
      const job2 = vi.fn(() => queueJob(job1))

      queueJob(job2)
      await vi.runAllTimers()

      expect(job2).toHaveBeenCalled()
      expect(job1).toHaveBeenCalled()
    })
  })
})