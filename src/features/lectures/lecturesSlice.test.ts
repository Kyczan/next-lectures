import { makeStore, AppStore } from '../../app/store'
import {
  fetchLectures,
  addLecture,
  updateLecture,
  deleteLecture,
  ILecturesDataItem,
} from './lecturesSlice'
import lecturesDataImport from '../../../__mocks__/data/lectures.json'

describe('lecturesSlice', () => {
  const lecturesData: ILecturesDataItem[] = lecturesDataImport
  const [lecture] = lecturesData
  let store: AppStore
  beforeEach(() => {
    store = makeStore()
    fetchMock.resetMocks()
  })

  describe('fetchLectures', () => {
    it('handles success', async () => {
      fetchMock.once(JSON.stringify(lecturesData))
      await store.dispatch(fetchLectures())
      const appState = store.getState()

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(appState.lectures.data).toEqual(lecturesData)
    })

    it('handles bad status response', async () => {
      fetchMock.once(null, { status: 404 })
      await store.dispatch(fetchLectures())
      const appState = store.getState()

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(appState.lectures.fetch.error).toEqual('Not Found')
    })
  })

  describe('addLecture', () => {
    it('handles success', async () => {
      fetchMock.once(JSON.stringify(lecture))
      await store.dispatch(addLecture(lecture))
      const appState = store.getState()

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(appState.lectures.data).toEqual([lecture])
    })

    it('handles bad status response', async () => {
      fetchMock.once(null, { status: 400 })
      await store.dispatch(addLecture(lecture))
      const appState = store.getState()

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(appState.lectures.add.error).toEqual('Bad Request')
    })
  })

  describe('updateLecture', () => {
    it('handles success', async () => {
      const modifiedLecture = {
        ...lecture,
        title: 'Changed title',
      }
      fetchMock.once(JSON.stringify([lecture]))
      await store.dispatch(fetchLectures())

      fetchMock.once(JSON.stringify(modifiedLecture))
      await store.dispatch(updateLecture(modifiedLecture))
      const appState = store.getState()

      expect(fetchMock).toHaveBeenCalledTimes(2)
      expect(appState.lectures.data).toEqual([modifiedLecture])
    })

    it('handles bad _id', async () => {
      const modifiedLecture = {
        ...lecture,
        _id: 'badId',
        title: 'Changed title',
      }
      fetchMock.once(JSON.stringify([lecture]))
      await store.dispatch(fetchLectures())

      fetchMock.once(JSON.stringify(modifiedLecture))
      await store.dispatch(updateLecture(modifiedLecture))
      const appState = store.getState()

      expect(fetchMock).toHaveBeenCalledTimes(2)
      expect(appState.lectures.data).toEqual([lecture])
    })

    it('handles bad status response', async () => {
      fetchMock.once(null, { status: 400 })
      await store.dispatch(updateLecture(lecture))
      const appState = store.getState()

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(appState.lectures.update.error).toEqual('Bad Request')
    })
  })

  describe('deleteLecture', () => {
    it('handles success', async () => {
      fetchMock.once(JSON.stringify([lecture]))
      await store.dispatch(fetchLectures())

      fetchMock.once(JSON.stringify({}))
      await store.dispatch(deleteLecture(lecture))
      const appState = store.getState()

      expect(fetchMock).toHaveBeenCalledTimes(2)
      expect(appState.lectures.data).toEqual([])
    })

    it('handles bad _id', async () => {
      const modifiedLecture = {
        ...lecture,
        _id: 'badId',
        title: 'Changed title',
      }
      fetchMock.once(JSON.stringify([lecture]))
      await store.dispatch(fetchLectures())

      fetchMock.once(JSON.stringify({}))
      await store.dispatch(deleteLecture(modifiedLecture))
      const appState = store.getState()

      expect(fetchMock).toHaveBeenCalledTimes(2)
      expect(appState.lectures.data).toEqual([lecture])
    })

    it('handles bad status response', async () => {
      fetchMock.once(null, { status: 400 })
      await store.dispatch(deleteLecture(lecture))
      const appState = store.getState()

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(appState.lectures.delete.error).toEqual('Bad Request')
    })
  })
})
