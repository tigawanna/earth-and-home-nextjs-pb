// === start of custom type ===
  // Properties.PropertiesAmenities.amenities
  export type PropertiesAmenities = Array<{
 
  }>;
  // === end of custom type ===

/**
 * This file was @generated using typed-pocketbase
 */

// https://pocketbase.io/docs/collections/#base-collection
export interface BaseCollectionResponse {
	/**
	 * 15 characters string to store as record ID.
	 */
	id: string;
	/**
	 * Date string representation for the creation date.
	 */
	created: string;
	/**
	 * Date string representation for the creation date.
	 */
	updated: string;
	/**
	 * The collection id.
	 */
	collectionId: string;
	/**
	 * The collection name.
	 */
	collectionName: string;
}

// https://pocketbase.io/docs/api-records/#create-record
export interface BaseCollectionCreate {
	/**
	 * 15 characters string to store as record ID.
	 * If not set, it will be auto generated.
	 */
	id?: string;
}

// https://pocketbase.io/docs/api-records/#update-record
export interface BaseCollectionUpdate {}

// https://pocketbase.io/docs/collections/#auth-collection
export interface AuthCollectionResponse extends BaseCollectionResponse {
	/**
	 * The username of the auth record.
	 */
	username: string;
	/**
	 * Auth record email address.
	 */
	email: string;
	/**
	 * Auth record email address.
	 */
	tokenKey?: string;
	/**
	 * Whether to show/hide the auth record email when fetching the record data.
	 */
	emailVisibility: boolean;
	/**
	 * Indicates whether the auth record is verified or not.
	 */
	verified: boolean;
}

// https://pocketbase.io/docs/api-records/#create-record
export interface AuthCollectionCreate extends BaseCollectionCreate {
	/**
	 * The username of the auth record.
	 * If not set, it will be auto generated.
	 */
	username?: string;
	/**
	 * Auth record email address.
	 */
	email?: string;
	/**
	 * Whether to show/hide the auth record email when fetching the record data.
	 */
	emailVisibility?: boolean;
	/**
	 * Auth record password.
	 */
	password: string;
	/**
	 * Auth record password confirmation.
	 */
	passwordConfirm: string;
	/**
	 * Indicates whether the auth record is verified or not.
	 * This field can be set only by admins or auth records with "Manage" access.
	 */
	verified?: boolean;
}

// https://pocketbase.io/docs/api-records/#update-record
export interface AuthCollectionUpdate {
	/**
	 * The username of the auth record.
	 */
	username?: string;
	/**
	 * The auth record email address.
	 * This field can be updated only by admins or auth records with "Manage" access.
	 * Regular accounts can update their email by calling "Request email change".
	 */
	email?: string;
	/**
	 * Whether to show/hide the auth record email when fetching the record data.
	 */
	emailVisibility?: boolean;
	/**
	 * Old auth record password.
	 * This field is required only when changing the record password. Admins and auth records with "Manage" access can skip this field.
	 */
	oldPassword?: string;
	/**
	 * New auth record password.
	 */
	password?: string;
	/**
	 * New auth record password confirmation.
	 */
	passwordConfirm?: string;
	/**
	 * Indicates whether the auth record is verified or not.
	 * This field can be set only by admins or auth records with "Manage" access.
	 */
	verified?: boolean;
}

// https://pocketbase.io/docs/collections/#view-collection
export interface ViewCollectionRecord {
	id: string;
}

// utilities

type MaybeArray<T> = T | T[];

// ===== _mfas =====

export interface MfasResponse extends BaseCollectionResponse {
	collectionName: '_mfas';
	id: string;
	collectionRef: string;
	recordRef: string;
	method: string;
	created: string;
	updated: string;
}

