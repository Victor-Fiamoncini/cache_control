import { Purchase } from '@domain/entities'

export namespace SavePurchasesUseCase {
	export type Params = Purchase
}

export interface SavePurchasesUseCase {
	savePurchases(purchases: SavePurchasesUseCase.Params[]): Promise<void>
}
