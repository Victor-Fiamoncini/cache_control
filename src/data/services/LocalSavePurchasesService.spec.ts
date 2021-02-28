class LocalSavePurchasesService {
	constructor(private readonly cacheStore: CacheStore) {}
}

interface CacheStore {}

class CacheStoreSpy implements CacheStore {
	deleteCallsCount = 0
}

describe('LocalSavePurchasesService', () => {
	test('should not delete cache on sut.init', () => {
		const cacheStore = new CacheStoreSpy()

		new LocalSavePurchasesService(cacheStore)

		expect(cacheStore.deleteCallsCount).toBe(0)
	})
})