export interface MfasCreate extends BaseCollectionCreate {
	id?: string;
	collectionRef: string;
	recordRef: string;
	method: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface MfasUpdate extends BaseCollectionUpdate {
	id?: string;
	collectionRef?: string;
	recordRef?: string;
	method?: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface MfasCollection {
	type: 'base';
	collectionId: string;
	collectionName: '_mfas';
	response: MfasResponse;
	create: MfasCreate;
	update: MfasUpdate;
	relations: Record<string, never>;
}

// ===== _otps =====

export interface OtpsResponse extends BaseCollectionResponse {
	collectionName: '_otps';
	id: string;
	collectionRef: string;
	recordRef: string;
	created: string;
	updated: string;
}

export interface OtpsCreate extends BaseCollectionCreate {
	id?: string;
	collectionRef: string;
	recordRef: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface OtpsUpdate extends BaseCollectionUpdate {
	id?: string;
	collectionRef?: string;
	recordRef?: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface OtpsCollection {
	type: 'base';
	collectionId: string;
	collectionName: '_otps';
	response: OtpsResponse;
	create: OtpsCreate;
	update: OtpsUpdate;
	relations: Record<string, never>;
}

// ===== _externalAuths =====

export interface ExternalAuthsResponse extends BaseCollectionResponse {
	collectionName: '_externalAuths';
	id: string;
	collectionRef: string;
	recordRef: string;
	provider: string;
	providerId: string;
	created: string;
	updated: string;
}

export interface ExternalAuthsCreate extends BaseCollectionCreate {
	id?: string;
	collectionRef: string;
	recordRef: string;
	provider: string;
	providerId: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface ExternalAuthsUpdate extends BaseCollectionUpdate {
	id?: string;
	collectionRef?: string;
	recordRef?: string;
	provider?: string;
	providerId?: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface ExternalAuthsCollection {
	type: 'base';
	collectionId: string;
	collectionName: '_externalAuths';
	response: ExternalAuthsResponse;
	create: ExternalAuthsCreate;
	update: ExternalAuthsUpdate;
	relations: Record<string, never>;
}

// ===== _authOrigins =====

export interface AuthOriginsResponse extends BaseCollectionResponse {
	collectionName: '_authOrigins';
	id: string;
	collectionRef: string;
	recordRef: string;
	fingerprint: string;
	created: string;
	updated: string;
}

export interface AuthOriginsCreate extends BaseCollectionCreate {
	id?: string;
	collectionRef: string;
	recordRef: string;
	fingerprint: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface AuthOriginsUpdate extends BaseCollectionUpdate {
	id?: string;
	collectionRef?: string;
	recordRef?: string;
	fingerprint?: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface AuthOriginsCollection {
	type: 'base';
	collectionId: string;
	collectionName: '_authOrigins';
	response: AuthOriginsResponse;
	create: AuthOriginsCreate;
	update: AuthOriginsUpdate;
	relations: Record<string, never>;
}

// ===== _superusers =====

export interface SuperusersResponse extends AuthCollectionResponse {
	collectionName: '_superusers';
	id: string;
	tokenKey: string;
	email: string;
	emailVisibility: boolean;
	verified: boolean;
	created: string;
	updated: string;
}

export interface SuperusersCreate extends AuthCollectionCreate {
	id?: string;
	email: string;
	emailVisibility?: boolean;
	verified?: boolean;
	created?: string | Date;
	updated?: string | Date;
}

export interface SuperusersUpdate extends AuthCollectionUpdate {
	id?: string;
	email?: string;
	emailVisibility?: boolean;
	verified?: boolean;
	created?: string | Date;
	updated?: string | Date;
}

export interface SuperusersCollection {
	type: 'auth';
	collectionId: string;
	collectionName: '_superusers';
	response: SuperusersResponse;
	create: SuperusersCreate;
	update: SuperusersUpdate;
	relations: Record<string, never>;
}

// ===== users =====

export interface UsersResponse extends AuthCollectionResponse {
	collectionName: 'users';
	id: string;
	tokenKey: string;
	email: string;
	emailVisibility: boolean;
	verified: boolean;
	name: string;
	avatar: string;
	is_admin: boolean;
	is_banned: boolean;
	created: string;
	updated: string;
}

export interface UsersCreate extends AuthCollectionCreate {
	id?: string;
	email: string;
	emailVisibility?: boolean;
	verified?: boolean;
	name?: string;
	avatar?: File | null;
	is_admin?: boolean;
	is_banned?: boolean;
	created?: string | Date;
	updated?: string | Date;
}

export interface UsersUpdate extends AuthCollectionUpdate {
	id?: string;
	email?: string;
	emailVisibility?: boolean;
	verified?: boolean;
	name?: string;
	avatar?: File | null;
	is_admin?: boolean;
	is_banned?: boolean;
	created?: string | Date;
	updated?: string | Date;
}

export interface UsersCollection {
	type: 'auth';
	collectionId: string;
	collectionName: 'users';
	response: UsersResponse;
	create: UsersCreate;
	update: UsersUpdate;
	relations: {
		properties_via_agent_id: PropertiesCollection[];
		properties_via_owner_id: PropertiesCollection[];
		favorites_via_user_id: FavoritesCollection[];
		property_messages_via_user_id: PropertyMessagesCollection[];
		property_messages_via_admin_id: PropertyMessagesCollection[];
	};
}

// ===== properties =====

export interface PropertiesResponse extends BaseCollectionResponse {
	collectionName: 'properties';
	id: string;
	title: string;
	description: string;
	price: number;
	listing_type: 'sale' | 'rent';
	property_type: 'house' | 'apartment' | 'condo' | 'townhouse' | 'duplex' | 'studio' | 'villa' | 'land' | 'commercial' | 'industrial' | 'farm';
	status: 'draft' | 'active' | 'pending' | 'sold' | 'rented' | 'off_market';
	location: string;
	street_address: string;
	city: string;
	state: string;
	postal_code: string;
	country: string;
	dimensions: string;
	building_size_sqft: number;
	baths: number;
	lot_size_sqft: number;
	lot_size_acres: number;
	year_built: number;
	floors: number;
	beds: number;
	parking_spaces: number;
	parking_type: '' | 'garage' | 'carport' | 'street' | 'covered' | 'assigned' | 'none';
	heating: '' | 'none' | 'electric' | 'gas' | 'oil' | 'heat_pump' | 'solar' | 'geothermal';
	cooling: '' | 'none' | 'central' | 'wall_unit' | 'evaporative' | 'geothermal';
	zoning: '' | 'residential' | 'commercial' | 'agricultural' | 'industrial' | 'mixed_use' | 'recreational' | 'other';
	currency: string;
	sale_price: number;
	rental_price: number;
	security_deposit: number;
	hoa_fee: number;
	annual_taxes: number;
	available_from: string;
	image_url: string;
	images: MaybeArray<string>;
	video_url: string;
	virtual_tour_url: string;
	amenities?: PropertiesAmenities
	features: Record<string, any> | Array<any> | null;
	utilities: Record<string, any> | Array<any> | null;
	agent_id: string;
	owner_id: string;
	is_featured: boolean;
	is_new: boolean;
	location_point: { lat: number; lon: number } | null;
	created: string;
	updated: string;
}

export interface PropertiesCreate extends BaseCollectionCreate {
	id?: string;
	title: string;
	description?: string;
	price?: number;
	listing_type: 'sale' | 'rent';
	property_type: 'house' | 'apartment' | 'condo' | 'townhouse' | 'duplex' | 'studio' | 'villa' | 'land' | 'commercial' | 'industrial' | 'farm';
	status: 'draft' | 'active' | 'pending' | 'sold' | 'rented' | 'off_market';
	location: string;
	street_address?: string;
	city?: string;
	state?: string;
	postal_code?: string;
	country?: string;
	dimensions?: string;
	building_size_sqft?: number;
	baths?: number;
	lot_size_sqft?: number;
	lot_size_acres?: number;
	year_built?: number;
	floors?: number;
	beds?: number;
	parking_spaces?: number;
	parking_type?: '' | 'garage' | 'carport' | 'street' | 'covered' | 'assigned' | 'none';
	heating?: '' | 'none' | 'electric' | 'gas' | 'oil' | 'heat_pump' | 'solar' | 'geothermal';
	cooling?: '' | 'none' | 'central' | 'wall_unit' | 'evaporative' | 'geothermal';
	zoning?: '' | 'residential' | 'commercial' | 'agricultural' | 'industrial' | 'mixed_use' | 'recreational' | 'other';
	currency?: string;
	sale_price?: number;
	rental_price?: number;
	security_deposit?: number;
	hoa_fee?: number;
	annual_taxes?: number;
	available_from?: string | Date;
	image_url?: string | URL;
	images?: MaybeArray<File>;
	video_url?: string | URL;
	virtual_tour_url?: string | URL;
	amenities?: PropertiesAmenities
	features?: Record<string, any> | Array<any> | null;
	utilities?: Record<string, any> | Array<any> | null;
	agent_id: string;
	owner_id?: string;
	is_featured?: boolean;
	is_new?: boolean;
	location_point?: { lat: number; lon: number } | null;
	created?: string | Date;
	updated?: string | Date;
}

export interface PropertiesUpdate extends BaseCollectionUpdate {
	id?: string;
	title?: string;
	description?: string;
	price?: number;
	'price+'?: number;
	'price-'?: number;
	listing_type?: 'sale' | 'rent';
	property_type?: 'house' | 'apartment' | 'condo' | 'townhouse' | 'duplex' | 'studio' | 'villa' | 'land' | 'commercial' | 'industrial' | 'farm';
	status?: 'draft' | 'active' | 'pending' | 'sold' | 'rented' | 'off_market';
	location?: string;
	street_address?: string;
	city?: string;
	state?: string;
	postal_code?: string;
	country?: string;
	dimensions?: string;
	building_size_sqft?: number;
	'building_size_sqft+'?: number;
	'building_size_sqft-'?: number;
	baths?: number;
	'baths+'?: number;
	'baths-'?: number;
	lot_size_sqft?: number;
	'lot_size_sqft+'?: number;
	'lot_size_sqft-'?: number;
	lot_size_acres?: number;
	'lot_size_acres+'?: number;
	'lot_size_acres-'?: number;
	year_built?: number;
	'year_built+'?: number;
	'year_built-'?: number;
	floors?: number;
	'floors+'?: number;
	'floors-'?: number;
	beds?: number;
	'beds+'?: number;
	'beds-'?: number;
	parking_spaces?: number;
	'parking_spaces+'?: number;
	'parking_spaces-'?: number;
	parking_type?: '' | 'garage' | 'carport' | 'street' | 'covered' | 'assigned' | 'none';
	heating?: '' | 'none' | 'electric' | 'gas' | 'oil' | 'heat_pump' | 'solar' | 'geothermal';
	cooling?: '' | 'none' | 'central' | 'wall_unit' | 'evaporative' | 'geothermal';
	zoning?: '' | 'residential' | 'commercial' | 'agricultural' | 'industrial' | 'mixed_use' | 'recreational' | 'other';
	currency?: string;
	sale_price?: number;
	'sale_price+'?: number;
	'sale_price-'?: number;
	rental_price?: number;
	'rental_price+'?: number;
	'rental_price-'?: number;
	security_deposit?: number;
	'security_deposit+'?: number;
	'security_deposit-'?: number;
	hoa_fee?: number;
	'hoa_fee+'?: number;
	'hoa_fee-'?: number;
	annual_taxes?: number;
	'annual_taxes+'?: number;
	'annual_taxes-'?: number;
	available_from?: string | Date;
	image_url?: string | URL;
	images?: MaybeArray<File>;
	'images-'?: string;
	video_url?: string | URL;
	virtual_tour_url?: string | URL;
	amenities?: PropertiesAmenities
	features?: Record<string, any> | Array<any> | null;
	utilities?: Record<string, any> | Array<any> | null;
	agent_id?: string;
	owner_id?: string;
	is_featured?: boolean;
	is_new?: boolean;
	location_point?: { lat: number; lon: number } | null;
	created?: string | Date;
	updated?: string | Date;
}

export interface PropertiesCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'properties';
	response: PropertiesResponse;
	create: PropertiesCreate;
	update: PropertiesUpdate;
	relations: {
		agent_id: UsersCollection;
		owner_id: UsersCollection;
		favorites_via_property_id: FavoritesCollection[];
		property_messages_via_property_id: PropertyMessagesCollection[];
	};
}

// ===== favorites =====

export interface FavoritesResponse extends BaseCollectionResponse {
	collectionName: 'favorites';
	id: string;
	user_id: string;
	property_id: string;
	created: string;
	updated: string;
}

export interface FavoritesCreate extends BaseCollectionCreate {
	id?: string;
	user_id: string;
	property_id: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface FavoritesUpdate extends BaseCollectionUpdate {
	id?: string;
	user_id?: string;
	property_id?: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface FavoritesCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'favorites';
	response: FavoritesResponse;
	create: FavoritesCreate;
	update: FavoritesUpdate;
	relations: {
		user_id: UsersCollection;
		property_id: PropertiesCollection;
	};
}

// ===== property_messages =====

export interface PropertyMessagesResponse extends BaseCollectionResponse {
	collectionName: 'property_messages';
	id: string;
	user_id: string;
	property_id: string;
	type: '' | 'parent' | 'reply';
	body: string;
	parent: string;
	admin_id: string;
	created: string;
	updated: string;
}

export interface PropertyMessagesCreate extends BaseCollectionCreate {
	id?: string;
	user_id: string;
	property_id: string;
	type?: '' | 'parent' | 'reply';
	body: string;
	parent?: string;
	admin_id?: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface PropertyMessagesUpdate extends BaseCollectionUpdate {
	id?: string;
	user_id?: string;
	property_id?: string;
	type?: '' | 'parent' | 'reply';
	body?: string;
	parent?: string;
	admin_id?: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface PropertyMessagesCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'property_messages';
	response: PropertyMessagesResponse;
	create: PropertyMessagesCreate;
	update: PropertyMessagesUpdate;
	relations: {
		user_id: UsersCollection;
		property_id: PropertiesCollection;
		parent: PropertyMessagesCollection;
		property_messages_via_parent: PropertyMessagesCollection[];
		admin_id: UsersCollection;
	};
}

// ===== Schema =====

export type Schema = {
	_mfas: MfasCollection;
	_otps: OtpsCollection;
	_externalAuths: ExternalAuthsCollection;
	_authOrigins: AuthOriginsCollection;
	_superusers: SuperusersCollection;
	users: UsersCollection;
	properties: PropertiesCollection;
	favorites: FavoritesCollection;
	property_messages: PropertyMessagesCollection;
};