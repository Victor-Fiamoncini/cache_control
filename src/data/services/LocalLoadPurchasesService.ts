import { CacheStore } from '@data/contracts'
import { LoadPurchasesUseCase, SavePurchasesUseCase } from '@domain/usecases'

// prettier-ignore
export class LocalLoadPurchasesService implements SavePurchasesUseCase, LoadPurchasesUseCase {
	private readonly key = 'purchases'

	constructor(
		private readonly cacheStore: CacheStore,
		private readonly currentDate: Date
	) {}

	async savePurchases(purchases: SavePurchasesUseCase.Params[]): Promise<void> {
		this.cacheStore.replace(this.key, {
			timestamp: this.currentDate,
			value: purchases,
		})
	}

	async loadPurchases(): Promise<LoadPurchasesUseCase.Result[]> {
		try {
			const cache = this.cacheStore.fetch(this.key)
			const maxAge = new Date(cache.timestamp)

			maxAge.setDate(maxAge.getDate() + 3)

			if (maxAge > this.currentDate) {
				return cache.value
			}

			throw new Error()
		} catch {
			this.cacheStore.delete(this.key)

			return []
		}
	}
}
