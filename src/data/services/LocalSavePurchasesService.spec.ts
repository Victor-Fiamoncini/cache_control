import { CacheStore } from '@data/contracts'
import { LocalSavePurchasesService } from '@data/services'
import { SavePurchasesUseCase } from '@domain/usecases'

class CacheStoreSpy implements CacheStore {
	deleteCallsCount = 0
	insertCallsCount = 0
	deleteKey: string
	insertKey: string
	insertValues: SavePurchasesUseCase.Params[] = []

	delete(key: string): void {
		this.deleteCallsCount++
		this.deleteKey = key
	}

	insert(key: string, value: any): void {
		this.insertCallsCount++
		this.insertKey = key
		this.insertValues = value
	}

	simulateDeleteError(): void {
		jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {
			throw new Error()
		})
	}

	simulateInsertError(): void {
		jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => {
			throw new Error()
		})
	}
}

function mockPurchases(): SavePurchasesUseCase.Params[] {
	return [
		{
			id: 'any_id_01',
			date: new Date(),
			value: 50,
		},
		{
			id: 'any_id_02',
			date: new Date(),
			value: 20,
		},
	]
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

		await sut.savePurchases(mockPurchases())

		expect(cacheStore.deleteCallsCount).toBe(1)
		expect(cacheStore.deleteKey).toBe('purchases')
	})

	test('should not insert new cache if the delete fails', () => {
		const { sut, cacheStore } = makeSut()

		cacheStore.simulateDeleteError()

		const promise = sut.savePurchases(mockPurchases())

		expect(cacheStore.insertCallsCount).toBe(0)
		expect(promise).rejects.toThrow()
	})

	test('should insert new cache if delete succeeds', async () => {
		const { sut, cacheStore } = makeSut()

		const purchases = mockPurchases()

		await sut.savePurchases(purchases)

		expect(cacheStore.deleteCallsCount).toBe(1)
		expect(cacheStore.insertCallsCount).toBe(1)
		expect(cacheStore.insertKey).toBe('purchases')
		expect(cacheStore.insertValues).toEqual(purchases)
	})

	test('should throw if insert throws', () => {
		const { sut, cacheStore } = makeSut()

		cacheStore.simulateInsertError()

		const promise = sut.savePurchases(mockPurchases())

		expect(promise).rejects.toThrow()
	})
})
