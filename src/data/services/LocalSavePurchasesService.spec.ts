class LocalSavePurchasesService {
	constructor(private readonly cacheStore: CacheStore) {}

	async save(): Promise<void> {
		this.cacheStore.delete()
	}
}

interface CacheStore {
	delete(): void
}

class CacheStoreSpy implements CacheStore {
	deleteCallsCount = 0

	delete(): void {
		this.deleteCallsCount++
	}
}

describe('LocalSavePurchasesService', () => {
	test('should not delete cache on sut.init', () => {
		const cacheStore = new CacheStoreSpy()

		new LocalSavePurchasesService(cacheStore)

		expect(cacheStore.deleteCallsCount).toBe(0)
	})

	test('should delete old cache on sut.save', async () => {
		const cacheStore = new CacheStoreSpy()

		const sut = new LocalSavePurchasesService(cacheStore)

		await sut.save()

		expect(cacheStore.deleteCallsCount).toBe(1)
	})
})
