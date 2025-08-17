// Unwrap an array type to its element, otherwise keep the type
type UnwrapArray<T> = T extends Array<infer U> ? U : T;

// Map all properties of a relations object to their unwrapped values
type UnwrapRelations<R extends Record<string, unknown>> = {
  [K in keyof R]: UnwrapArray<R[K]>;
};

// Example: using your generated types
// type PropsRelations = PropertiesCollection["relations"];
// Result: { agent_id: UsersCollection; owner_id: UsersCollection; favorites_via_property_id: FavoritesCollection; }
// type PropsSingleRelations = UnwrapRelations<PropsRelations>;


