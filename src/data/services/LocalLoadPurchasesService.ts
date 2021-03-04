import { CachePolicy, CacheStore } from '@data/contracts'
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

			if (CachePolicy.validate(cache.timestamp, this.currentDate)) {
				return cache.value
			}

			this.cacheStore.delete(this.key)

			return []
		} catch {
			return []
		}
	}

	validate(): void {
		try {
			this.cacheStore.fetch(this.key)
		} catch {
			this.cacheStore.delete(this.key)
		}
	}
}
