/**
 * dsh-theme-neon — host half.
 *
 * Deliberately empty: the plugin only paints tokens in the browser, and the
 * browser half is loaded by dsh-client-modules from the `dsh.client` field in
 * package.json. The host entry exists because every profile bundle needs one.
 */

export const name = "dsh-theme-neon";

export function apply() {}
