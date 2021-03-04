import { CacheStore } from '@data/contracts'
import { LoadPurchasesUseCase, SavePurchasesUseCase } from '@domain/usecases'

// prettier-ignore
export class LocalLoadPurchasesService implements SavePurchasesUseCase, LoadPurchasesUseCase {
	private readonly key = 'purchases'

	constructor(
		private readonly cacheStore: CacheStore,
		private readonly timestamp: Date
	) {}

	async savePurchases(purchases: SavePurchasesUseCase.Params[]): Promise<void> {
		this.cacheStore.replace(this.key, {
			timestamp: this.timestamp,
			value: purchases,
		})
	}

	async loadPurchases(): Promise<LoadPurchasesUseCase.Result[]> {
		try {
			this.cacheStore.fetch(this.key)

			return []
		} catch {
			this.cacheStore.delete(this.key)

			return []
		}
	}
}
