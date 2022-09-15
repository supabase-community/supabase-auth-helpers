# @supabase/auth-helpers-sveltekit

## 0.6.11

### Patch Changes

- Updated dependencies [63b1da0]
  - @supabase/auth-helpers-shared@0.1.4

## 0.6.10

### Patch Changes

- 0ab05cf: Update format of x-client-info header

## 0.6.9

### Patch Changes

- 50669a6: Add x-client-info header to show package name and version

## 0.6.8

### Patch Changes

- 8e0b747: Change error handling to not show flow disruption errors

## 0.6.7

### Patch Changes

- 0298db1: Rename skHelper method to createSupabaseClient

## 0.6.6

### Patch Changes

- 56228e3: Remove the need for user to create /api/auth/user and /api/auth/callback endpoints
- 56228e3: Add getProviderToken helper method
- Updated dependencies [56228e3]
  - @supabase/auth-helpers-shared@0.1.3

## 0.6.5

### Patch Changes

- 69fefcb: Change logger to be a wrapper for console

## 0.6.4

### Patch Changes

- 38ccf1c: Logger can be imported in your own project for setting log levels
- Updated dependencies [38ccf1c]
  - @supabase/auth-helpers-shared@0.1.2

## 0.6.3

### Patch Changes

- 9dda264: Add better error handling and error codes
- 9dda264: Fix supabaseServerClient with request and withApiAuth return type
- Updated dependencies [9dda264]
  - @supabase/auth-helpers-shared@0.1.1

## 0.6.2

### Patch Changes

- d23b268: [breaking change] Update the getUser function to only get the user and not save the token
- 1c95004: Add new handleAuth function to export all hooks as an array to destructure
- 588d329: Add handleLogout hook for logging out via endpoint /api/auth/logout

## 0.6.1

### Patch Changes

- 2f2abf2: Fix session being overwritten in SupaAuthHelper

## 0.6.0

### Minor Changes

- 1e56b35: Add file extension to es modules imports

## 0.5.0

### Minor Changes

- f854c7f: Remove unused helper files

## 0.4.0

### Minor Changes

- 865cc4a: Update packages to compile to esm

## 0.3.0

### Minor Changes

- f399820: Using shared package as a dependency
  Update sveltekit package with latest code to update tokens

## 0.2.0

### Minor Changes

- 5d741ae: Remove svelte-preprocess from sveltekit package

## 0.1.0

### Minor Changes

- de01c86: Initial release of svelte integration
