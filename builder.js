/**
 * External Dependencies
 */
var packager = require( 'electron-packager' );
var fs = require( 'fs' );
var path = require( 'path' );

/**
 * Internal dependencies
 */
var config = require( './resources/lib/config' );
var builder = require( './resources/lib/tools' );
var pkg = require( './package.json' );

/**
 * Module variables
 */
var electronVersion = pkg.devDependencies['electron-prebuilt'].replace( '^', '' );
var key;

var opts = {
	dir: './',
	name: config.name,
	author: config.author,
	platform: builder.getPlatform( process.argv ),
	arch: builder.getArch( process.argv ),
	version: electronVersion,
	appVersion: config.version,
	appSign: 'Developer ID Application: ' + config.author,
	out: './release',
	icon: builder.getIconFile( process.argv ),
	'app-bundle-id': config.bundleId,
	'helper-bundle-id': config.bundleId,
	'app-category-type': 'public.app-category.social-networking',
	'app-version': config.version,
	'build-version': config.version,
	ignore: [],
	overwrite: true,
	asar: false,
	sign: false,
	'version-string': {
		CompanyName: config.author,
		LegalCopyright: config.copyright,
		ProductName: config.name,
		InternalName: config.name,
		FileDescription: config.name,
		OriginalFilename: config.name,
		FileVersion: config.version,
		ProductVersion: config.version
	}
};

function whitelistInDirectory( directory, whitelist ) {
	var client = fs.readdirSync( directory );
	var ignore = [];

	for ( key = 0; key < client.length; key++ ) {
		if ( whitelist.indexOf( client[key] ) === -1 ) {
			ignore.push( path.join( directory, client[key] ) );
		}
	}

	return ignore;
}

opts.ignore = opts.ignore.concat( whitelistInDirectory( './dist', [ 'index.html', 'app.js', 'manifest.appcache' ] ) );
opts.ignore = opts.ignore.concat( whitelistInDirectory( './', [ 'package.json', 'dist', 'desktop' ] ) );

builder.beforeBuild( __dirname, opts, function( error ) {
	if ( error ) {
		throw error;
	}

	packager( opts, function( err ) {
		if ( err ) {
			console.log( error );
		} else {
			builder.cleanUp( path.join( __dirname, 'release' ), opts );
		}
	} );
} )
