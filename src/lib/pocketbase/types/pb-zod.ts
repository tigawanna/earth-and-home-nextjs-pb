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

export const MfasResponseZodSchema = baseResponseSchema.extend({
    collectionName: z.literal('_mfas'),
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    collectionRef: z.string(),
    recordRef: z.string(),
    method: z.string(),
    created: z.string().optional(),
    updated: z.string().optional()
});

export const MfasCreateZodSchema = baseCreateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    collectionRef: z.string(),
    recordRef: z.string(),
    method: z.string(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

export const MfasUpdateZodSchema = baseUpdateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/),
    collectionRef: z.string().optional(),
    recordRef: z.string().optional(),
    method: z.string().optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

// ===== _otps =====

export const OtpsResponseZodSchema = baseResponseSchema.extend({
    collectionName: z.literal('_otps'),
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    collectionRef: z.string(),
    recordRef: z.string(),
    created: z.string().optional(),
    updated: z.string().optional()
});

export const OtpsCreateZodSchema = baseCreateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    collectionRef: z.string(),
    recordRef: z.string(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

export const OtpsUpdateZodSchema = baseUpdateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/),
    collectionRef: z.string().optional(),
    recordRef: z.string().optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

// ===== _externalAuths =====

export const ExternalAuthsResponseZodSchema = baseResponseSchema.extend({
    collectionName: z.literal('_externalAuths'),
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    collectionRef: z.string(),
    recordRef: z.string(),
    provider: z.string(),
    providerId: z.string(),
    created: z.string().optional(),
    updated: z.string().optional()
});

export const ExternalAuthsCreateZodSchema = baseCreateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    collectionRef: z.string(),
    recordRef: z.string(),
    provider: z.string(),
    providerId: z.string(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

export const ExternalAuthsUpdateZodSchema = baseUpdateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/),
    collectionRef: z.string().optional(),
    recordRef: z.string().optional(),
    provider: z.string().optional(),
    providerId: z.string().optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

// ===== _authOrigins =====

export const AuthOriginsResponseZodSchema = baseResponseSchema.extend({
    collectionName: z.literal('_authOrigins'),
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    collectionRef: z.string(),
    recordRef: z.string(),
    fingerprint: z.string(),
    created: z.string().optional(),
    updated: z.string().optional()
});

export const AuthOriginsCreateZodSchema = baseCreateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    collectionRef: z.string(),
    recordRef: z.string(),
    fingerprint: z.string(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

export const AuthOriginsUpdateZodSchema = baseUpdateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/),
    collectionRef: z.string().optional(),
    recordRef: z.string().optional(),
    fingerprint: z.string().optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

// ===== _superusers =====

export const SuperusersResponseZodSchema = authResponseSchema.extend({
    collectionName: z.literal('_superusers'),
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    email: z.email(),
    emailVisibility: z.boolean().optional(),
    verified: z.boolean().optional(),
    created: z.string().optional(),
    updated: z.string().optional()
});

export const SuperusersCreateZodSchema = authCreateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    email: z.email(),
    emailVisibility: z.boolean().optional(),
    verified: z.boolean().optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

export const SuperusersUpdateZodSchema = authUpdateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/),
    email: z.email().optional(),
    emailVisibility: z.boolean().optional(),
    verified: z.boolean().optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

// ===== users =====

export const UsersResponseZodSchema = authResponseSchema.extend({
    collectionName: z.literal('users'),
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    email: z.email(),
    emailVisibility: z.boolean().optional(),
    verified: z.boolean().optional(),
    name: z.string().max(255).optional(),
    avatar: z.string().optional(),
    is_admin: z.boolean().optional(),
    is_banned: z.boolean().optional(),
    created: z.string().optional(),
    updated: z.string().optional()
});

export const UsersCreateZodSchema = authCreateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    email: z.email(),
    emailVisibility: z.boolean().optional(),
    verified: z.boolean().optional(),
    name: z.string().max(255).optional(),
    avatar: z.instanceof(File).nullable().optional(),
    is_admin: z.boolean().optional(),
    is_banned: z.boolean().optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

export const UsersUpdateZodSchema = authUpdateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/),
    email: z.email().optional(),
    emailVisibility: z.boolean().optional(),
    verified: z.boolean().optional(),
    name: z.string().max(255).optional(),
    avatar: z.instanceof(File).nullable().optional(),
    is_admin: z.boolean().optional(),
    is_banned: z.boolean().optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

