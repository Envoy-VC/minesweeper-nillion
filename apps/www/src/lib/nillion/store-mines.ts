import { UserKey } from '@nillion/nillion-client-js-browser';

import { nillionConfig } from './config';

import type { JsInput } from '~/types/nillion';

const storeMines = async (
  nillion: any,
  nillionClient: any,
  secretsToStore: JsInput[],
  program_id: string,
  usersWithRetrievePermissions: string[] = [],
  usersWithUpdatePermissions: string[] = [],
  usersWithDeletePermissions: string[] = [],
  usersWithComputePermissions: string[] = []
): Promise<string> => {
  try {
    const admin = UserKey.from_seed('admin');
    const admin_pub_k = admin.public_key();
    const secrets = new nillion.Secrets();

    for (const secret of secretsToStore) {
      const newSecret = nillion.Secret.new_integer(secret.value.toString());
      secrets.insert(secret.name, newSecret);
    }

    const user_id = nillionClient.user_id;
    const permissions = nillion.Permissions.default_for_user(user_id);

    const computePermissions: { [key: string]: string[] } = {};
    for (const user of usersWithComputePermissions) {
      computePermissions[user] = [program_id];
    }

    permissions.add_compute_permissions(computePermissions);
    permissions.add_retrieve_permissions([
      ...usersWithRetrievePermissions,
      admin_pub_k,
    ]);
    permissions.add_update_permissions(usersWithUpdatePermissions);
    permissions.add_delete_permissions(usersWithDeletePermissions);

    const store_id = await nillionClient.store_secrets(
      nillionConfig.cluster_id,
      secrets,
      null,
      permissions
    );
    return store_id;
  } catch (error) {
    console.log(error);
    return 'error';
  }
};

export default storeMines;
