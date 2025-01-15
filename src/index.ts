import path from 'node:path';
import { findUp, findUpSync } from '@smushytaco/find-up-simple';
import {
    readPackage,
    readPackageSync,
    type Options as ReadPackageOptions,
    type NormalizeOptions as ReadPackageNormalizeOptions,
    type PackageJson,
    type NormalizedPackageJson
} from '@smushytaco/read-pkg';
import { type Except } from 'type-fest';

export type Options = {
    /**
     * The directory to start looking for a package.json file.
     *
     * @default process.cwd()
     */
    cwd?: URL | string;
} & Except<ReadPackageOptions, 'cwd'>;

export type NormalizeOptions = {
    /**
     * The directory to start looking for a package.json file.
     *
     * @default process.cwd()
     */
    cwd?: URL | string;
} & Except<ReadPackageNormalizeOptions, 'cwd'>;

export type ReadResult = {
    packageJson: PackageJson;
    path: string;
};

export type NormalizedReadResult = {
    packageJson: NormalizedPackageJson;
    path: string;
};

// noinspection JSUnusedGlobalSymbols
/**
 * Read the closest `package.json` file asynchronously.
 *
 * @example
 * ```
 * import { readPackageUp } from './index';
 *
 * console.log(await readPackageUp());
 * // {
 * //   packageJson: {
 * //     name: 'awesome-package',
 * //     version: '1.0.0',
 * //     …
 * //   },
 * //   path: '/Users/sindresorhus/dev/awesome-package/package.json'
 * // }
 * ```
 */
export async function readPackageUp<T extends Options | NormalizeOptions>(
    options?: T
): Promise<
    T extends NormalizeOptions
        ? NormalizedReadResult | undefined
        : ReadResult | undefined
> {
    const filePath = await findUp('package.json', options);
    if (!filePath) {
        return;
    }

    return {
        packageJson: await readPackage({
            ...options,
            cwd: path.dirname(filePath)
        }),
        path: filePath
    } as T extends NormalizeOptions ? NormalizedReadResult : ReadResult;
}

// noinspection JSUnusedGlobalSymbols
/**
 * Synchronously read the closest `package.json` file.
 *
 * @example
 * ```
 * import { readPackageUpSync } from './index';
 *
 * console.log(readPackageUpSync());
 * // {
 * //   packageJson: {
 * //     name: 'awesome-package',
 * //     version: '1.0.0',
 * //     …
 * //   },
 * //   path: '/Users/sindresorhus/dev/awesome-package/package.json'
 * // }
 * ```
 */
export function readPackageUpSync<T extends Options | NormalizeOptions>(
    options?: T
): T extends NormalizeOptions
    ? NormalizedReadResult | undefined
    : ReadResult | undefined {
    const filePath = findUpSync('package.json', options);
    if (!filePath) {
        return;
    }

    return {
        packageJson: readPackageSync({
            ...options,
            cwd: path.dirname(filePath)
        }),
        path: filePath
    } as T extends NormalizeOptions ? NormalizedReadResult : ReadResult;
}

export { PackageJson, NormalizedPackageJson } from '@smushytaco/read-pkg';
