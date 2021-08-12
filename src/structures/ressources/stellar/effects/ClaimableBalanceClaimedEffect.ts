import { ClaimableBalanceClaimed, EffectType } from 'stellar-sdk/lib/types/effects';

import { Client } from '../../../../clients';
import { Asset } from '../Asset';
import { ClaimableBalance } from '../ClaimableBalance';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Claimable Balance Claimed Effect.
 */
export class ClaimableBalanceClaimedEffect extends Effect<
	EffectTypeNames.claimableBalanceClaimed,
	EffectType.claimable_balance_claimed
> {
	/**
	 * The asset available to be claimed in the SEP-11 form `asset_code:issuing_address` or `native` (for Pi).
	 */
	public assetInfo!: string;

	/**
	 * The amount of asset that can be claimed.
	 */
	public amount!: number;

	/**
	 * The id of the claimed balance.
	 */
	public balanceId!: string;

	public constructor(client: Client, data: ClaimableBalanceClaimed) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: ClaimableBalanceClaimed): void {
		super.$patch(data);

		this.assetInfo = data.asset;
		this.amount = Number(data.amount);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.balanceId = (data as any).balance_id;
	}

	/**
	 * Get the asset if it's not `native`.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the asset instead.
	 * @returns The asset if it's not `native`.
	 */
	public async getAsset(forceUpdate = false): Promise<Asset | undefined> {
		if (this.assetInfo === 'native') {
			return;
		}

		return this.client.stellar.assets.fetch(this.assetInfo, true, !forceUpdate);
	}

	/**
	 * Get the claimed balance.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the claimed balance instead.
	 * @returns The claimed balance.
	 */
	public getClaimableBalance(forceUpdate = false): Promise<ClaimableBalance> {
		return this.client.stellar.claimableBalances.fetch(this.balanceId, true, !forceUpdate);
	}
}
