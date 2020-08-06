/**
 * External dependencies
 */

import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

addFilter(
	'woocommerce_admin_report_table',
	'plugin-domain',
	( reportTableData ) => {
		if (
			reportTableData.endpoint !== 'customers' ||
			! reportTableData.items ||
			! reportTableData.items.data ||
			! reportTableData.items.data.length
		) {
			return reportTableData;
		}

		const newHeaders = [
			...reportTableData.headers,
			{
				label: __( 'Billing Phone', 'wc-custom-customer-column' ),
				key: 'billing_phone',
			}
		];
		const newRows = reportTableData.rows.map( ( row, index ) => {
			const customer = reportTableData.items.data[ index ];
			console.log(customer);
			const newRow = [
				...row,
				{
					display: customer.billing_phone,
					value: customer.billing_phone,
				},
			];
			return newRow;
		} );

		reportTableData.headers = newHeaders;
		reportTableData.rows = newRows;

		return reportTableData;
	}
);
