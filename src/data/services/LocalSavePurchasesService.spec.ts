import { CacheStore } from '@data/contracts'
import { LocalSavePurchasesService } from '@data/services'

class CacheStoreSpy implements CacheStore {
	deleteCallsCount = 0
	key: string

	delete(key: string): void {
		this.deleteCallsCount++
		this.key = key
	}
}

type SutTypes = {
	sut: LocalSavePurchasesService
	cacheStore: CacheStoreSpy
}

function makeSut(): SutTypes {
	const cacheStoreSpy = new CacheStoreSpy()

	const sut = new LocalSavePurchasesService(cacheStoreSpy)

	return {
		sut,
		cacheStore: cacheStoreSpy,
	}
}

describe('LocalSavePurchasesService', () => {
	test('should not delete cache on sut.init', () => {
		const { cacheStore } = makeSut()

		expect(cacheStore.deleteCallsCount).toBe(0)
	})

	test('should delete old cache on sut.save', async () => {
		const { sut, cacheStore } = makeSut()

		await sut.save()

		expect(cacheStore.deleteCallsCount).toBe(1)
		expect(cacheStore.key).toBe('purchases')
	})
})
