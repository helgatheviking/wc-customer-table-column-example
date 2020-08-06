<?php
/**
 * Plugin Name: WC Customer Column Example
 * Plugin URI: https://github.com/woocommerce/woocommerce-admin
 * Description: Add a column to Customers table
 * Author: Kathy Darling
 * Author URI: https://kathyisawesome.com/
 * Text Domain: wc-custom-customer-column
 * Domain Path: /languages
 * Version: 1.0.0-dev
 * Requires at least: 5.3.0
 * Requires PHP: 5.6.20
 *
 * WC requires at least: 3.6.0
 * WC tested up to: 4.3.0
 *
 * @package WC_Admin
 */

defined( 'ABSPATH' ) || exit;
/**
 * Register the JS.
 */
function kia_add_extension_register_script() {

	if ( ! class_exists( 'Automattic\WooCommerce\Admin\Loader' ) || ! \Automattic\WooCommerce\Admin\Loader::is_admin_page() ) {
		return;
	}

	$script_path       = '/build/index.js';
	$script_asset_path = dirname( __FILE__ ) . '/build/index.asset.php';
	$script_asset      = file_exists( $script_asset_path )
		? require( $script_asset_path )
		: array( 'dependencies' => array(), 'version' => filemtime( $script_path ) );
	$script_url = plugins_url( $script_path, __FILE__ );

	wp_register_script(
		'wc-custom-customer-column',
		$script_url,
		$script_asset['dependencies'],
		$script_asset['version'],
		true
	);

	wp_enqueue_script( 'wc-custom-customer-column' );
}

add_action( 'admin_enqueue_scripts', 'kia_add_extension_register_script' );



/**
 * When adding fields to a REST API response, we need to update the schema
 * to reflect these changes. Not only does this let API consumers know of
 * the new fields, it also adds them to Report Exports.
 *
 * @param array $properties The endpoint item schema properties.
 * @return array Filtered schema.
 */
function kia_add_customer_extended_attributes_schema( $properties ) {
	$properties['properties']['billing_phone'] = array(
		'type'        => 'string',
		'readonly'    => true,
		'context'     => array( 'view', 'edit' ),
		'description' => __( 'Customer billing phone', 'wc-customer-column' ),
	);

	return $properties;
}

add_filter( 'woocommerce_rest_report_customers_schema', 'kia_add_customer_extended_attributes_schema' );



/**
 * Add field to a REST API report response.
 * 
 * @param WP_REST_Response $response The response object.
 * @param object           $report   The original report object.
 * @param WP_REST_Request  $request  Request used to generate the response.
 * @return WP_REST_Response
 */
function kia_add_report_customer_response( $response, $report, $request ) {

	$billing_phone = get_user_meta( $report['user_id'], 'billing_phone', true );
	$billing_phone = $billing_phone ? $billing_phone : '';

	$response->data['billing_phone'] = $billing_phone;

	return $response;
}
add_filter( 'woocommerce_rest_prepare_report_customers', 'kia_add_report_customer_response', 10, 3 );
