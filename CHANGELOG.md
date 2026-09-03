# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.2] - 2026-09-03

### Added

- Enabled dependabot version updates.
- Added `CHANGELOG.md`.

### Changed

- Updated NPM package description and tags.

## [1.1.1] - 2026-09-03

### Added

- Added benchmark results and rewrote architecture documentation.
- Highlighted number-only constraint in README.
- Implemented `mitata` benchmarks vs `denque` and `yocto-queue`.

## [1.1.0] - 2026-09-02

### Added

- Added `getCapacity()` method.
- Added optimisation details and CI badge to documentation.

### Changed

- Used bitwise masking for pointer wrapping, radically optimizing performance and dropping the modulo operator.

## [1.0.5] - 2026-08-30

### Added

- Added coverage script to `package.json`.

### Changed

- Bumped Node version to `24.x` in GitHub Actions.
- Updated `esbuild` to resolve security vulnerability.

## [1.0.4] - 2026-08-30

### Fixed

- Restored `registry-url` for NPM publishing via GitHub Actions.

## [1.0.3] - 2026-08-30

### Fixed

- Fixed NPM publishing workflow.
- Fixed wrong GitHub repository URL.

## [1.0.2] - 2026-08-30

### Added

- Added comprehensive API reference to README.
- Implemented iterable protocol (`[Symbol.iterator]`).
- Added `peek()` and `clear()` methods.

### Changed

- Optimised resize performance using native block memory copying (`.set()` and `.subarray()`).

## [1.0.1] - 2026-08-30

### Added

- Added JSDoc comments to public methods.
- Setup GitHub Actions CI/CD.

### Changed

- Removed `package-lock.json` from `.gitignore`.

## [1.0.0] - 2026-08-29

### Added

- Initial implementation of the `Float64RingQueue`.
- Added automated Vitest tests.
- Added `README.md`.
