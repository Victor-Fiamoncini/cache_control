import { LocalLoadPurchasesService } from '@data/services'
import { CacheStoreSpy } from '@tests/data/mocks'

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

describe('LocalValidatePurchases', () => {
	test('should not delete or insert cache on sut.init', () => {
		const { cacheStore } = makeSut()

		expect(cacheStore.actions).toEqual([])
	})

	test('should delete cache if load fails', () => {
		const { cacheStore, sut } = makeSut()

		cacheStore.simulateFetchError()
		sut.loadPurchases()

		expect(cacheStore.actions).toEqual([
			CacheStoreSpy.Action.fetch,
			CacheStoreSpy.Action.delete,
		])
		expect(cacheStore.deleteKey).toEqual('purchases')
	})
})
