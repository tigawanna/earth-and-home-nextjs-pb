import { z } from 'zod';


// Base schemas for common PocketBase fields
const baseResponseSchema = z.object({
    id: z.string(),
    created: z.string(),
    updated: z.string(),
    collectionId: z.string(),
    collectionName: z.string(),
});

const baseCreateSchema = z.object({
    id: z.string().optional(),
});

const baseUpdateSchema = z.object({});

const authResponseSchema = baseResponseSchema.extend({
    username: z.string(),
    email: z.string(),
    tokenKey: z.string().optional(),
    emailVisibility: z.boolean(),
    verified: z.boolean(),
});

const authCreateSchema = baseCreateSchema.extend({
    username: z.string().optional(),
    email: z.string().optional(),
    emailVisibility: z.boolean().optional(),
    password: z.string(),
    passwordConfirm: z.string(),
    verified: z.boolean().optional(),
});

const authUpdateSchema = z.object({
    username: z.string().optional(),
    email: z.string().optional(),
    emailVisibility: z.boolean().optional(),
    oldPassword: z.string().optional(),
    password: z.string().optional(),
    passwordConfirm: z.string().optional(),
    verified: z.boolean().optional(),
});

// ===== _mfas =====

export const MfasResponseSchema = baseResponseSchema.extend({
    collectionName: z.literal('_mfas'),
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    collectionRef: z.string(),
    recordRef: z.string(),
    method: z.string(),
    created: z.string().optional(),
    updated: z.string().optional()
});

