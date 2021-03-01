export namespace SavePurchasesUseCase {
	export type Params = {
		id: string
		date: Date
		value: number
	}
}

export interface SavePurchasesUseCase {
	savePurchases(purchases: SavePurchasesUseCase.Params[]): Promise<void>
}
