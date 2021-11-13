import { makeStore, AppStore } from '../../app/store'
import {
  fetchPlan,
  addPlan,
  updatePlan,
  deletePlan,
  IPlanDataItem,
  selectPlan,
  selectPlanById,
} from './planSlice'
import planDataImport from '../../../__mocks__/data/plan.json'

describe('planSlice', () => {
  const planData: IPlanDataItem[] = planDataImport
  const [plan] = planData
  let store: AppStore
  beforeEach(() => {
    store = makeStore()
    fetchMock.resetMocks()
  })

  describe('fetchPlan', () => {
    it('handles success', async () => {
      fetchMock.once(JSON.stringify(planData))
      await store.dispatch(fetchPlan())
      const appState = store.getState()

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(appState.plan.data).toEqual(planData)
    })

    it('handles bad status response', async () => {
      fetchMock.once(null, { status: 404 })
      await store.dispatch(fetchPlan())
      const appState = store.getState()

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(appState.plan.fetch.error).toEqual('Not Found')
    })
  })

  describe('addPlan', () => {
    it('handles success', async () => {
      fetchMock.once(JSON.stringify(plan))
      await store.dispatch(addPlan(plan))
      const appState = store.getState()

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(appState.plan.data).toEqual([plan])
    })

    it('handles bad status response', async () => {
      fetchMock.once(null, { status: 400 })
      await store.dispatch(addPlan(plan))
      const appState = store.getState()

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(appState.plan.add.error).toEqual('Bad Request')
    })
  })

  describe('updatePlan', () => {
    it('handles success', async () => {
      const modifiedPlan = {
        ...plan,
        date: '2021-11-11',
      }
      fetchMock.once(JSON.stringify([plan]))
      await store.dispatch(fetchPlan())

      fetchMock.once(JSON.stringify(modifiedPlan))
      await store.dispatch(updatePlan(modifiedPlan))
      const appState = store.getState()

      expect(fetchMock).toHaveBeenCalledTimes(2)
      expect(appState.plan.data).toEqual([modifiedPlan])
    })

    it('handles bad _id', async () => {
      const modifiedPlan = {
        ...plan,
        _id: 'badId',
      }
      fetchMock.once(JSON.stringify([plan]))
      await store.dispatch(fetchPlan())

      fetchMock.once(JSON.stringify(modifiedPlan))
      await store.dispatch(updatePlan(modifiedPlan))
      const appState = store.getState()

      expect(fetchMock).toHaveBeenCalledTimes(2)
      expect(appState.plan.data).toEqual([plan])
    })

    it('handles bad status response', async () => {
      fetchMock.once(null, { status: 400 })
      await store.dispatch(updatePlan(plan))
      const appState = store.getState()

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(appState.plan.update.error).toEqual('Bad Request')
    })
  })

  describe('deletePlan', () => {
    it('handles success', async () => {
      fetchMock.once(JSON.stringify([plan]))
      await store.dispatch(fetchPlan())

      fetchMock.once(JSON.stringify({}))
      await store.dispatch(deletePlan(plan))
      const appState = store.getState()

      expect(fetchMock).toHaveBeenCalledTimes(2)
      expect(appState.plan.data).toEqual([])
    })

    it('handles bad _id', async () => {
      const modifiedPlan = {
        ...plan,
        _id: 'badId',
      }
      fetchMock.once(JSON.stringify([plan]))
      await store.dispatch(fetchPlan())

      fetchMock.once(JSON.stringify({}))
      await store.dispatch(deletePlan(modifiedPlan))
      const appState = store.getState()

      expect(fetchMock).toHaveBeenCalledTimes(2)
      expect(appState.plan.data).toEqual([plan])
    })

    it('handles bad status response', async () => {
      fetchMock.once(null, { status: 400 })
      await store.dispatch(deletePlan(plan))
      const appState = store.getState()

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(appState.plan.delete.error).toEqual('Bad Request')
    })
  })

  describe('selectors', () => {
    it('handle selectPlan', async () => {
      fetchMock.once(JSON.stringify(planData))
      await store.dispatch(fetchPlan())
      const appState = store.getState()

      const { data } = selectPlan(appState)
      expect(data).toEqual(planData)
    })

    it('handle selectPlanById with id', async () => {
      fetchMock.once(JSON.stringify(planData))
      await store.dispatch(fetchPlan())
      const appState = store.getState()

      const plan = selectPlanById('a')(appState)
      expect(plan).toEqual(planData[0])
    })

    it('handle selectPlanById without id', async () => {
      fetchMock.once(JSON.stringify(planData))
      await store.dispatch(fetchPlan())
      const appState = store.getState()

      const plan = selectPlanById()(appState)
      expect(plan).toEqual(undefined)
    })
  })
})