export const MfasCreateSchema = baseCreateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    collectionRef: z.string(),
    recordRef: z.string(),
    method: z.string(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

export const MfasUpdateSchema = baseUpdateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    collectionRef: z.string(),
    recordRef: z.string(),
    method: z.string(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

// ===== _otps =====

export const OtpsResponseSchema = baseResponseSchema.extend({
    collectionName: z.literal('_otps'),
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    collectionRef: z.string(),
    recordRef: z.string(),
    created: z.string().optional(),
    updated: z.string().optional()
});

export const OtpsCreateSchema = baseCreateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    collectionRef: z.string(),
    recordRef: z.string(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

export const OtpsUpdateSchema = baseUpdateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    collectionRef: z.string(),
    recordRef: z.string(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

// ===== _externalAuths =====

export const ExternalAuthsResponseSchema = baseResponseSchema.extend({
    collectionName: z.literal('_externalAuths'),
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    collectionRef: z.string(),
    recordRef: z.string(),
    provider: z.string(),
    providerId: z.string(),
    created: z.string().optional(),
    updated: z.string().optional()
});

export const ExternalAuthsCreateSchema = baseCreateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    collectionRef: z.string(),
    recordRef: z.string(),
    provider: z.string(),
    providerId: z.string(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

export const ExternalAuthsUpdateSchema = baseUpdateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    collectionRef: z.string(),
    recordRef: z.string(),
    provider: z.string(),
    providerId: z.string(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

// ===== _authOrigins =====

export const AuthOriginsResponseSchema = baseResponseSchema.extend({
    collectionName: z.literal('_authOrigins'),
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    collectionRef: z.string(),
    recordRef: z.string(),
    fingerprint: z.string(),
    created: z.string().optional(),
    updated: z.string().optional()
});

export const AuthOriginsCreateSchema = baseCreateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    collectionRef: z.string(),
    recordRef: z.string(),
    fingerprint: z.string(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

export const AuthOriginsUpdateSchema = baseUpdateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    collectionRef: z.string(),
    recordRef: z.string(),
    fingerprint: z.string(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

// ===== _superusers =====

export const SuperusersResponseSchema = authResponseSchema.extend({
    collectionName: z.literal('_superusers'),
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    email: z.email(),
    emailVisibility: z.boolean().optional(),
    verified: z.boolean().optional(),
    created: z.string().optional(),
    updated: z.string().optional()
});

export const SuperusersCreateSchema = authCreateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    email: z.email(),
    emailVisibility: z.boolean().optional(),
    verified: z.boolean().optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

export const SuperusersUpdateSchema = authUpdateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    email: z.email(),
    emailVisibility: z.boolean().optional(),
    verified: z.boolean().optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

// ===== users =====

export const UsersResponseSchema = authResponseSchema.extend({
    collectionName: z.literal('users'),
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    email: z.email(),
    emailVisibility: z.boolean().optional(),
    verified: z.boolean().optional(),
    name: z.string().max(255).optional(),
    avatar: z.string().optional(),
    is_admin: z.boolean().optional(),
    created: z.string().optional(),
    updated: z.string().optional()
});

export const UsersCreateSchema = authCreateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    email: z.email(),
    emailVisibility: z.boolean().optional(),
    verified: z.boolean().optional(),
    name: z.string().max(255).optional(),
    avatar: z.instanceof(File).nullable().optional(),
    is_admin: z.boolean().optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

export const UsersUpdateSchema = authUpdateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    email: z.email(),
    emailVisibility: z.boolean().optional(),
    verified: z.boolean().optional(),
    name: z.string().max(255).optional(),
    avatar: z.instanceof(File).nullable().optional(),
    is_admin: z.boolean().optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

// ===== properties =====

export const PropertiesResponseSchema = baseResponseSchema.extend({
    collectionName: z.literal('properties'),
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    title: z.string(),
    description: z.string().optional(),
    listing_type: z.enum(['sale', 'rent']),
    property_type: z.enum(['house', 'apartment', 'condo', 'townhouse', 'duplex', 'studio', 'villa', 'land', 'commercial', 'industrial', 'farm']),
    status: z.enum(['draft', 'active', 'pending', 'sold', 'rented', 'off_market']),
    location: z.string(),
    street_address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postal_code: z.string().optional(),
    country: z.string().optional(),
    dimensions: z.string().optional(),
    building_size_sqft: z.number().optional(),
    lot_size_sqft: z.number().optional(),
    lot_size_acres: z.number().optional(),
    year_built: z.number().optional(),
    floors: z.number().optional(),
    beds: z.number().optional(),
    baths: z.number().optional(),
    parking_spaces: z.number().optional(),
    parking_type: z.enum(['', 'garage', 'carport', 'street', 'covered', 'assigned', 'none']).optional(),
    heating: z.enum(['', 'none', 'electric', 'gas', 'oil', 'heat_pump', 'solar', 'geothermal']).optional(),
    cooling: z.enum(['', 'none', 'central', 'wall_unit', 'evaporative', 'geothermal']).optional(),
    zoning: z.enum(['', 'residential', 'commercial', 'agricultural', 'industrial', 'mixed_use', 'recreational', 'other']).optional(),
    currency: z.string().optional(),
    price: z.number().optional(),
    sale_price: z.number().optional(),
    rental_price: z.number().optional(),
    security_deposit: z.number().optional(),
    hoa_fee: z.number().optional(),
    annual_taxes: z.number().optional(),
    available_from: z.string().optional(),
    image_url: z.url().optional(),
    images: z.array(z.string()).optional(),
    video_url: z.url().optional(),
    virtual_tour_url: z.url().optional(),
    amenities: z.union([z.record(z.string(), z.any()), z.array(z.any()), z.null()]).optional(),
    features: z.union([z.record(z.string(), z.any()), z.array(z.any()), z.null()]).optional(),
    utilities: z.union([z.record(z.string(), z.any()), z.array(z.any()), z.null()]).optional(),
    agent_id: z.string().optional(),
    owner_id: z.string().optional(),
    is_featured: z.boolean().optional(),
    is_new: z.boolean().optional(),
    location_point: z.unknown().optional(),
    created: z.string().optional(),
    updated: z.string().optional()
});

export const PropertiesCreateSchema = baseCreateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    title: z.string(),
    description: z.string().optional(),
    listing_type: z.enum(['sale', 'rent']),
    property_type: z.enum(['house', 'apartment', 'condo', 'townhouse', 'duplex', 'studio', 'villa', 'land', 'commercial', 'industrial', 'farm']),
    status: z.enum(['draft', 'active', 'pending', 'sold', 'rented', 'off_market']),
    location: z.string(),
    street_address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postal_code: z.string().optional(),
    country: z.string().optional(),
    dimensions: z.string().optional(),
    building_size_sqft: z.number().optional(),
    lot_size_sqft: z.number().optional(),
    lot_size_acres: z.number().optional(),
    year_built: z.number().optional(),
    floors: z.number().optional(),
    beds: z.number().optional(),
    baths: z.number().optional(),
    parking_spaces: z.number().optional(),
    parking_type: z.enum(['', 'garage', 'carport', 'street', 'covered', 'assigned', 'none']).optional(),
    heating: z.enum(['', 'none', 'electric', 'gas', 'oil', 'heat_pump', 'solar', 'geothermal']).optional(),
    cooling: z.enum(['', 'none', 'central', 'wall_unit', 'evaporative', 'geothermal']).optional(),
    zoning: z.enum(['', 'residential', 'commercial', 'agricultural', 'industrial', 'mixed_use', 'recreational', 'other']).optional(),
    currency: z.string().optional(),
    price: z.number().optional(),
    sale_price: z.number().optional(),
    rental_price: z.number().optional(),
    security_deposit: z.number().optional(),
    hoa_fee: z.number().optional(),
    annual_taxes: z.number().optional(),
    available_from: z.union([z.string(), z.date()]).optional(),
    image_url: z.union([z.url(), z.instanceof(URL)]).optional(),
    images: z.union([z.instanceof(File), z.array(z.instanceof(File))]).optional(),
    video_url: z.union([z.url(), z.instanceof(URL)]).optional(),
    virtual_tour_url: z.union([z.url(), z.instanceof(URL)]).optional(),
    amenities: z.union([z.record(z.string(), z.any()), z.array(z.any()), z.null()]).optional(),
    features: z.union([z.record(z.string(), z.any()), z.array(z.any()), z.null()]).optional(),
    utilities: z.union([z.record(z.string(), z.any()), z.array(z.any()), z.null()]).optional(),
    agent_id: z.string().optional(),
    owner_id: z.string().optional(),
    is_featured: z.boolean().optional(),
    is_new: z.boolean().optional(),
    location_point: z.unknown().optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

export const PropertiesUpdateSchema = baseUpdateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    title: z.string(),
    description: z.string().optional(),
    listing_type: z.enum(['sale', 'rent']),
    property_type: z.enum(['house', 'apartment', 'condo', 'townhouse', 'duplex', 'studio', 'villa', 'land', 'commercial', 'industrial', 'farm']),
    status: z.enum(['draft', 'active', 'pending', 'sold', 'rented', 'off_market']),
    location: z.string(),
    street_address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postal_code: z.string().optional(),
    country: z.string().optional(),
    dimensions: z.string().optional(),
    building_size_sqft: z.number().optional(),
    'building_size_sqft+': z.number().optional(),
    'building_size_sqft-': z.number().optional(),
    lot_size_sqft: z.number().optional(),
    'lot_size_sqft+': z.number().optional(),
    'lot_size_sqft-': z.number().optional(),
    lot_size_acres: z.number().optional(),
    'lot_size_acres+': z.number().optional(),
    'lot_size_acres-': z.number().optional(),
    year_built: z.number().optional(),
    'year_built+': z.number().optional(),
    'year_built-': z.number().optional(),
    floors: z.number().optional(),
    'floors+': z.number().optional(),
    'floors-': z.number().optional(),
    beds: z.number().optional(),
    'beds+': z.number().optional(),
    'beds-': z.number().optional(),
    baths: z.number().optional(),
    'baths+': z.number().optional(),
    'baths-': z.number().optional(),
    parking_spaces: z.number().optional(),
    'parking_spaces+': z.number().optional(),
    'parking_spaces-': z.number().optional(),
    parking_type: z.enum(['', 'garage', 'carport', 'street', 'covered', 'assigned', 'none']).optional(),
    heating: z.enum(['', 'none', 'electric', 'gas', 'oil', 'heat_pump', 'solar', 'geothermal']).optional(),
    cooling: z.enum(['', 'none', 'central', 'wall_unit', 'evaporative', 'geothermal']).optional(),
    zoning: z.enum(['', 'residential', 'commercial', 'agricultural', 'industrial', 'mixed_use', 'recreational', 'other']).optional(),
    currency: z.string().optional(),
    price: z.number().optional(),
    'price+': z.number().optional(),
    'price-': z.number().optional(),
    sale_price: z.number().optional(),
    'sale_price+': z.number().optional(),
    'sale_price-': z.number().optional(),
    rental_price: z.number().optional(),
    'rental_price+': z.number().optional(),
    'rental_price-': z.number().optional(),
    security_deposit: z.number().optional(),
    'security_deposit+': z.number().optional(),
    'security_deposit-': z.number().optional(),
    hoa_fee: z.number().optional(),
    'hoa_fee+': z.number().optional(),
    'hoa_fee-': z.number().optional(),
    annual_taxes: z.number().optional(),
    'annual_taxes+': z.number().optional(),
    'annual_taxes-': z.number().optional(),
    available_from: z.union([z.string(), z.date()]).optional(),
    image_url: z.union([z.url(), z.instanceof(URL)]).optional(),
    images: z.union([z.instanceof(File), z.array(z.instanceof(File))]).optional(),
    'images-': z.string().optional(),
    video_url: z.union([z.url(), z.instanceof(URL)]).optional(),
    virtual_tour_url: z.union([z.url(), z.instanceof(URL)]).optional(),
    amenities: z.union([z.record(z.string(), z.any()), z.array(z.any()), z.null()]).optional(),
    features: z.union([z.record(z.string(), z.any()), z.array(z.any()), z.null()]).optional(),
    utilities: z.union([z.record(z.string(), z.any()), z.array(z.any()), z.null()]).optional(),
    agent_id: z.string().optional(),
    owner_id: z.string().optional(),
    is_featured: z.boolean().optional(),
    is_new: z.boolean().optional(),
    location_point: z.unknown().optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

// ===== favorites =====

export const FavoritesResponseSchema = baseResponseSchema.extend({
    collectionName: z.literal('favorites'),
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    user_id: z.string(),
    property_id: z.string(),
    created: z.string().optional(),
    updated: z.string().optional()
});

export const FavoritesCreateSchema = baseCreateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    user_id: z.string(),
    property_id: z.string(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

export const FavoritesUpdateSchema = baseUpdateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    user_id: z.string(),
    property_id: z.string(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});


// Export all schemas
export const schemas = {
    _mfas: {
        response: MfasResponseSchema,
        create: MfasCreateSchema,
        update: MfasUpdateSchema,
    },
    _otps: {
        response: OtpsResponseSchema,
        create: OtpsCreateSchema,
        update: OtpsUpdateSchema,
    },
    _externalAuths: {
        response: ExternalAuthsResponseSchema,
        create: ExternalAuthsCreateSchema,
        update: ExternalAuthsUpdateSchema,
    },
    _authOrigins: {
        response: AuthOriginsResponseSchema,
        create: AuthOriginsCreateSchema,
        update: AuthOriginsUpdateSchema,
    },
    _superusers: {
        response: SuperusersResponseSchema,
        create: SuperusersCreateSchema,
        update: SuperusersUpdateSchema,
    },
    users: {
        response: UsersResponseSchema,
        create: UsersCreateSchema,
        update: UsersUpdateSchema,
    },
    properties: {
        response: PropertiesResponseSchema,
        create: PropertiesCreateSchema,
        update: PropertiesUpdateSchema,
    },
    favorites: {
        response: FavoritesResponseSchema,
        create: FavoritesCreateSchema,
        update: FavoritesUpdateSchema,
    },
};

export type Schemas = typeof schemas;

// Validation helpers
// Validation helpers for _mfas
export const _mfasValidators = {
    response: (data: unknown) => MfasResponseSchema.parse(data),
    safeResponse: (data: unknown) => MfasResponseSchema.safeParse(data),
    create: (data: unknown) => MfasCreateSchema.parse(data),
    safeCreate: (data: unknown) => MfasCreateSchema.safeParse(data),
    update: (data: unknown) => MfasUpdateSchema.parse(data),
    safeUpdate: (data: unknown) => MfasUpdateSchema.safeParse(data),
};

// Type inference helpers for _mfas
export type MfasResponse = z.infer<typeof MfasResponseSchema>;
export type MfasCreate = z.infer<typeof MfasCreateSchema>;
export type MfasUpdate = z.infer<typeof MfasUpdateSchema>;

// Validation helpers for _otps
export const _otpsValidators = {
    response: (data: unknown) => OtpsResponseSchema.parse(data),
    safeResponse: (data: unknown) => OtpsResponseSchema.safeParse(data),
    create: (data: unknown) => OtpsCreateSchema.parse(data),
    safeCreate: (data: unknown) => OtpsCreateSchema.safeParse(data),
    update: (data: unknown) => OtpsUpdateSchema.parse(data),
    safeUpdate: (data: unknown) => OtpsUpdateSchema.safeParse(data),
};

// Type inference helpers for _otps
export type OtpsResponse = z.infer<typeof OtpsResponseSchema>;
export type OtpsCreate = z.infer<typeof OtpsCreateSchema>;
export type OtpsUpdate = z.infer<typeof OtpsUpdateSchema>;

// Validation helpers for _externalAuths
export const _externalAuthsValidators = {
    response: (data: unknown) => ExternalAuthsResponseSchema.parse(data),
    safeResponse: (data: unknown) => ExternalAuthsResponseSchema.safeParse(data),
    create: (data: unknown) => ExternalAuthsCreateSchema.parse(data),
    safeCreate: (data: unknown) => ExternalAuthsCreateSchema.safeParse(data),
    update: (data: unknown) => ExternalAuthsUpdateSchema.parse(data),
    safeUpdate: (data: unknown) => ExternalAuthsUpdateSchema.safeParse(data),
};

// Type inference helpers for _externalAuths
export type ExternalAuthsResponse = z.infer<typeof ExternalAuthsResponseSchema>;
export type ExternalAuthsCreate = z.infer<typeof ExternalAuthsCreateSchema>;
export type ExternalAuthsUpdate = z.infer<typeof ExternalAuthsUpdateSchema>;

// Validation helpers for _authOrigins
export const _authOriginsValidators = {
    response: (data: unknown) => AuthOriginsResponseSchema.parse(data),
    safeResponse: (data: unknown) => AuthOriginsResponseSchema.safeParse(data),
    create: (data: unknown) => AuthOriginsCreateSchema.parse(data),
    safeCreate: (data: unknown) => AuthOriginsCreateSchema.safeParse(data),
    update: (data: unknown) => AuthOriginsUpdateSchema.parse(data),
    safeUpdate: (data: unknown) => AuthOriginsUpdateSchema.safeParse(data),
};

// Type inference helpers for _authOrigins
export type AuthOriginsResponse = z.infer<typeof AuthOriginsResponseSchema>;
export type AuthOriginsCreate = z.infer<typeof AuthOriginsCreateSchema>;
export type AuthOriginsUpdate = z.infer<typeof AuthOriginsUpdateSchema>;

// Validation helpers for _superusers
export const _superusersValidators = {
    response: (data: unknown) => SuperusersResponseSchema.parse(data),
    safeResponse: (data: unknown) => SuperusersResponseSchema.safeParse(data),
    create: (data: unknown) => SuperusersCreateSchema.parse(data),
    safeCreate: (data: unknown) => SuperusersCreateSchema.safeParse(data),
    update: (data: unknown) => SuperusersUpdateSchema.parse(data),
    safeUpdate: (data: unknown) => SuperusersUpdateSchema.safeParse(data),
};

// Type inference helpers for _superusers
export type SuperusersResponse = z.infer<typeof SuperusersResponseSchema>;
export type SuperusersCreate = z.infer<typeof SuperusersCreateSchema>;
export type SuperusersUpdate = z.infer<typeof SuperusersUpdateSchema>;

// Validation helpers for users
export const usersValidators = {
    response: (data: unknown) => UsersResponseSchema.parse(data),
    safeResponse: (data: unknown) => UsersResponseSchema.safeParse(data),
    create: (data: unknown) => UsersCreateSchema.parse(data),
    safeCreate: (data: unknown) => UsersCreateSchema.safeParse(data),
    update: (data: unknown) => UsersUpdateSchema.parse(data),
    safeUpdate: (data: unknown) => UsersUpdateSchema.safeParse(data),
};

// Type inference helpers for users
export type UsersResponse = z.infer<typeof UsersResponseSchema>;
export type UsersCreate = z.infer<typeof UsersCreateSchema>;
export type UsersUpdate = z.infer<typeof UsersUpdateSchema>;

// Validation helpers for properties
export const propertiesValidators = {
    response: (data: unknown) => PropertiesResponseSchema.parse(data),
    safeResponse: (data: unknown) => PropertiesResponseSchema.safeParse(data),
    create: (data: unknown) => PropertiesCreateSchema.parse(data),
    safeCreate: (data: unknown) => PropertiesCreateSchema.safeParse(data),
    update: (data: unknown) => PropertiesUpdateSchema.parse(data),
    safeUpdate: (data: unknown) => PropertiesUpdateSchema.safeParse(data),
};

// Type inference helpers for properties
export type PropertiesResponse = z.infer<typeof PropertiesResponseSchema>;
export type PropertiesCreate = z.infer<typeof PropertiesCreateSchema>;
export type PropertiesUpdate = z.infer<typeof PropertiesUpdateSchema>;

// Validation helpers for favorites
export const favoritesValidators = {
    response: (data: unknown) => FavoritesResponseSchema.parse(data),
    safeResponse: (data: unknown) => FavoritesResponseSchema.safeParse(data),
    create: (data: unknown) => FavoritesCreateSchema.parse(data),
    safeCreate: (data: unknown) => FavoritesCreateSchema.safeParse(data),
    update: (data: unknown) => FavoritesUpdateSchema.parse(data),
    safeUpdate: (data: unknown) => FavoritesUpdateSchema.safeParse(data),
};

// Type inference helpers for favorites
export type FavoritesResponse = z.infer<typeof FavoritesResponseSchema>;
export type FavoritesCreate = z.infer<typeof FavoritesCreateSchema>;
export type FavoritesUpdate = z.infer<typeof FavoritesUpdateSchema>;