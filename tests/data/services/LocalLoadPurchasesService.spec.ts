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

	test('should call correct key on load', async () => {
		const { cacheStore, sut } = makeSut()

		await sut.loadPurchases()

		expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
		expect(cacheStore.fetchKey).toBe('purchases')
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
})