// ===== properties =====

export const PropertiesResponseZodSchema = baseResponseSchema.extend({
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

export const PropertiesCreateZodSchema = baseCreateSchema.extend({
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

export const PropertiesUpdateZodSchema = baseUpdateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/),
    title: z.string().optional(),
    description: z.string().optional(),
    listing_type: z.enum(['sale', 'rent']).optional(),
    property_type: z.enum(['house', 'apartment', 'condo', 'townhouse', 'duplex', 'studio', 'villa', 'land', 'commercial', 'industrial', 'farm']).optional(),
    status: z.enum(['draft', 'active', 'pending', 'sold', 'rented', 'off_market']).optional(),
    location: z.string().optional(),
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

export const FavoritesResponseZodSchema = baseResponseSchema.extend({
    collectionName: z.literal('favorites'),
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    user_id: z.string(),
    property_id: z.string(),
    created: z.string().optional(),
    updated: z.string().optional()
});

export const FavoritesCreateZodSchema = baseCreateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    user_id: z.string(),
    property_id: z.string(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

export const FavoritesUpdateZodSchema = baseUpdateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/),
    user_id: z.string().optional(),
    property_id: z.string().optional(),
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
    response: (data: unknown) => MfasResponseZodSchema.parse(data),
    safeResponse: (data: unknown) => MfasResponseZodSchema.safeParse(data),
    create: (data: unknown) => MfasCreateZodSchema.parse(data),
    safeCreate: (data: unknown) => MfasCreateZodSchema.safeParse(data),
    update: (data: unknown) => MfasUpdateZodSchema.parse(data),
    safeUpdate: (data: unknown) => MfasUpdateZodSchema.safeParse(data),
};

// Type inference helpers for _mfas
export type MfasResponseZod = z.infer<typeof MfasResponseZodSchema>;
export type MfasCreateZod = z.infer<typeof MfasCreateZodSchema>;
export type MfasUpdateZod = z.infer<typeof MfasUpdateZodSchema>;

// Validation helpers for _otps
export const _otpsValidators = {
    response: (data: unknown) => OtpsResponseZodSchema.parse(data),
    safeResponse: (data: unknown) => OtpsResponseZodSchema.safeParse(data),
    create: (data: unknown) => OtpsCreateZodSchema.parse(data),
    safeCreate: (data: unknown) => OtpsCreateZodSchema.safeParse(data),
    update: (data: unknown) => OtpsUpdateZodSchema.parse(data),
    safeUpdate: (data: unknown) => OtpsUpdateZodSchema.safeParse(data),
};

// Type inference helpers for _otps
export type OtpsResponseZod = z.infer<typeof OtpsResponseZodSchema>;
export type OtpsCreateZod = z.infer<typeof OtpsCreateZodSchema>;
export type OtpsUpdateZod = z.infer<typeof OtpsUpdateZodSchema>;

// Validation helpers for _externalAuths
export const _externalAuthsValidators = {
    response: (data: unknown) => ExternalAuthsResponseZodSchema.parse(data),
    safeResponse: (data: unknown) => ExternalAuthsResponseZodSchema.safeParse(data),
    create: (data: unknown) => ExternalAuthsCreateZodSchema.parse(data),
    safeCreate: (data: unknown) => ExternalAuthsCreateZodSchema.safeParse(data),
    update: (data: unknown) => ExternalAuthsUpdateZodSchema.parse(data),
    safeUpdate: (data: unknown) => ExternalAuthsUpdateZodSchema.safeParse(data),
};

// Type inference helpers for _externalAuths
export type ExternalAuthsResponseZod = z.infer<typeof ExternalAuthsResponseZodSchema>;
export type ExternalAuthsCreateZod = z.infer<typeof ExternalAuthsCreateZodSchema>;
export type ExternalAuthsUpdateZod = z.infer<typeof ExternalAuthsUpdateZodSchema>;

// Validation helpers for _authOrigins
export const _authOriginsValidators = {
    response: (data: unknown) => AuthOriginsResponseZodSchema.parse(data),
    safeResponse: (data: unknown) => AuthOriginsResponseZodSchema.safeParse(data),
    create: (data: unknown) => AuthOriginsCreateZodSchema.parse(data),
    safeCreate: (data: unknown) => AuthOriginsCreateZodSchema.safeParse(data),
    update: (data: unknown) => AuthOriginsUpdateZodSchema.parse(data),
    safeUpdate: (data: unknown) => AuthOriginsUpdateZodSchema.safeParse(data),
};

// Type inference helpers for _authOrigins
export type AuthOriginsResponseZod = z.infer<typeof AuthOriginsResponseZodSchema>;
export type AuthOriginsCreateZod = z.infer<typeof AuthOriginsCreateZodSchema>;
export type AuthOriginsUpdateZod = z.infer<typeof AuthOriginsUpdateZodSchema>;

// Validation helpers for _superusers
export const _superusersValidators = {
    response: (data: unknown) => SuperusersResponseZodSchema.parse(data),
    safeResponse: (data: unknown) => SuperusersResponseZodSchema.safeParse(data),
    create: (data: unknown) => SuperusersCreateZodSchema.parse(data),
    safeCreate: (data: unknown) => SuperusersCreateZodSchema.safeParse(data),
    update: (data: unknown) => SuperusersUpdateZodSchema.parse(data),
    safeUpdate: (data: unknown) => SuperusersUpdateZodSchema.safeParse(data),
};

// Type inference helpers for _superusers
export type SuperusersResponseZod = z.infer<typeof SuperusersResponseZodSchema>;
export type SuperusersCreateZod = z.infer<typeof SuperusersCreateZodSchema>;
export type SuperusersUpdateZod = z.infer<typeof SuperusersUpdateZodSchema>;

// Validation helpers for users
export const usersValidators = {
    response: (data: unknown) => UsersResponseZodSchema.parse(data),
    safeResponse: (data: unknown) => UsersResponseZodSchema.safeParse(data),
    create: (data: unknown) => UsersCreateZodSchema.parse(data),
    safeCreate: (data: unknown) => UsersCreateZodSchema.safeParse(data),
    update: (data: unknown) => UsersUpdateZodSchema.parse(data),
    safeUpdate: (data: unknown) => UsersUpdateZodSchema.safeParse(data),
};

// Type inference helpers for users
export type UsersResponseZod = z.infer<typeof UsersResponseZodSchema>;
export type UsersCreateZod = z.infer<typeof UsersCreateZodSchema>;
export type UsersUpdateZod = z.infer<typeof UsersUpdateZodSchema>;

// Validation helpers for properties
export const propertiesValidators = {
    response: (data: unknown) => PropertiesResponseZodSchema.parse(data),
    safeResponse: (data: unknown) => PropertiesResponseZodSchema.safeParse(data),
    create: (data: unknown) => PropertiesCreateZodSchema.parse(data),
    safeCreate: (data: unknown) => PropertiesCreateZodSchema.safeParse(data),
    update: (data: unknown) => PropertiesUpdateZodSchema.parse(data),
    safeUpdate: (data: unknown) => PropertiesUpdateZodSchema.safeParse(data),
};

// Type inference helpers for properties
export type PropertiesResponseZod = z.infer<typeof PropertiesResponseZodSchema>;
export type PropertiesCreateZod = z.infer<typeof PropertiesCreateZodSchema>;
export type PropertiesUpdateZod = z.infer<typeof PropertiesUpdateZodSchema>;

// Validation helpers for favorites
export const favoritesValidators = {
    response: (data: unknown) => FavoritesResponseZodSchema.parse(data),
    safeResponse: (data: unknown) => FavoritesResponseZodSchema.safeParse(data),
    create: (data: unknown) => FavoritesCreateZodSchema.parse(data),
    safeCreate: (data: unknown) => FavoritesCreateZodSchema.safeParse(data),
    update: (data: unknown) => FavoritesUpdateZodSchema.parse(data),
    safeUpdate: (data: unknown) => FavoritesUpdateZodSchema.safeParse(data),
};

// Type inference helpers for favorites
export type FavoritesResponseZod = z.infer<typeof FavoritesResponseZodSchema>;
export type FavoritesCreateZod = z.infer<typeof FavoritesCreateZodSchema>;
export type FavoritesUpdateZod = z.infer<typeof FavoritesUpdateZodSchema>;