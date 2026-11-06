import { ok, type Option, type ResultOk } from "@chocbite/ts-lib-result";
import st, { type StateROAW } from "@chocbite/ts-lib-state";

let name_transformer: ((name: string) => string) | undefined;
export const settings_set_name_transform = (
  transform: (name: string) => string,
) => {
  name_transformer = transform;
};

const packages = localStorage["storage/packageVersions"] as string | undefined;
let package_versions: { [key: string]: string } = {};
try {
  package_versions = packages
    ? (JSON.parse(packages) as { [key: string]: string })
    : {};
} catch (_e) {}
let store_package_versions_timeout: number | undefined;
const BOTTOM_GROUPS: { [key: string]: StorageGroup } = {};

/**Initialises the storage for the package
 * @param package_name use import {name} from ("../package.json")
 * @param package_version use import {version} from ("../package.json")*/
export const storage_init = (package_name: string, package_version: string) => {
  if (name_transformer) package_name = name_transformer(package_name);
  let changed: string | undefined;
  if (package_versions[package_name] !== package_version) {
    changed = package_versions[package_name];
    package_versions[package_name] = package_version;
    if (store_package_versions_timeout)
      clearTimeout(store_package_versions_timeout);
    store_package_versions_timeout = window.setTimeout(() => {
      localStorage["storage/packageVersions"] =
        JSON.stringify(package_versions);
    }, 1000);
  }
  return (BOTTOM_GROUPS[package_name] = new StorageGroup(
    package_name,
    changed ? changed : undefined,
  ));
};

class Storage {
  readonly state: StateROAW<any>;
  constructor(state: StateROAW<any>) {
    this.state = state;
  }
}

/**Group of storage should never be instantiated manually use storage_init*/
export class StorageGroup {
  private path_id: string;
  private settings: { [key: string]: Storage } = {};
  private sub_groups: { [key: string]: StorageGroup } = {};
  readonly version_changed: string | undefined;

  constructor(path: string, version_changed?: string) {
    this.version_changed = version_changed;
    this.path_id = path;
  }

  /**Makes a storage subgroup for this group
   * @param id unique identifier for this subgroup in the parent group*/
  make_sub_group(id: string) {
    if (id in this.sub_groups)
      throw new Error("Sub group already registered " + id);
    return (this.sub_groups[id] = new StorageGroup(
      this.path_id + "/" + id,
      this.version_changed,
    ));
  }

  /**Gets value of storage or fallbacks to default
   * @param id unique identifier for this storage in the parent group
   * @param fallback value to use if no storage is stored
   * @param check function to check if the stored value is valid, if not the fallback will be used
   * @param version_changed function called when the version of the package changed to migrate old value to new formats */
  get<T>(
    id: string,
    fallback: T,
    check?: (parsed: unknown) => Option<T>,
    version_changed?: (existing: string, oldVersion: string) => T,
  ): ResultOk<T> {
    const saved = localStorage.getItem(this.path_id + "/" + id);
    if (saved === null) return ok(fallback);
    try {
      if (this.version_changed && version_changed) {
        const changed_value = version_changed(saved, this.version_changed);
        localStorage.setItem(
          this.path_id + "/" + id,
          JSON.stringify(changed_value),
        );
        return ok(changed_value);
      }
      if (check) return ok(check(JSON.parse(saved)).unwrap_or(fallback));
      return ok(JSON.parse(saved) as T);
    } catch (e) {
      return ok(fallback);
    }
  }

  /**Sets value of storage, that has not been registered to a state
   * @param id unique identifier for this storage in the parent group
   * @param value value to set*/
  set(id: string, value: any) {
    if (id in this.settings)
      throw new Error("Storage is registered " + this.path_id + "/" + id);
    localStorage[this.path_id + "/" + id] = JSON.stringify(value);
  }

  /**Registers a state to storage
   * @param id unique identifier for this storage in the parent group
   * @param state state object representing the storage's value */
  register<READ>(
    id: string,
    state: StateROAW<READ>,
    transform?: (state: StateROAW<READ>) => PromiseLike<string>,
  ) {
    if (id in this.settings)
      throw new Error("Storage already registered " + this.path_id + "/" + id);
    this.settings[id] = new Storage(state);
    st.v.viewer(state, async () => {
      localStorage[this.path_id + "/" + id] = await (transform
        ? transform(state)
        : state.to_json());
    });
  }
}
