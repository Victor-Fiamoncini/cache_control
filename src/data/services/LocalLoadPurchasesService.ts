import { CacheStore } from '@data/contracts'
import { SavePurchasesUseCase } from '@domain/usecases'

export class LocalLoadPurchasesService implements SavePurchasesUseCase {
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

	async loadPurchases(): Promise<void> {
		this.cacheStore.fetch(this.key)
	}
}
