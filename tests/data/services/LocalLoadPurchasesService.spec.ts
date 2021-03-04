import { LocalLoadPurchasesService } from '@data/services'
import { CacheStoreSpy, mockPurchases } from '@tests/data/mocks'

type SutTypes = {
	sut: LocalLoadPurchasesService
	cacheStore: CacheStoreSpy
}

function makeSut(timestamp = new Date()): SutTypes {
	const cacheStoreSpy = new CacheStoreSpy()

	const sut = new LocalLoadPurchasesService(cacheStoreSpy, timestamp)

	return {
		sut,
		cacheStore: cacheStoreSpy,
	}
}

describe('LocalLoadPurchasesService', () => {
	test('should not delete or insert cache on sut.init', () => {
		const { cacheStore } = makeSut()

		expect(cacheStore.actions).toEqual([])
	})

	test('should return an empty if load fails', async () => {
		const { cacheStore, sut } = makeSut()

		cacheStore.simulateFetchError()
		const purchases = await sut.loadPurchases()

		expect(cacheStore.actions).toEqual([
			CacheStoreSpy.Action.fetch,
			CacheStoreSpy.Action.delete,
		])
		expect(purchases).toEqual([])
		expect(cacheStore.deleteKey).toEqual('purchases')
	})

	test('should return a list of purchases if cache is less than 3 days old', async () => {
		const currentDate = new Date()
		const timestamp = new Date(currentDate)

		timestamp.setDate(timestamp.getDate() - 3)
		timestamp.setSeconds(timestamp.getSeconds() + 1)

		const { cacheStore, sut } = makeSut(timestamp)

		cacheStore.fetchResult = {
			timestamp,
			value: mockPurchases(),
		}

		const purchases = await sut.loadPurchases()

		expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
		expect(cacheStore.fetchKey).toBe('purchases')
		expect(purchases).toEqual(cacheStore.fetchResult.value)
	})

	test('should return an empty list if cache is more than 3 days old', async () => {
		const currentDate = new Date()
		const timestamp = new Date(currentDate)

		timestamp.setDate(timestamp.getDate() - 3)
		timestamp.setSeconds(timestamp.getSeconds() - 1)

		const { cacheStore, sut } = makeSut(currentDate)

		cacheStore.fetchResult = {
			timestamp,
			value: mockPurchases(),
		}

		const purchases = await sut.loadPurchases()

		expect(cacheStore.actions).toEqual([
			CacheStoreSpy.Action.fetch,
			CacheStoreSpy.Action.delete,
		])
		expect(cacheStore.fetchKey).toBe('purchases')
		expect(cacheStore.deleteKey).toBe('purchases')
		expect(purchases).toEqual([])
	})
})
